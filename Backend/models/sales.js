


const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    saleDate: { type: Date, required: true },
    marketName: { type: String },
    note: { type: String },
    godowns: [
      {
        godownId: { type: mongoose.Schema.Types.ObjectId, ref: "Godown", required: true },
        soldQuantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
