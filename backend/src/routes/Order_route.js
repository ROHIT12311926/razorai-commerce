const express = require('express');

const router=express.Router();
const {initiateCheckout,approveOrder,verifyPayment,getOrderById}=require('../controllers/Order_controller');

router.get('/:orderId',getOrderById);

router.post('/checkout',initiateCheckout);
router.post('/:orderId/approve',approveOrder);

router.post('/verify-payment', verifyPayment);

module.exports=router;