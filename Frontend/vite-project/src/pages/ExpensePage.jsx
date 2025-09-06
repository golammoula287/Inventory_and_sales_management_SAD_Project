import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../components/Button";
import api from "../services/apiClient.js";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    id: null,
    type: "",
    amount: "",
    date: "",
    relatedProductId: "",
    note: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const EXPENSE_API = "/expenses";
  const PRODUCT_API = "/products";

  /** Fetch expenses + products */
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [resExpenses, resProducts] = await Promise.all([
        api.get(EXPENSE_API),
        api.get(PRODUCT_API),
      ]);
      setExpenses(resExpenses.data || []);
      setProducts(resProducts.data || []);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** Handle input */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!form.type) newErrors.type = "Type is required.";
    if (!form.amount) newErrors.amount = "Amount is required.";
    if (!form.date) newErrors.date = "Date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Create */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(EXPENSE_API, {
        type: form.type,
        amount: parseFloat(form.amount),
        date: form.date,
        relatedProductId: form.relatedProductId || null,
        note: form.note,
      });
      fetchData();
      resetForm();
    } catch (err) {
      console.error("Error creating expense:", err.response?.data || err.message);
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
      await api.put(`${EXPENSE_API}/${form.id}`, {
        type: form.type,
        amount: parseFloat(form.amount),
        date: form.date,
        relatedProductId: form.relatedProductId || null,
        note: form.note,
      });
      fetchData();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating expense:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Delete */
  const handleDelete = async (id) => {
    try {
      await api.delete(`${EXPENSE_API}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting expense:", err.response?.data || err.message);
    }
  };

  /** Edit */
  const handleEdit = (expense) => {
    setForm({
      id: expense._id,
      type: expense.type,
      amount: expense.amount,
      date: expense.date.split("T")[0],
      relatedProductId: expense.relatedProductId?._id || expense.relatedProductId || "",
      note: expense.note || "",
    });
    setIsEditing(true);
  };

  /** Reset */
  const resetForm = () => {
    setForm({
      id: null,
      type: "",
      amount: "",
      date: "",
      relatedProductId: "",
      note: "",
    });
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Expense Management
      </h1>

      {loadingData ? (
        <div className="text-center text-gray-500 py-6">Loading data...</div>
      ) : (
        <>
          {/* Form */}
          <form
            onSubmit={isEditing ? handleUpdate : handleCreate}
            className="bg-white p-6 shadow-lg rounded-lg mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Expense type (e.g. Transport, Rent)"
                />
                {errors.type && (
                  <span className="text-sm text-red-500">{errors.type}</span>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <span className="text-sm text-red-500">{errors.amount}</span>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                />
                {errors.date && (
                  <span className="text-sm text-red-500">{errors.date}</span>
                )}
              </div>

              {/* Related Product (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Related Product
                </label>
                <select
                  name="relatedProductId"
                  value={form.relatedProductId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                >
                  <option value="">None</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Note
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  rows="2"
                  placeholder="Optional note"
                />
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={loading}>
              {loading
                ? "Processing..."
                : isEditing
                ? "Update Expense"
                : "Add Expense"}
            </Button>
          </form>

          {/* Table */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Note</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{exp.type}</td>
                    <td className="py-3 px-4">{exp.amount}</td>
                    <td className="py-3 px-4">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {exp.relatedProductId?.name || "—"}
                    </td>
                    <td className="py-3 px-4">{exp.note || "—"}</td>
                    <td className="py-3 px-4 flex gap-4">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500"
                    >
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
