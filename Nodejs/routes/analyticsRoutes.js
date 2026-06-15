const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/admin/dashboard', analyticsController.getAdminDashboard);

module.exports = router;
