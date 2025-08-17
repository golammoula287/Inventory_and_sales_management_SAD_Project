const Damage = require('../models/damage');

const recordDamage = async (req, res) => {
  try {
    const { batchId, productId, quantity, reason, date, costLoss } = req.body;
    const newDamage = new Damage({ batchId, productId, quantity, reason, date, costLoss });
    await newDamage.save();
    res.status(201).json({ message: 'Damage recorded successfully', newDamage });
  } catch (error) {
    res.status(500).json({ message: 'Error recording damage', error });
  }
};

const getDamages = async (req, res) => {
  try {
    const { product_id, date_from, date_to } = req.query;
    const query = {};

    if (product_id) {
      query.productId = product_id;
    }

    if (date_from && date_to) {
      query.date = { $gte: new Date(date_from), $lte: new Date(date_to) };
    }

    const damages = await Damage.find(query);
    res.status(200).json(damages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching damage records', error });
  }
};

const getDamage = async (req, res) => {
  try {
    const damage = await Damage.findById(req.params.damage_id);
    if (!damage) {
      return res.status(404).json({ message: 'Damage record not found' });
    }
    res.status(200).json(damage);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching damage record', error });
  }
};

const updateDamage = async (req, res) => {
  try {
    const damage = await Damage.findByIdAndUpdate(req.params.damage_id, req.body, { new: true });
    if (!damage) {
      return res.status(404).json({ message: 'Damage record not found' });
    }
    res.status(200).json({ message: 'Damage record updated successfully', damage });
  } catch (error) {
    res.status(500).json({ message: 'Error updating damage record', error });
  }
};

const deleteDamage = async (req, res) => {
  try {
    const damage = await Damage.findByIdAndDelete(req.params.damage_id);
    if (!damage) {
      return res.status(404).json({ message: 'Damage record not found' });
    }
    res.status(200).json({ message: 'Damage record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting damage record', error });
  }
};

module.exports = { recordDamage, getDamages, getDamage, updateDamage, deleteDamage };
