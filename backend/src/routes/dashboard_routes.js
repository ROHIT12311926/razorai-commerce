const express = require('express');
const router = express.Router();

const { getDashboardSummary , getAnalytics} = require('../controllers/dashboard_controller');
const { protect } = require('../middlewares/authorization_middleware');

router.get('/summary', protect, getDashboardSummary);
router.get('/analytics', protect, getAnalytics);

module.exports = router;