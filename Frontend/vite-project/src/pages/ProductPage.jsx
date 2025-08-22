import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import Button from "../components/Button"; // Assuming this is the path for the Button component

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    unitType: "",
    sku: "",
    description: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({}); // To handle form validation errors

  const API_URL = "http://localhost:5000/api/products";
  const CATEGORY_API_URL = "http://localhost:5000/api/categories"; // Update to your category API

  // Fetch products and categories
  const fetchData = async () => {
    try {
      const resProducts = await axios.get(API_URL);
      setProducts(resProducts.data);
      const resCategories = await axios.get(CATEGORY_API_URL);
      setCategories(resCategories.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.unitType) newErrors.unitType = "Unit Type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create Product
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Validate form before creating
    try {
      await axios.post(API_URL, form);
      fetchData();
      resetForm();
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  // Update Product
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Validate form before updating
    try {
      await axios.put(`${API_URL}/${form.id}`, form);
      fetchData();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Edit Product
  const handleEdit = (p) => {
    setForm({
      id: p._id,
      name: p.name,
      category: p.category?._id || p.category,
      unitType: p.unitType,
      sku: p.sku,
      description: p.description,
      image: p.image,
    });
    setIsEditing(true);
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      category: "",
      unitType: "",
      sku: "",
      description: "",
      image: "",
    });
    setErrors({});
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {/* Form */}
      <form
        onSubmit={isEditing ? handleUpdate : handleCreate}
        className="bg-white p-4 shadow rounded mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

          {/* Category Dropdown */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}

          <input
            type="text"
            name="unitType"
            placeholder="Unit Type"
            value={form.unitType}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          {errors.unitType && <span className="text-red-500 text-sm">{errors.unitType}</span>}

          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <Button type="submit" className="mt-4 w-full">
          {isEditing ? "Update Product" : "Add Product"}
        </Button>
      </form>

      {/* Product List */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Unit</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Description</th>
              <th className="p-3">Image</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category?.name || p.category}</td>
                <td className="p-3">{p.unitType}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.description}</td>
                <td className="p-3">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-4 text-gray-500"
                >
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
