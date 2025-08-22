const express = require('express');
const {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const router = express.Router();

router.post('/', addCategory); // Add a category
router.get('/', getCategories); // Get all categories
router.get('/:category_id', getCategory); // Get a single category
router.put('/:category_id', updateCategory); // Update a category
router.delete('/:category_id', deleteCategory); // Delete a category

module.exports = router;
