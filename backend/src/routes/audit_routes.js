const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/audit_controller');

router.get('/', getAllLogs);

module.exports = router;