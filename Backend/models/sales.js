

const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true }, // sale price per unit
        total: { type: Number, required: true },     // quantity * unitPrice
        godownId: { type: mongoose.Schema.Types.ObjectId, ref: "Godown" }, // optional: which godown it came from
      },
    ],
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    saleDate: { type: Date, required: true },
    marketName: { type: String },
    note: { type: String },

    totalAmount: { type: Number, required: true }, // sum of all items[].total
    profitLoss: { type: Number, default: 0 },      // overall profit/loss
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
