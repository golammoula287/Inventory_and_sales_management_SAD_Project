import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    quantity: { type: Number, required: true }, // total sale quantity
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    saleDate: { type: Date, required: true },
    marketName: { type: String }, // optional
    note: { type: String }, // optional
    godowns: [
      {
        godownId: { type: mongoose.Schema.Types.ObjectId, ref: "Godown", required: true },
        soldQuantity: { type: Number, required: true }, // quantity sold from this godown
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
