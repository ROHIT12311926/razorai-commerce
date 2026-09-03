const Cart = require('../models/Cart');
const Order = require('../models/Order');

const {
  logEvent,
} = require('../services/audit_service');

require('dotenv').config();

const {
  createRazorpayOrder,
  verifyPaymentSignature,
} = require('../services/razorpay_service');

const {
  checkTransactionLimit,
} = require('../services/guardrails_service');


// ======================================================
// INITIATE CHECKOUT
// ======================================================

const initiateCheckout = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const cart = await Cart.findOne({
      session_id: sessionId,
      status: 'active',
    }).populate('item.product');

    if (!cart || cart.item.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    let total = 0;

    const orderItems = cart.item.map((item) => {
      total += item.priceAtAdd * item.quantity;

      return {
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.priceAtAdd,
      };
    });

    // ==================================================
    // GUARDRAIL CHECK
    // ==================================================

    const guardrailCheck =
      await checkTransactionLimit(total, sessionId);


    // ==================================================
    // CREATE ORDER
    // ==================================================

    const order = await Order.create({
      session_Id: sessionId,

      item: orderItems,

      total_price: total,

      razorpay_order_Id: null,

      status: guardrailCheck.requiresApproval
        ? 'pending_confirmation'
        : 'created',

      required_Approval:
        guardrailCheck.requiresApproval,
    });


    // ==================================================
    // AUDIT LOG
    // ==================================================

    await logEvent({
      action: guardrailCheck.requiresApproval
        ? 'CUSTOMER_CONFIRMATION_REQUIRED'
        : 'checkout_initiated',

      actor: 'ai',

      amount: total,

      reason: guardrailCheck.requiresApproval
        ? guardrailCheck.reason
        : `AI initiated checkout with ${orderItems.length} item(s)`,

      reasoningTrace: guardrailCheck.requiresApproval
        ? `Cart total ₹${total} exceeds the autonomous limit of ₹${guardrailCheck.transactionLimit}. Customer confirmation is required before payment can proceed.`
        : `Cart total ₹${total} is within the autonomous spending limit of ₹${guardrailCheck.transactionLimit}. AI can proceed with Razorpay payment.`,

      decisionType: guardrailCheck.requiresApproval
        ? 'CUSTOMER_CONFIRMATION_REQUIRED'
        : 'AUTONOMOUS_APPROVED',

      relatedOrder: order._id,

      sessionId,

      approvalStatus: guardrailCheck.requiresApproval
        ? 'pending'
        : 'not_required',

      result: 'success',
    });


    // ==================================================
    // HIGH VALUE TRANSACTION
    // CUSTOMER CONFIRMATION REQUIRED
    // ==================================================

    if (guardrailCheck.requiresApproval) {
      return res.status(200).json({
        success: true,

        requiresConfirmation: true,

        message:
          'Customer confirmation required before payment can proceed.',

        data: {
          orderId: order._id,

          totalAmount: total,

          currency: 'INR',

          transactionLimit:
            guardrailCheck.transactionLimit,

          reason: guardrailCheck.reason,

          status: 'PENDING_CUSTOMER_CONFIRMATION',
        },
      });
    }


    // ==================================================
    // AUTONOMOUS TRANSACTION
    // ==================================================

    const razorpayOrder =
      await createRazorpayOrder(
        total,
        order._id.toString()
      );

    order.razorpay_order_Id =
      razorpayOrder.id;

    await order.save();


    await logEvent({
      action: 'payment_order_created',

      actor: 'system',

      amount: total,

      reason:
        'Razorpay order created within autonomous limit',

      reasoningTrace:
        `Cart total ₹${total} was verified against the autonomous limit of ₹${guardrailCheck.transactionLimit}.`,

      decisionType:
        'AUTONOMOUS_APPROVED',

      relatedOrder: order._id,

      sessionId,

      result: 'success',
    });


    return res.status(200).json({
      success: true,

      requiresConfirmation: false,

      message:
        'Transaction approved autonomously and payment order created.',

      data: {
        orderId: order._id,

        razorpayOrderId:
          razorpayOrder.id,

        totalAmount: total,

        currency: 'INR',

        razorpayKeyId:
          process.env.RAZORPAY_KEY_ID,
      },
    });

  } catch (error) {
    console.error(
      'CHECKOUT ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Checkout failed',
      error: error.message,
    });
  }
};


// ======================================================
// CUSTOMER CONFIRMS HIGH VALUE TRANSACTION
// ======================================================

