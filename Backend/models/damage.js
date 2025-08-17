const mongoose = require('mongoose');

const damageSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
  costLoss: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Damage', damageSchema);
