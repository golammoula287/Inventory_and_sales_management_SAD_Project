

// const express = require('express');
// const { getDashboardData, getMonthlyDataForYear, getProfitLossReport, getDailyReportData } = require('../controllers/dashboardController');
// const router = express.Router();

// // Dashboard route
// router.get('/', getDashboardData);
// router.get('/monthly-data', getMonthlyDataForYear);
// router.get('/profit-loss', getProfitLossReport);


// module.exports = router;



const express = require("express");
const {
  getDashboardData,
  getMonthlyDataForYear,
  getProfitLossReport,
} = require("../controllers/dashboardController.js");

const router = express.Router();

// Dashboard KPIs
router.get("/", getDashboardData);

// Monthly sales/expenses/profit-loss for last 12 months
router.get("/monthly-data", getMonthlyDataForYear);

// Profit/Loss report for a date range
router.get("/profit-loss", getProfitLossReport);

module.exports = router;
