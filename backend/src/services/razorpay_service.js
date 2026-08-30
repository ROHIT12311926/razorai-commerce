const Razorpay = require('razorpay');
require('dotenv').config();

const razorpayInstance=new Razorpay({

    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const createRazorpayOrder = async (amount, receiptId) => {
  const options = {
    amount: amount * 100, 
    currency: 'INR',
    receipt: receiptId,
  }

  const razorpayOrder=await razorpayInstance.orders.create(options);

  return razorpayOrder;

}

module.exports = { createRazorpayOrder };
