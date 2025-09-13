import React, { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle, Eye, GroupIcon } from "lucide-react";
import Button from "../components/Button";
import api from "../services/apiClient.js";
import toast from "react-hot-toast";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState(""); // 🔍 Search state
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    unitType: "",
    sku: "",
    description: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [viewProduct, setViewProduct] = useState(null); 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const PRODUCT_API = "/products";
  const CATEGORY_API = "/categories";

  /** Fetch products & categories */
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [resProducts, resCategories] = await Promise.all([
        api.get(PRODUCT_API),
        api.get(CATEGORY_API),
      ]);
      setProducts(resProducts.data || []);
      setCategories(resCategories.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || " Error fetching data");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** Handle input change */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.unitType) newErrors.unitType = "Unit Type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Create Product */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(PRODUCT_API, form);
      fetchData();
      resetForm();
      toast.success(" Product added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || " Error creating product");
    } finally {
      setLoading(false);
    }
  };

  /** Update Product */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.put(`${PRODUCT_API}/${form.id}`, form);
      fetchData();
      resetForm();
      setIsEditing(false);
      toast.success("✏️ Product updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || " Error updating product");
    } finally {
      setLoading(false);
    }
  };

  /** Delete Product */
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`${PRODUCT_API}/${id}`);
      fetchData();
      toast.success("🗑️ Product deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || " Error deleting product");
    }
  };

  /** Edit Product */
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

  /** Reset Form */
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

  /** Filtered Products for Search */
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600 flex items-center gap-2">
             Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all products and categories in one place.
          </p>
        </div>
        {/*  Search Bar */}
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-64 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loadingData ? (
        <div className="text-center text-gray-500 py-6">Loading data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Card */}
          <div className="lg:col-span-1 bg-white p-6 shadow-xl rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isEditing ? "✏️ Edit Product" : " Add Product"}
            </h2>
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="text-sm text-red-500">{errors.category}</span>}

              <input
                type="text"
                name="unitType"
                value={form.unitType}
                onChange={handleChange}
                placeholder="Unit Type"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              {errors.unitType && <span className="text-sm text-red-500">{errors.unitType}</span>}

              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="SKU"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <Button type="submit" className="w-full mt-4" loading={loading}>
                {isEditing ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </div>

          {/* Table Card */}
          <div className="lg:col-span-2 bg-white p-6 shadow-xl rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4"> Products List</h2>
            <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-indigo-50 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, idx) => (
                    <tr
                      key={p._id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50`}
                    >
                      <td className="py-3 px-4">{p.name}</td>
                      <td className="py-3 px-4">{p.category?.name || "—"}</td>
                      <td className="py-3 px-4 text-center">{p.unitType}</td>
                      <td className="py-3 px-4 text-center">{p.sku}</td>
                      <td className="py-3 px-4">{p.description}</td>
                      <td className="py-3 px-4 text-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-4">
                        <button
                          onClick={() => setViewProduct(p)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inline View Product Modal */}
{viewProduct && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-start z-50 mt-20 pointer-events-none">
    <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6 border border-gray-200 pointer-events-auto">
      <h3 className="text-xl font-bold mb-4 text-indigo-600">{viewProduct.name}</h3>
      <p><strong>Category:</strong> {viewProduct.category?.name || "—"}</p>
      <p><strong>Unit Type:</strong> {viewProduct.unitType}</p>
      <p><strong>SKU:</strong> {viewProduct.sku || "—"}</p>
      <p><strong>Description:</strong> {viewProduct.description || "—"}</p>
      {viewProduct.image && (
        <img
          src={viewProduct.image}
          alt={viewProduct.name}
          className="w-full h-40 object-cover rounded mt-3"
        />
      )}
      <Button
        onClick={() => setViewProduct(null)}
        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Close
      </Button>
    </div>
  </div>
)}


    </div>
  );
}
