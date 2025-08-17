const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
  storageLocation: { type: String, required: true },
  invoiceUrl: { type: String },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
