import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/apiClient.js';

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    contact: '',
    ratings: '',
    notes: '',
    paymentTerms: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const SUPPLIER_API = '/suppliers';
  

  const fetchSuppliers = async () => {
    try {
      const res = await api.get(SUPPLIER_API);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Supplier name is required.';
    if (!form.contact) newErrors.contact = 'Contact is required.';
    if (form.ratings && (form.ratings < 0 || form.ratings > 5)) {
      newErrors.ratings = 'Ratings must be between 0 and 5.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(SUPPLIER_API, {
        name: form.name,
        contact: form.contact,
        ratings: form.ratings ? parseFloat(form.ratings) : undefined,
        notes: form.notes,
        paymentTerms: form.paymentTerms,
      });
      fetchSuppliers();
      resetForm();
    } catch (err) {
      console.error('Error creating supplier:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.put(`${SUPPLIER_API}/${form.id}`, {
        name: form.name,
        contact: form.contact,
        ratings: form.ratings ? parseFloat(form.ratings) : undefined,
        notes: form.notes,
        paymentTerms: form.paymentTerms,
      });
      fetchSuppliers();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating supplier:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${SUPPLIER_API}/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error('Error deleting supplier:', err.response?.data || err.message);
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      id: supplier._id,
      name: supplier.name,
      contact: supplier.contact,
      ratings: supplier.ratings || '',
      notes: supplier.notes || '',
      paymentTerms: supplier.paymentTerms || '',
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      contact: '',
      ratings: '',
      notes: '',
      paymentTerms: '',
    });
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50">
      <div className="mb-10 flex justify-between items-center">
  <div>
    <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-2">
      Suppliers Management
    </h1>
    <p className="text-gray-600 mt-2">Track and manage all supplier records.</p>
  </div>
  
</div>

       
      <form
        onSubmit={isEditing ? handleUpdate : handleCreate}
        className="bg-white p-6 shadow-lg rounded-lg mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter supplier name"
            />
            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter contact info"
            />
            {errors.contact && <span className="text-sm text-red-500">{errors.contact}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ratings (0-5)</label>
            <input
              type="number"
              name="ratings"
              value={form.ratings}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter ratings"
              min="0"
              max="5"
            />
            {errors.ratings && <span className="text-sm text-red-500">{errors.ratings}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
            <input
              type="text"
              name="paymentTerms"
              value={form.paymentTerms}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter payment terms"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes"
            ></textarea>
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? 'Processing...' : isEditing ? 'Update Supplier' : 'Add Supplier'}
        </Button>
      </form>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700">Name</th>
              <th className="py-3 px-4 text-left text-gray-700">Contact</th>
              <th className="py-3 px-4 text-left text-gray-700">Ratings</th>
              <th className="py-3 px-4 text-left text-gray-700">Payment Terms</th>
              <th className="py-3 px-4 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{supplier.name}</td>
                <td className="py-3 px-4">{supplier.contact}</td>
                <td className="py-3 px-4">{supplier.ratings || '—'}</td>
                <td className="py-3 px-4">{supplier.paymentTerms || '—'}</td>
                <td className="py-3 px-4 flex gap-4">
                  <button onClick={() => handleEdit(supplier)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={20} />
                  </button>
                  <button onClick={() => handleDelete(supplier._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No suppliers available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
