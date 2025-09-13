// routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const { getStockByCategory } = require("../controllers/stockController.js");

// Get stock by category (or all if no categoryId)
router.get("/category/:categoryId?", getStockByCategory);

module.exports = router;
