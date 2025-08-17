const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  unitType: { type: String, required: true },
  sku: { type: String, unique: true },
  description: { type: String },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
