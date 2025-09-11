const express = require('express');
const { addSale, getSales, getSale, updateSale, deleteSale } = require('../controllers/salesController');
const router = express.Router();

// Routes
router.post('/', addSale);
router.get('/', getSales);
router.get('/:sale_id', getSale);
router.put('/:sale_id', updateSale);
router.delete('/:sale_id', deleteSale);

module.exports = router; // ✅ Export router using CommonJS

