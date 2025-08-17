const Sale = require('../models/sales');

const addSale = async (req, res) => {
  try {
    const { productId, saleDate, marketName, totalAmount } = req.body;
    const newSale = new Sale({ productId, saleDate, marketName, totalAmount });
    await newSale.save();
    res.status(201).json({ message: 'Sale added successfully', newSale });
  } catch (error) {
    res.status(500).json({ message: 'Error adding sale', error });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error });
  }
};

const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.sale_id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale', error });
  }
};

const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.sale_id, req.body, { new: true });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale updated successfully', sale });
  } catch (error) {
    res.status(500).json({ message: 'Error updating sale', error });
  }
};

const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.sale_id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale', error });
  }
};

module.exports = { addSale, getSales, getSale, updateSale, deleteSale };
