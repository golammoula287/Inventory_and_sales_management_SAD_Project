
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Download, Eye, PlusCircle, MinusCircle } from "lucide-react";
import Button from "../components/Button";
import api from "../services/apiClient.js";
import toast from "react-hot-toast";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialFormState());
  const [isEditing, setIsEditing] = useState(false);
  const [viewSale, setViewSale] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const SALES_API = "/sales";
  const PRODUCT_API = "/products";

  function initialFormState() {
    return {
      id: null,
      items: [{ productId: "", quantity: 1, unitPrice: 0, total: 0 }],
      saleDate: "",
      marketName: "",
      customerName: "",
      customerPhone: "",
      note: "",
    };
  }

  /** Fetch sales + products */
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [resSales, resProducts] = await Promise.all([
        api.get(SALES_API),
        api.get(PRODUCT_API),
      ]);
      setSales(resSales.data || []);
      setProducts(resProducts.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error fetching data");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** Handle product row change */
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "unitPrice") {
      const qty = parseFloat(updatedItems[index].quantity) || 0;
      const price = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].total = qty * price;
    }
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItemRow = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, unitPrice: 0, total: 0 }],
    }));
  };

  const removeItemRow = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!form.saleDate) newErrors.saleDate = "Sale date is required.";
    if (!form.customerName) newErrors.customerName = "Customer name is required.";
    if (!form.customerPhone) newErrors.customerPhone = "Customer phone is required.";
    if (form.items.length === 0) newErrors.items = "At least one product required.";
    form.items.forEach((it, i) => {
      if (!it.productId) newErrors[`product_${i}`] = "Product required.";
      if (!it.quantity) newErrors[`quantity_${i}`] = "Quantity required.";
      if (!it.unitPrice) newErrors[`price_${i}`] = "Unit price required.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Create / Update */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = { 
        ...form, 
        totalAmount: form.items.reduce((sum, it) => sum + it.total, 0) 
      };

      if (isEditing) {
        await api.put(`${SALES_API}/${form.id}`, payload);
        toast.success("✏️ Sale updated");
      } else {
        await api.post(SALES_API, payload);
        toast.success(" Sale added");
      }
      fetchData();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || " Error saving sale");
    } finally {
      setLoading(false);
    }
  };

  /** Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Delete this sale?")) return;
    try {
      await api.delete(`${SALES_API}/${id}`);
      fetchData();
      toast.success(" Sale deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || " Error deleting sale");
    }
  };

  /** Edit */
  const handleEdit = (s) => {
    setForm({
      id: s._id,
      items: s.items.map((it) => ({
        productId: it.productId?._id || it.productId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        total: it.total,
      })),
      saleDate: s.saleDate.split("T")[0],
      marketName: s.marketName,
      customerName: s.customerName,
      customerPhone: s.customerPhone,
      note: s.note,
    });
    setIsEditing(true);
  };

  /** Reset */
  const resetForm = () => {
    setForm(initialFormState());
    setErrors({});
  };

  /** Download invoice */
  const handleDownloadPDF = (saleId) => {
    window.open(`http://localhost:5000/api/sales/${saleId}/invoice`, "_blank");
  };

  /** Filtered sales */
  const filteredSales = sales.filter(
    (s) =>
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.items.some((it) =>
        it.productId?.name?.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600 flex items-center gap-2">
             Sales Management
          </h1>
          <p className="text-gray-600 mt-2">Track and manage all sales records.</p>
        </div>
        <input
          type="text"
          placeholder="Search by customer or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-64 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <div className="lg:col-span-1 bg-white p-6 shadow-xl rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isEditing ? "✏️ Edit Sale" : " Add Sale"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Info */}
            <input name="customerName" value={form.customerName} onChange={(e)=>setForm({...form,customerName:e.target.value})} placeholder="Customer Name" className="w-full p-3 border rounded-lg"/>
            <input name="customerPhone" value={form.customerPhone} onChange={(e)=>setForm({...form,customerPhone:e.target.value})} placeholder="Customer Phone" className="w-full p-3 border rounded-lg"/>
            <input type="date" name="saleDate" value={form.saleDate} onChange={(e)=>setForm({...form,saleDate:e.target.value})} className="w-full p-3 border rounded-lg"/>
            <input name="marketName" value={form.marketName} onChange={(e)=>setForm({...form,marketName:e.target.value})} placeholder="Market Name" className="w-full p-3 border rounded-lg"/>
            <textarea name="note" value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} placeholder="Note" className="w-full p-3 border rounded-lg"/>

            {/* Product Rows */}
            <h3 className="font-semibold text-gray-700 mb-2">Products</h3>

