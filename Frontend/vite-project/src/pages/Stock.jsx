import React, { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import Button from "../components/Button";
import api from "../services/apiClient.js";
import toast from "react-hot-toast";

export default function PurchasePage() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    id: null,
    supplierId: "",
    productId: "",
    quantity: "",
    unitPrice: "",
    totalAmount: 0,
    purchaseDate: "",
    godownId: "",
    invoiceUrl: "",
    note: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const PURCHASE_API = "/purchases";
  const SUPPLIER_API = "/suppliers";
  const PRODUCT_API = "/products";
  const GODOWN_API = "/godowns";

  /** Fetch all data */
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [resPurchases, resSuppliers, resProducts, resGodowns] =
        await Promise.all([
          api.get(PURCHASE_API),
          api.get(SUPPLIER_API),
          api.get(PRODUCT_API),
          api.get(GODOWN_API),
        ]);

      setPurchases(resPurchases.data || []);
      setSuppliers(resSuppliers.data || []);
      setProducts(resProducts.data || []);
      setGodowns(resGodowns.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error fetching data");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (name === "quantity" || name === "unitPrice") {
      const qty = parseFloat(updatedForm.quantity) || 0;
      const price = parseFloat(updatedForm.unitPrice) || 0;
      updatedForm.totalAmount = qty * price;
    }

    setForm(updatedForm);
  };

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!form.supplierId) newErrors.supplierId = "Supplier is required.";
    if (!form.productId) newErrors.productId = "Product is required.";
    if (!form.quantity) newErrors.quantity = "Quantity is required.";
    if (!form.unitPrice) newErrors.unitPrice = "Unit Price is required.";
    if (!form.purchaseDate) newErrors.purchaseDate = "Purchase date is required.";
    if (!form.godownId) newErrors.godownId = "Godown is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Create Purchase */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(PURCHASE_API, {
        supplierId: form.supplierId,
        productId: form.productId,
        quantity: parseFloat(form.quantity),
        unitPrice: parseFloat(form.unitPrice),
        totalAmount: form.totalAmount,
        purchaseDate: form.purchaseDate,
        godowns: [
          { godownId: form.godownId, allocatedQuantity: parseFloat(form.quantity) },
        ],
        invoiceUrl: form.invoiceUrl,
        note: form.note,
      });
      fetchData();
      resetForm();
      toast.success("✅ Purchase added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error creating purchase");
    } finally {
      setLoading(false);
    }
  };

  /** Update Purchase */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.put(`${PURCHASE_API}/${form.id}`, {
        supplierId: form.supplierId,
        productId: form.productId,
        quantity: parseFloat(form.quantity),
        unitPrice: parseFloat(form.unitPrice),
        totalAmount: form.totalAmount,
        purchaseDate: form.purchaseDate,
        godowns: [
          { godownId: form.godownId, allocatedQuantity: parseFloat(form.quantity) },
        ],
        invoiceUrl: form.invoiceUrl,
        note: form.note,
      });
      fetchData();
      resetForm();
      setIsEditing(false);
      toast.success("✏️ Purchase updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error updating purchase");
    } finally {
      setLoading(false);
    }
  };

  /** Delete Purchase */
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this purchase?")) return;
    try {
      await api.delete(`${PURCHASE_API}/${id}`);
      fetchData();
      toast.success("🗑️ Purchase deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error deleting purchase");
    }
  };

  /** Edit Purchase */
  const handleEdit = (purchase) => {
    const firstGodown = purchase.godowns?.[0];
    setForm({
      id: purchase._id,
      supplierId: purchase.supplierId?._id || purchase.supplierId,
      productId: purchase.productId?._id || purchase.productId,
      quantity: purchase.quantity,
      unitPrice: purchase.unitPrice,
      totalAmount: purchase.totalAmount,
      purchaseDate: purchase.purchaseDate.split("T")[0],
      godownId: firstGodown?.godownId?._id || firstGodown?.godownId || "",
      invoiceUrl: purchase.invoiceUrl || "",
      note: purchase.note || "",
    });
    setIsEditing(true);
  };

  /** Reset Form */
  const resetForm = () => {
    setForm({
      id: null,
      supplierId: "",
      productId: "",
      quantity: "",
      unitPrice: "",
      totalAmount: 0,
      purchaseDate: "",
      godownId: "",
      invoiceUrl: "",
      note: "",
    });
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-indigo-600 flex items-center gap-2">
          <PlusCircle size={36} /> Purchase Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all purchase records, suppliers, and godown allocations in one place.
        </p>
      </div>

      {loadingData ? (
        <div className="text-center text-gray-500 py-6">Loading data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ✅ Form Card */}
          <div className="lg:col-span-1 bg-white p-6 shadow-xl rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isEditing ? "✏️ Edit Purchase" : "➕ Add Purchase"}
            </h2>
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <select
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup._id} value={sup._id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
                {errors.supplierId && <span className="text-sm text-red-500">{errors.supplierId}</span>}
              </div>

              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Product</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name}
                    </option>
                  ))}
                </select>
                {errors.productId && <span className="text-sm text-red-500">{errors.productId}</span>}
              </div>

              {/* Qty & Unit Price in Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && <span className="text-sm text-red-500">{errors.quantity}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={form.unitPrice}
                    onChange={handleChange}
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter unit price"
                  />
                  {errors.unitPrice && <span className="text-sm text-red-500">{errors.unitPrice}</span>}
                </div>
              </div>

              {/* Total */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  readOnly
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full bg-gray-100 font-semibold text-indigo-600"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={form.purchaseDate}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                />
                {errors.purchaseDate && <span className="text-sm text-red-500">{errors.purchaseDate}</span>}
              </div>

              {/* Godown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Godown</label>
                <select
                  name="godownId"
                  value={form.godownId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Godown</option>
                  {godowns.map((gd) => (
                    <option key={gd._id} value={gd._id}>
                      {gd.location} (Available: {gd.availableSpace})
                    </option>
                  ))}
                </select>
                {errors.godownId && <span className="text-sm text-red-500">{errors.godownId}</span>}
              </div>

              {/* Invoice URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice URL</label>
                <input
                  type="url"
                  name="invoiceUrl"
                  value={form.invoiceUrl}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter invoice link"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Note</label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Additional notes..."
                ></textarea>
              </div>

              <Button type="submit" className="w-full mt-4" loading={loading}>
                {isEditing ? "Update Purchase" : "Add Purchase"}
              </Button>
            </form>
          </div>

          {/* ✅ Table Card */}
          <div className="lg:col-span-2 bg-white p-6 shadow-xl rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📦 Purchases List</h2>
            <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-indigo-50 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left">Supplier</th>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Godown</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase, idx) => (
                    <tr
                      key={purchase._id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50`}
                    >
                      <td className="py-3 px-4">{purchase.supplierId?.name || "—"}</td>
                      <td className="py-3 px-4">{purchase.productId?.name || "—"}</td>
                      <td className="py-3 px-4 text-center">{purchase.quantity}</td>
                      <td className="py-3 px-4 text-center">{purchase.unitPrice}</td>
                      <td className="py-3 px-4 font-bold text-indigo-600 text-center">
                        {purchase.totalAmount}
                      </td>
                      <td className="py-3 px-4">{purchase.godowns?.[0]?.godownId?.location || "—"}</td>
                      <td className="py-3 px-4">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(purchase)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(purchase._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {purchases.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-6 text-gray-500">
                        No purchases available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
