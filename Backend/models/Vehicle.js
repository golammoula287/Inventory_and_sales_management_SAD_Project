

// const mongoose = require("mongoose");

// const vehicleSchema = new mongoose.Schema(
//   {
//     vehicleNumber: { type: String, required: true, unique: true },
//     ownerName: { type: String, required: true },
//     capacityTon: { type: Number, required: true },
//     ownerPhone: { type: String, required: true },
//     type: { type: String },
//     status: {
//       type: String,
//       enum: ["available", "in-use", "maintenance"],
//       default: "available",
//     },
//     notes: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Vehicle", vehicleSchema);



const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, unique: true },
    ownerName: { type: String, required: true },
    capacityTon: { type: Number, required: true },
    ownerPhone: { type: String, required: true },
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
