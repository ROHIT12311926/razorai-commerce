const express = require('express');
const router = express.Router();
const { getMerchantSettings, updateMerchantSettings } = require('../controllers/merchant_controller');
const { protect } = require('../middlewares/authorization_middleware');

router.get('/settings', protect, getMerchantSettings);
router.patch('/settings', protect, updateMerchantSettings);

module.exports = router;