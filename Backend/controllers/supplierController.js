const Supplier = require('../models/supplier');

const addSupplier = async (req, res) => {
  try {
    const { name, contact, ratings, notes, paymentTerms } = req.body;
    const newSupplier = new Supplier({ name, contact, ratings, notes, paymentTerms });
    await newSupplier.save();
    res.status(201).json({ message: 'Supplier added successfully', newSupplier });
  } catch (error) {
    res.status(500).json({ message: 'Error adding supplier', error });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplier_id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supplier', error });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.supplier_id, req.body, { new: true });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json({ message: 'Supplier updated successfully', supplier });
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.supplier_id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error });
  }
};

module.exports = { addSupplier, getSuppliers, getSupplier, updateSupplier, deleteSupplier };
