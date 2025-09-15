import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import Button from "../components/Button";
import api from "../services/apiClient.js";
import toast from "react-hot-toast";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    contact: "",
    ratings: "",
    notes: "",
    paymentTerms: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [viewSupplier, setViewSupplier] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const SUPPLIER_API = "/suppliers";

  /** Fetch suppliers */
  const fetchSuppliers = async () => {
    setLoadingData(true);
    try {
      const res = await api.get(SUPPLIER_API);
      setSuppliers(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching suppliers");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  /** Handle input */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Supplier name is required.";
    if (!form.contact) newErrors.contact = "Contact is required.";
    if (form.ratings && (form.ratings < 0 || form.ratings > 5)) {
      newErrors.ratings = "Ratings must be between 0 and 5.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Create */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(SUPPLIER_API, form);
      fetchSuppliers();
      resetForm();
      toast.success("Supplier added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating supplier");
    } finally {
      setLoading(false);
    }
  };

  /** Update */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.put(`${SUPPLIER_API}/${form.id}`, form);
      fetchSuppliers();
      resetForm();
      setIsEditing(false);
      toast.success("Supplier updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating supplier");
    } finally {
      setLoading(false);
    }
  };

  /** Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this supplier?")) return;
    try {
      await api.delete(`${SUPPLIER_API}/${id}`);
      fetchSuppliers();
      toast.success("Supplier deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting supplier");
    }
  };

  /** Edit */
  const handleEdit = (s) => {
    setForm({
      id: s._id,
      name: s.name,
      contact: s.contact,
      ratings: s.ratings || "",
      notes: s.notes || "",
      paymentTerms: s.paymentTerms || "",
    });
    setIsEditing(true);
  };

  /** Reset */
  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      contact: "",
      ratings: "",
      notes: "",
      paymentTerms: "",
    });
    setErrors({});
  };

  /** Search filter */
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.contact && s.contact.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-blue-600">Suppliers Management</h1>
          <p className="text-gray-600 mt-2">
            Track and manage all supplier records.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name or contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-64 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loadingData ? (
        <div className="text-center text-gray-500 py-6">Loading suppliers...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1 bg-white p-6 shadow-xl rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isEditing ? "✏️ Edit Supplier" : " Add Supplier"}
            </h2>
            <form
              onSubmit={isEditing ? handleUpdate : handleCreate}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Supplier Name"
                className="w-full p-3 border rounded-lg"
              />
              {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}

              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Contact Info"
                className="w-full p-3 border rounded-lg"
              />
              {errors.contact && <span className="text-sm text-red-500">{errors.contact}</span>}

              <input
                type="number"
                name="ratings"
                value={form.ratings}
                onChange={handleChange}
                placeholder="Ratings (0-5)"
                min="0"
                max="5"
                className="w-full p-3 border rounded-lg"
              />
              {errors.ratings && <span className="text-sm text-red-500">{errors.ratings}</span>}

              <input
                type="text"
                name="paymentTerms"
                value={form.paymentTerms}
                onChange={handleChange}
                placeholder="Payment Terms"
                className="w-full p-3 border rounded-lg"
              />

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
                rows="3"
                className="w-full p-3 border rounded-lg"
              />

              <Button type="submit" className="w-full mt-4" loading={loading}>
                {isEditing ? "Update Supplier" : "Add Supplier"}
              </Button>
            </form>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white p-6 shadow-xl rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Suppliers List</h2>
            <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-indigo-50 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Contact</th>
                    <th className="py-3 px-4">Ratings</th>
                    <th className="py-3 px-4">Payment Terms</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((s, idx) => (
                    <tr
                      key={s._id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50`}
                    >
                      <td className="py-3 px-4">{s.name}</td>
                      <td className="py-3 px-4">{s.contact}</td>
                      <td className="py-3 px-4 text-center">{s.ratings || "—"}</td>
                      <td className="py-3 px-4 text-center">{s.paymentTerms || "—"}</td>
                      <td className="py-3 px-4 flex justify-center gap-4">
                        <button
                          onClick={() => setViewSupplier(s)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredSuppliers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-gray-500">
                        No suppliers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inline View Supplier Modal */}
      {viewSupplier && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-start z-50 mt-20 pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6 border border-gray-200 pointer-events-auto">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">{viewSupplier.name}</h3>
            <p><strong>Contact:</strong> {viewSupplier.contact}</p>
            <p><strong>Ratings:</strong> {viewSupplier.ratings || "—"}</p>
            <p><strong>Payment Terms:</strong> {viewSupplier.paymentTerms || "—"}</p>
            <p><strong>Notes:</strong> {viewSupplier.notes || "—"}</p>
            <Button
              onClick={() => setViewSupplier(null)}
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
