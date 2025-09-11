import Godown from "../models/Godown.js";

// Create Godown
export const createGodown = async (req, res) => {
  try {
    const godown = new Godown(req.body);
    await godown.save();
    res.status(201).json(godown);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Godowns
export const getGodowns = async (req, res) => {
  try {
    const godowns = await Godown.find();
    res.json(godowns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Godown
export const getGodown = async (req, res) => {
  try {
    const godown = await Godown.findById(req.params.id);
    if (!godown) return res.status(404).json({ error: "Godown not found" });
    res.json(godown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Godown
export const updateGodown = async (req, res) => {
  try {
    const godown = await Godown.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!godown) return res.status(404).json({ error: "Godown not found" });
    res.json(godown);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Godown
export const deleteGodown = async (req, res) => {
  try {
    const godown = await Godown.findByIdAndDelete(req.params.id);
    if (!godown) return res.status(404).json({ error: "Godown not found" });
    res.json({ message: "Godown deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
