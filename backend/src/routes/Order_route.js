const express = require('express');

const router = express.Router();

const {
  initiateCheckout,
  confirmOrder,
  rejectOrder,
  verifyPayment,
  getOrderById,
} = require('../controllers/Order_controller');


router.get(
  '/:orderId',
  getOrderById
);


router.post(
  '/checkout',
  initiateCheckout
);


router.post(
  '/:orderId/approve',
  confirmOrder
);


router.post(
  '/:orderId/reject',
  rejectOrder
);


router.post(
  '/verify-payment',
  verifyPayment
);


module.exports = router;