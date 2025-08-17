const express = require('express');
const { addExpense, getExpenses, getExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const router = express.Router();

router.post('/', addExpense);
router.get('/', getExpenses);
router.get('/:expense_id', getExpense);
router.put('/:expense_id', updateExpense);
router.delete('/:expense_id', deleteExpense);

module.exports = router;
