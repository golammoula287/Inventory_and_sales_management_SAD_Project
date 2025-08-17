const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  saleDate: { type: Date, required: true },
  marketName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sale', salesSchema);
