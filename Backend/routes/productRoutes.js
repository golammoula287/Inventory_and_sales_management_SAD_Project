const express = require('express');
const { addProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/', addProduct);
router.get('/', getProducts);
router.get('/:product_id', getProduct);
router.put('/:product_id', updateProduct);
router.delete('/:product_id', deleteProduct);

module.exports = router;
