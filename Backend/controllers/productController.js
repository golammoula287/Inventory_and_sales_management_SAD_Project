const Product = require('../models/product');

const addProduct = async (req, res) => {
  try {
    const { name, category, unitType, sku, description } = req.body;
    const newProduct = new Product({ name, category, unitType, sku, description });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.product_id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = { addProduct, getProducts, getProduct, updateProduct, deleteProduct };
