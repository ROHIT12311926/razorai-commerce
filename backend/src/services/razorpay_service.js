const Razorpay = require('razorpay');
require('dotenv').config();

const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (amount, receiptId) => {
  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: receiptId,
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  return razorpayOrder;
};

const verifyPaymentSignature = (
  orderId,
  paymentId,
  signature
) => {
  const body = orderId + '|' + paymentId;

  const expectedSignature = crypto
    .createHmac(
      'sha256',
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
};