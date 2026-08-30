const express = require('express');

const router=express.Router();
const {initiateCheckout,approveOrder}=require('../controllers/Order_controller');

router.post('/checkout',initiateCheckout);
router.post('/:orderId/approve',approveOrder);

module.exports=router;