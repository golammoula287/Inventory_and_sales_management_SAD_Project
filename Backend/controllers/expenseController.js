const Expense = require('../models/expense');

const addExpense = async (req, res) => {
  try {
    const { type, amount, date, relatedProductId, note } = req.body;
    const newExpense = new Expense({ type, amount, date, relatedProductId, note });
    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', newExpense });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { date_from, date_to, type } = req.query;
    const query = {};

    if (date_from && date_to) {
      query.date = { $gte: new Date(date_from), $lte: new Date(date_to) };
    }

    if (type) {
      query.type = type;
    }

    const expenses = await Expense.find(query);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
};

const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expense_id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense', error });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.expense_id, req.body, { new: true });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.expense_id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
};

module.exports = { addExpense, getExpenses, getExpense, updateExpense, deleteExpense };
