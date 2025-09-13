

import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  quantity: { type: Number, required: true }, // total purchased
  stock: { type: Number, required: true },    // available stock
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
  godowns: [
    {
      godownId: { type: mongoose.Schema.Types.ObjectId, ref: "Godown", required: true },
      allocatedQuantity: { type: Number, required: true },
    }
  ],
  invoiceUrl: String,
  note: String,
});

export default mongoose.model("Purchase", purchaseSchema);


