const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  ratings: { type: Number, min: 0, max: 5 },
  notes: { type: String },
  paymentTerms: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