const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order =
      await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }


    if (
      order.status !==
      'pending_confirmation'
    ) {
      return res.status(400).json({
        success: false,

        message:
          'This order is not waiting for customer confirmation.',
      });
    }


    // Create Razorpay order only AFTER
    // customer confirmation

    const razorpayOrder =
      await createRazorpayOrder(
        order.total_price,
        order._id.toString()
      );


    order.status = 'approved';

    order.razorpay_order_Id =
      razorpayOrder.id;

    await order.save();


    await logEvent({
      action:
        'CUSTOMER_CONFIRMED_TRANSACTION',

      actor: 'customer',

      amount: order.total_price,

      reason:
        'Customer confirmed high-value AI transaction',

      reasoningTrace:
        `Customer explicitly confirmed the transaction of ₹${order.total_price} after it exceeded the autonomous spending limit.`,

      decisionType:
        'CUSTOMER_CONFIRMED',

      relatedOrder: order._id,

      sessionId: order.session_Id,

      approvalStatus: 'approved',

      result: 'success',
    });


    return res.status(200).json({
      success: true,

      message:
        'Customer confirmed transaction. Payment order created.',

      data: {
        orderId: order._id,

        razorpayOrderId:
          razorpayOrder.id,

        totalAmount:
          order.total_price,

        currency: 'INR',

        razorpayKeyId:
          process.env.RAZORPAY_KEY_ID,
      },
    });

  } catch (error) {
    console.error(
      'CONFIRM ORDER ERROR:',
      error
    );

    return res.status(500).json({
      success: false,

      message:
        'Failed to confirm order',

      error: error.message,
    });
  }
};


// ======================================================
// CUSTOMER REJECTS HIGH VALUE TRANSACTION
// ======================================================

const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order =
      await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }


    if (
      order.status !==
      'pending_confirmation'
    ) {
      return res.status(400).json({
        success: false,

        message:
          'This order is not waiting for confirmation.',
      });
    }


    order.status = 'rejected';

    await order.save();


    await logEvent({
      action:
        'CUSTOMER_REJECTED_TRANSACTION',

      actor: 'customer',

      amount: order.total_price,

      reason:
        'Customer rejected high-value AI transaction',

      decisionType:
        'CUSTOMER_REJECTED',

      relatedOrder: order._id,

      sessionId: order.session_Id,

      approvalStatus: 'rejected',

      result: 'success',
    });


    return res.status(200).json({
      success: true,

      message:
        'Transaction rejected by customer.',

      data: {
        orderId: order._id,

        status: 'rejected',
      },
    });

  } catch (error) {
    console.error(
      'REJECT ORDER ERROR:',
      error
    );

    return res.status(500).json({
      success: false,

      message:
        'Failed to reject order',

      error: error.message,
    });
  }
};


// ======================================================
// VERIFY PAYMENT
// ======================================================

const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;


    const order =
      await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }


    const isValid =
      verifyPaymentSignature(
        order.razorpay_order_Id,
        razorpay_payment_id,
        razorpay_signature
      );


    if (!isValid) {

      order.status = 'failed';

      await order.save();


      await logEvent({
        action:
          'payment_verification',

        actor: 'system',

        amount:
          order.total_price,

        reason:
          'Signature verification failed - possible tampering or invalid payment',

        relatedOrder:
          order._id,

        sessionId:
          order.session_Id,

        result: 'failure',
      });


      return res.status(400).json({
        success: false,

        message:
          'Payment verification failed',
      });
    }


    order.status = 'paid';

    order.razorpay_payment_id =
      razorpay_payment_id;

    await order.save();


    await logEvent({
      action: 'order_created',

      actor: 'system',

      amount: order.total_price,

      reason:
        'Payment verified successfully, order marked as paid',

      relatedOrder: order._id,

      sessionId: order.session_Id,

      result: 'success',
    });


    return res.status(200).json({
      success: true,

      message:
        'Payment verified successfully',

      data: order,
    });

  } catch (error) {

    console.error(
      'VERIFY PAYMENT ERROR:',
      error
    );

    return res.status(500).json({
      success: false,

      message:
        'Payment verification failed',

      error: error.message,
    });
  }
};


// ======================================================
// GET ORDER
// ======================================================

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order =
      await Order.findById(orderId)
        .populate('item.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }


    return res.status(200).json({
      success: true,
      data: order,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,

      message:
        'Failed to fetch order',

      error: error.message,
    });
  }
};


module.exports = {
  initiateCheckout,
  confirmOrder,
  rejectOrder,
  verifyPayment,
  getOrderById,
};