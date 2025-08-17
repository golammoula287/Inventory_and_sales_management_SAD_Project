const express = require('express');
const { addPurchase, getPurchases, getPurchase, updatePurchase, deletePurchase } = require('../controllers/purchaseController');
const router = express.Router();

router.post('/', addPurchase);
router.get('/', getPurchases);
router.get('/:purchase_id', getPurchase);
router.put('/:purchase_id', updatePurchase);
router.delete('/:purchase_id', deletePurchase);

module.exports = router;
