const express = require('express');
const router = express.Router();

const { getDashboardSummary } = require('../controllers/dashboard_controller');
const { protect } = require('../middlewares/authorization_middleware');

router.get('/summary', protect, getDashboardSummary);

module.exports = router;