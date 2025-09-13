

const express = require('express');
const { getDashboardData, getMonthlyDataForYear, getProfitLossReport, getDailyReportData } = require('../controllers/dashboardController');
const router = express.Router();

// Dashboard route
router.get('/', getDashboardData);
router.get('/monthly-data', getMonthlyDataForYear);
router.get('/profit-loss', getProfitLossReport);

module.exports = router;

