const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  relatedProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
