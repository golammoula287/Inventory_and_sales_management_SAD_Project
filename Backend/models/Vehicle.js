// import mongoose from "mongoose";

// const vehicleSchema = new mongoose.Schema(
//   {
//     vehicleNumber: { type: String, required: true, unique: true }, // Example: Truck number / Plate
//     ownerName: { type: String, required: true },
//     capacityTon: { type: Number, required: true }, // Vehicle capacity in tons
//     ownerPhone: { type: String, required: true },
//     type: { type: String }, // Optional: Truck, Van, Mini, etc.
//     status: { type: String, enum: ["available", "in-use", "maintenance"], default: "available" },
//     notes: { type: String }, // Optional info
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Vehicle", vehicleSchema);


const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, unique: true },
    ownerName: { type: String, required: true },
    capacityTon: { type: Number, required: true },
    ownerPhone: { type: String, required: true },
    type: { type: String },
    status: {
      type: String,
      enum: ["available", "in-use", "maintenance"],
      default: "available",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