{form.items.map((item, i) => (
  <div
    key={i}
    className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
  >
    {/* Product Select */}
    <label className="block text-sm font-medium text-gray-600 mb-1">Product</label>
    <select
      value={item.productId}
      onChange={(e) => handleItemChange(i, "productId", e.target.value)}
      className="w-full p-2 border rounded mb-3"
    >
      <option value="">Select Product</option>
      {products.map((p) => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>

    {/* Quantity */}
    <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
    <input
      type="number"
      value={item.quantity}
      onChange={(e) => handleItemChange(i, "quantity", e.target.value)}
      placeholder="Qty"
      className="w-full p-2 border rounded mb-3"
    />

    {/* Unit Price */}
    <label className="block text-sm font-medium text-gray-600 mb-1">Unit Price</label>
    <input
      type="number"
      value={item.unitPrice}
      onChange={(e) => handleItemChange(i, "unitPrice", e.target.value)}
      placeholder="Price"
      className="w-full p-2 border rounded mb-3"
    />

    {/* Total */}
    <label className="block text-sm font-medium text-gray-600 mb-1">Total</label>
    <input
      type="number"
      value={item.total}
      readOnly
      className="w-full p-2 border rounded bg-gray-100 mb-3"
    />

    {/* Remove Button */}
    {i > 0 && (
      <button
        type="button"
        onClick={() => removeItemRow(i)}
        className="w-full flex items-center justify-center gap-2 py-2  text-red-600 "
      >
        <Trash2 size={16} /> Remove Product
      </button>
    )}
  </div>
))}

{/* Add Product Button */}
<div className="mt-3">
  <button
    type="button"
    onClick={addItemRow}
    className="flex items-center gap-2 px-3 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
  >
    <PlusCircle size={18} /> Add Product
  </button>
</div>

{/* Grand Total */}
<div className="font-bold text-right text-lg mt-4">
  Grand Total: {form.items.reduce((sum, it) => sum + (it.total || 0), 0)}
</div>

<Button type="submit" className="w-full mt-4" loading={loading}>
  {isEditing ? "Update Sale" : "Add Sale"}
</Button>


          </form>
        </div>

        {/* Table Card */}
        <div className="lg:col-span-2 bg-white p-6 shadow-xl rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4"> Sales List</h2>
          <div className="overflow-x-auto max-h-[600px]">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-indigo-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((s, idx) => (
                  <tr key={s._id} className={idx%2===0?"bg-white":"bg-gray-50"}>
                    <td className="py-3 px-4">
                      {s.items.map((it)=> `${it.productId?.name||"—"} (${it.quantity})`).join(", ")}
                    </td>
                    <td className="py-3 px-4">{s.customerName} ({s.customerPhone})</td>
                    <td className="py-3 px-4 text-center">{s.totalAmount}</td>
                    <td className="py-3 px-4">{new Date(s.saleDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 flex justify-center gap-4">
                      <button onClick={() => setViewSale(s)} className="text-green-600"><Eye size={20}/></button>
                      <button onClick={() => handleEdit(s)} className="text-blue-600"><Pencil size={20}/></button>
                      <button onClick={() => handleDelete(s._id)} className="text-red-600"><Trash2 size={20}/></button>
                      <button onClick={() => handleDownloadPDF(s._id)} className="text-indigo-600"><Download size={20}/></button>
                    </td>
                  </tr>
                ))}
                {filteredSales.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-6 text-gray-500">No sales found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 👁️ View Sale Modal */}
      {viewSale && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-start z-50 mt-20 pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6 border pointer-events-auto">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">Sale Details</h3>
            <p><strong>Customer:</strong> {viewSale.customerName} ({viewSale.customerPhone})</p>
            <p><strong>Market:</strong> {viewSale.marketName || "—"}</p>
            <p><strong>Date:</strong> {new Date(viewSale.saleDate).toLocaleDateString()}</p>
            <h4 className="font-semibold mt-3">Products:</h4>
            <ul className="list-disc ml-5">
              {viewSale.items.map((it,i)=>(
                <li key={i}>{it.productId?.name || "—"} — {it.quantity} × {it.unitPrice} = {it.total}</li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Total: {viewSale.totalAmount}</p>

            <Button onClick={() => setViewSale(null)} className="mt-4 w-full bg-indigo-600 text-white">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
