const express = require('express');
const { addSale, getSales, getSale, updateSale, deleteSale ,downloadInvoice } = require('../controllers/salesController');
const router = express.Router();

// Routes
router.post('/', addSale);
router.get('/', getSales);
router.get('/:sale_id', getSale);
router.put('/:sale_id', updateSale);
router.delete('/:sale_id', deleteSale);
router.get("/:sale_id/invoice", downloadInvoice);


module.exports = router; 

