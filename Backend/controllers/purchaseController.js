const Purchase = require('../models/purchase');

const addPurchase = async (req, res) => {
  try {
    const { productId, supplierId, quantity, unitPrice, totalAmount, purchaseDate, storageLocation, invoiceUrl } = req.body;
    const newPurchase = new Purchase({ productId, supplierId, quantity, unitPrice, totalAmount, purchaseDate, storageLocation, invoiceUrl });
    await newPurchase.save();
    res.status(201).json({ message: 'Purchase added successfully', newPurchase });
  } catch (error) {
    res.status(500).json({ message: 'Error adding purchase', error });
  }
};

const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error });
  }
};

const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.purchase_id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase', error });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.purchase_id, req.body, { new: true });
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(200).json({ message: 'Purchase updated successfully', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error updating purchase', error });
  }
};

const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.purchase_id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase', error });
  }
};

module.exports = { addPurchase, getPurchases, getPurchase, updatePurchase, deletePurchase };
