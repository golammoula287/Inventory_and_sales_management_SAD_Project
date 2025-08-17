const express = require('express');
const { addSupplier, getSuppliers, getSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const router = express.Router();

router.post('/', addSupplier);
router.get('/', getSuppliers);
router.get('/:supplier_id', getSupplier);
router.put('/:supplier_id', updateSupplier);
router.delete('/:supplier_id', deleteSupplier);

module.exports = router;

