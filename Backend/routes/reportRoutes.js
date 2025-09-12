const express = require("express");
const { getProfitLossReport, getDailyReportData } = require("../controllers/reportController");
const router = express.Router();

// Routes
router.get("/profit-loss", getProfitLossReport);
router.get("/daily-stats", getDailyReportData);

module.exports = router;
