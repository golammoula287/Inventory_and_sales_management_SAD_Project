import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/apiClient.js';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const API_PATH = '/categories'; // ✅ Relative path because baseURL is in api.js

  const fetchCategories = async () => {
    try {
      const res = await api.get(API_PATH);
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Category name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(API_PATH, {
        name: form.name,
        description: form.description,
      });
      fetchCategories();
      resetForm();
    } catch (err) {
      console.error('Error creating category:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.put(`${API_PATH}/${form.id}`, {
        name: form.name,
        description: form.description,
      });
      fetchCategories();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating category:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_PATH}/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err.response?.data || err.message);
    }
  };

  const handleEdit = (category) => {
    setForm({
      id: category._id,
      name: category.name,
      description: category.description,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      description: '',
    });
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Category Management</h1>

      <form
        onSubmit={isEditing ? handleUpdate : handleCreate}
        className="bg-white p-6 shadow-lg rounded-lg mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.name && <span className="text-sm text-red-500 mt-1">{errors.name}</span>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter category description"
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? 'Processing...' : isEditing ? 'Update Category' : 'Add Category'}
        </Button>
      </form>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700">Name</th>
              <th className="py-3 px-4 text-left text-gray-700">Description</th>
              <th className="py-3 px-4 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{category.name}</td>
                <td className="py-3 px-4">{category.description || '—'}</td>
                <td className="py-3 px-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">No categories available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
