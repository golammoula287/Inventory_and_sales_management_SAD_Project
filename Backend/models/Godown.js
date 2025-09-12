// import mongoose from "mongoose";

// const godownSchema = new mongoose.Schema(
//   {
//     godownId: { type: String, required: true, unique: true }, // Custom ID / Code
//     location: { type: String, required: true },
//     capacity: { type: Number, required: true }, // Total capacity
//     availableSpace: { type: Number, required: true }, // Current available space
//     managerName: { type: String }, // Optional
//     managerPhone: { type: String }, // Optional
//     notes: { type: String }, // Optional
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Godown", godownSchema);


import mongoose from "mongoose";

const godownSchema = new mongoose.Schema(
  {
    godownId: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    availableSpace: { type: Number, required: true },
    managerName: { type: String },
    managerPhone: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Godown = mongoose.model("Godown", godownSchema);

export default Godown;
