const Product = require('../models/Product');
const Order = require('../models/Order');

const { checkTransactionLimit } = require('../services/guardrails_service');
const { createRazorpayOrder } = require('../services/razorpay_service');
const { logEvent } = require('../services/audit_service');

const transact = async (req, res) => {
  try {
    const {
      agent_id,
      items,
      shipping_address
    } = req.body;

    // 1. Validate request
    if (!agent_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'agent_id and items are required',
      });
    }

    if (!shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'shipping_address is required',
      });
    }

    // 2. Fetch products from MongoDB
    const productIds = items.map((item) => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      purchase_supported: true,
    });

    // 3. Validate products and calculate total
    let total = 0;
    const orderItems = [];

    for (const requestedItem of items) {
      const product = products.find(
        (p) => p._id.toString() === requestedItem.productId
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${requestedItem.productId} not found or not purchasable`,
        });
      }

      const quantity = Number(requestedItem.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}`,
        });
      }

      // 4. Stock validation
      if (product.stock < quantity) {
        await logEvent({
          action: 'AGENT_TRANSACTION_REJECTED',
          actor: 'ai',
          amount: total,
          reason: `${product.name} has insufficient stock`,
          relatedProduct: product._id,
          sessionId: `agent_${agent_id}`,
          approvalStatus: 'not_required',
          decisionType: 'REJECTED_STOCK',
          reasoningTrace:
            `External AI requested ${quantity} unit(s) of ${product.name}, but only ${product.stock} unit(s) are currently available.`,
          result: 'failure',
        });

        return res.status(409).json({
          success: false,
          message: `${product.name} is out of stock or has insufficient stock`,
          availableStock: product.stock,
        });
      }

      total += product.price * quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity,
        price: product.price,
      });
    }

    // 5. Use existing ₹2,000 guardrail
    const sessionId = `agent_${agent_id}`;

    const guardrailCheck = await checkTransactionLimit(
      total,
      sessionId
    );

    // 6. Create Order
    const order = await Order.create({
      session_Id: sessionId,
      item: orderItems,
      total_price: total,
      razorpay_order_Id: `pending_${Date.now()}`,
      status: 'created',
      required_Approval: guardrailCheck.requiresApproval,
      shipping_address,
    });

    // 7. If amount exceeds autonomous limit
    if (guardrailCheck.requiresApproval) {

      await logEvent({
        action: 'AGENT_TRANSACTION_ESCALATED',
        actor: 'ai',
        amount: total,
        reason: guardrailCheck.reason,
        relatedOrder: order._id,
        sessionId,
        approvalStatus: 'pending',
        decisionType: 'ESCALATED_HUMAN_APPROVAL',
        reasoningTrace:
          `External AI requested a transaction of ₹${total}. ` +
          `The autonomous transaction limit is ₹${guardrailCheck.transactionLimit}. ` +
          `Human approval is required before payment can proceed.`,
        result: 'success',
      });

      return res.status(202).json({
        success: true,
        requiresApproval: true,
        message:
          'Transaction exceeds the autonomous limit and requires merchant approval.',
        data: {
          orderId: order._id,
          totalAmount: total,
          transactionLimit: guardrailCheck.transactionLimit,
          status: 'PENDING_APPROVAL',
        },
      });
    }

    // 8. Autonomous transaction → Razorpay
    const razorpayOrder = await createRazorpayOrder(
      total,
      order._id.toString()
    );

    order.razorpay_order_Id = razorpayOrder.id;
    await order.save();

    // 9. Audit successful autonomous transaction
    await logEvent({
      action: 'AGENT_TRANSACTION_APPROVED',
      actor: 'ai',
      amount: total,
      relatedOrder: order._id,
      sessionId,
      approvalStatus: 'not_required',
      decisionType: 'AUTONOMOUS_APPROVED',
      reasoningTrace:
        `External AI requested ₹${total}. ` +
        `All requested products were purchasable and in stock. ` +
        `The amount is within the autonomous limit of ₹${guardrailCheck.transactionLimit}. ` +
        `Razorpay payment order was created programmatically.`,
      reason: 'Agent transaction approved within autonomous limit',
      result: 'success',
    });

    return res.status(200).json({
      success: true,
      requiresApproval: false,
      message: 'Agent transaction approved and payment order created.',
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        totalAmount: total,
        currency: 'INR',
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
    });

  } catch (error) {

    console.error('AGENT TRANSACTION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Agent transaction failed',
      error: error.message,
    });
  }
};

module.exports = {
  transact,
};