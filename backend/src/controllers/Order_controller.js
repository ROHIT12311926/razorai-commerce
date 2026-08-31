const Cart = require('../models/Cart');
const Order = require('../models/Order');

const {logEvent} = require('../services/audit_service');

require('dotenv').config();

const {createRazorpayOrder} = require('../services/razorpay_service');

const {checkTransactionLimit}=require('../services/guardrails_service');

const {verifyPaymentSignature} = require('../services/razorpay_service');

const initiateCheckout=async (req,res) => {

    try {

        const {sessionId}=req.body;

        const cart=await Cart.findOne({session_id:sessionId,status:'active'}).populate('item.product');

        if (!cart || cart.item.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    let total=0;

    const orderItems=cart.item.map((item)=>{

        total=total+(item.priceAtAdd*item.quantity)

        return{
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.priceAtAdd,
      };
    }
    
    );

    const guardrailCheck=await checkTransactionLimit(total,sessionId);

    const order=await Order.create({

        session_Id: sessionId,
      item: orderItems,
      total_price: total,
      razorpay_order_Id: `pending_${Date.now()}`, 
      status: 'created',
      required_Approval: guardrailCheck.requiresApproval
    });


    await logEvent({
      action: 'checkout_initiated',
      actor: 'customer',
      amount: total,
      reason: `Checkout started with ${orderItems.length} item(s)`,
      relatedOrder: order._id,
      sessionId: sessionId,
      approvalStatus: guardrailCheck.requiresApproval ? 'pending' : 'not_required',
      result: 'success',
    });

    if(!guardrailCheck.requiresApproval){

        const razorpayOrder=await createRazorpayOrder(total,order._id.toString());

        order.razorpay_order_Id = razorpayOrder.id;
      await order.save();



      await logEvent({
        action: 'payment_order_created',
        actor: 'system',
        amount: total,
        reason: 'Razorpay order created, within autonomous limit',
        relatedOrder: order._id,
        sessionId: sessionId,
        result: 'success',
      });


       return res.status(200).json({
        success: true,
        data: {
          orderId: order._id,
          razorpayOrderId: razorpayOrder.id,
          totalAmount: total,
          requiresApproval: false,
          razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        },
      });



    }

   

     res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        total_price: total,
        requiresApproval: guardrailCheck.requiresApproval,
        reason: guardrailCheck.reason,
      },
    });
        
    } catch (error) {

         res.status(500).json({
      success: false,
      message: 'Checkout failed',
      error: error.message,
    });
        
    }
    
}

const approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!order.required_Approval) {
      return res.status(400).json({
        success: false,
        message: 'This order does not require approval',
      });
    }

    


    const razorpayOrder = await createRazorpayOrder(order.total_price, order._id.toString());

    order.status = 'approved';
    order.razorpay_order_Id = razorpayOrder.id;
    await order.save();


    order.status = 'approved';
    await order.save();

     await logEvent({
      action: 'payment_approved',
      actor: 'customer',
      amount: order.total_price,
      reason: 'Customer approved the transaction above autonomous limit',
      relatedOrder: order._id,
      sessionId: order.session_Id,
      approvalStatus: 'approved',
      result: 'success',
    });




    res.status(200).json({
      success: true,
      message: 'Order approved successfully',
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        totalAmount: order.total_price,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve order',
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const isValid = verifyPaymentSignature(
      order.razorpay_order_Id,
      razorpay_payment_id,
      razorpay_signature
    );


    if (!isValid) {
      order.status = 'failed';
      await order.save();


       await logEvent({
        action: 'payment_verification',
        actor: 'system',
        amount: order.total_price,
        reason: 'Signature verification failed - possible tampering or invalid payment',
        relatedOrder: order._id,
        sessionId: order.session_Id,
        result: 'failure',
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    order.status = 'paid';
    order.razorpay_payment_id = razorpay_payment_id;
    await order.save();

     await logEvent({
      action: 'order_created',
      actor: 'system',
      amount: order.total_price,
      reason: 'Payment verified successfully, order marked as paid',
      relatedOrder: order._id,
      sessionId: order.session_Id,
      result: 'success',
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order,
    });



}
catch(error){

    console.log("VERIFY PAYMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });

}

}

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('item.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};


module.exports = { initiateCheckout, approveOrder,verifyPayment,getOrderById };

