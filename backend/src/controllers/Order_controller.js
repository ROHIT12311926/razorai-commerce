const Cart = require('../models/Cart');
const Order = require('../models/Order');

require('dotenv').config();

const {createRazorpayOrder} = require('../services/razorpay_service');

const {checkTransactionLimit}=require('../services/guardrails_service');

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

    const guardrailCheck=await checkTransactionLimit(total);

    const order=await Order.create({

        session_Id: sessionId,
      item: orderItems,
      total_price: total,
      razorpay_order_Id: `pending_${Date.now()}`, 
      status: 'created',
      required_Approval: guardrailCheck.requiresApproval
    });

    if(!guardrailCheck.requiresApproval){

        const razorpayOrder=await createRazorpayOrder(total,order._id.toString());

        order.razorpay_order_Id = razorpayOrder.id;
      await order.save();

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

    order.status = 'approved';
    await order.save();


    const razorpayOrder = await createRazorpayOrder(order.total_price, order._id.toString());

    order.status = 'approved';
    order.razorpay_order_Id = razorpayOrder.id;
    await order.save();

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

module.exports = { initiateCheckout, approveOrder };

