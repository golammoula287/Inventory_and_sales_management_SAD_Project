


// import React, { useState, useEffect } from "react";
// import { Pencil, Trash2 } from "lucide-react";
// import Button from "../components/Button";
// import api from "../services/apiClient.js";

// export default function SalesPage() {
//   const [sales, setSales] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [godowns, setGodowns] = useState([]);
//   const [loadingData, setLoadingData] = useState(true);
//   const [form, setForm] = useState({
//     id: null,
//     productId: "",
//     saleDate: "",
//     marketName: "",
//     quantity: "",
//     unitPrice: "",
//     totalAmount: 0,
//     customerName: "",
//     customerPhone: "",
//     godownId: "", // single godown selection
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const SALES_API = "/sales";
//   const PRODUCT_API = "/products";
//   const GODOWN_API = "/godowns"; // fetch available godowns

//   /** Fetch sales + products + godowns */
//   const fetchData = async () => {
//     setLoadingData(true);
//     try {
//       const [resSales, resProducts, resGodowns] = await Promise.all([
//         api.get(SALES_API),
//         api.get(PRODUCT_API),
//         api.get(GODOWN_API),
//       ]);
//       setSales(resSales.data || []);
//       setProducts(resProducts.data || []);
//       setGodowns(resGodowns.data || []);
//     } catch (err) {
//       console.error("Error fetching data:", err.response?.data || err.message);
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   /** Handle input change and calculate totalAmount */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => {
//       const updated = { ...prev, [name]: value };
//       const qty = parseFloat(updated.quantity) || 0;
//       const price = parseFloat(updated.unitPrice) || 0;
//       updated.totalAmount = qty * price;
//       return updated;
//     });
//   };

//   /** Validate form */
//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.productId) newErrors.productId = "Product is required.";
//     if (!form.saleDate) newErrors.saleDate = "Sale date is required.";
//     if (!form.marketName) newErrors.marketName = "Market name is required.";
//     if (!form.quantity) newErrors.quantity = "Quantity is required.";
//     if (!form.unitPrice) newErrors.unitPrice = "Unit price is required.";
//     if (!form.customerName) newErrors.customerName = "Customer name is required.";
//     if (!form.customerPhone) newErrors.customerPhone = "Customer phone is required.";
//     if (!form.godownId) newErrors.godownId = "Godown is required.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /** Create Sale */
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     try {
//       await api.post(SALES_API, {
//         productId: form.productId,
//         saleDate: form.saleDate,
//         marketName: form.marketName,
//         quantity: parseFloat(form.quantity),
//         unitPrice: parseFloat(form.unitPrice),
//         totalAmount: form.totalAmount,
//         customerName: form.customerName,
//         customerPhone: form.customerPhone,
//         godowns: [
//           { godownId: form.godownId, soldQuantity: parseFloat(form.quantity) },
//         ],
//       });
//       fetchData();
//       resetForm();
//     } catch (err) {
//       console.error("Error creating sale:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** Update Sale */
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     try {
//       await api.put(`${SALES_API}/${form.id}`, {
//         productId: form.productId,
//         saleDate: form.saleDate,
//         marketName: form.marketName,
//         quantity: parseFloat(form.quantity),
//         unitPrice: parseFloat(form.unitPrice),
//         totalAmount: form.totalAmount,
//         customerName: form.customerName,
//         customerPhone: form.customerPhone,
//         godowns: [
//           { godownId: form.godownId, soldQuantity: parseFloat(form.quantity) },
//         ],
//       });
//       fetchData();
//       resetForm();
//       setIsEditing(false);
//     } catch (err) {
//       console.error("Error updating sale:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** Delete Sale */
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`${SALES_API}/${id}`);
//       fetchData();
//     } catch (err) {
//       console.error("Error deleting sale:", err.response?.data || err.message);
//     }
//   };

//   /** Edit Sale */
//   const handleEdit = (sale) => {
//     setForm({
//       id: sale._id,
//       productId: sale.productId?._id || sale.productId,
//       saleDate: sale.saleDate.split("T")[0],
//       marketName: sale.marketName,
//       quantity: sale.quantity,
//       unitPrice: sale.unitPrice,
//       totalAmount: sale.totalAmount,
//       customerName: sale.customerName,
//       customerPhone: sale.customerPhone,
//       godownId: sale.godowns?.[0]?.godownId || "",
//     });
//     setIsEditing(true);
//   };

//   /** Reset Form */
//   const resetForm = () => {
//     setForm({
//       id: null,
//       productId: "",
//       saleDate: "",
//       marketName: "",
//       quantity: "",
//       unitPrice: "",
//       totalAmount: 0,
//       customerName: "",
//       customerPhone: "",
//       godownId: "",
//     });
//     setErrors({});
//   };

//   return (
//     <div className="p-8 bg-gray-50">
//       <h1 className="text-3xl font-semibold mb-6 text-gray-900">Sales Management</h1>

//       {loadingData ? (
//         <div className="text-center text-gray-500 py-6">Loading data...</div>
//       ) : (
//         <>
//           {/* Form */}
//           <form
//             onSubmit={isEditing ? handleUpdate : handleCreate}
//             className="bg-white p-6 shadow-lg rounded-lg mb-8"
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {/* Product */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Product</label>
//                 <select
//                   name="productId"
//                   value={form.productId}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                 >
//                   <option value="">Select Product</option>
//                   {products.map((prod) => (
//                     <option key={prod._id} value={prod._id}>{prod.name}</option>
//                   ))}
//                 </select>
//                 {errors.productId && <span className="text-sm text-red-500">{errors.productId}</span>}
//               </div>

//               {/* Sale Date */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Sale Date</label>
//                 <input
//                   type="date"
//                   name="saleDate"
//                   value={form.saleDate}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                 />
//                 {errors.saleDate && <span className="text-sm text-red-500">{errors.saleDate}</span>}
//               </div>

//               {/* Market Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Market Name</label>
//                 <input
//                   type="text"
//                   name="marketName"
//                   value={form.marketName}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                   placeholder="Enter market name"
//                 />
//                 {errors.marketName && <span className="text-sm text-red-500">{errors.marketName}</span>}
//               </div>

//               {/* Quantity */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Quantity</label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={form.quantity}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                   placeholder="Enter quantity"
//                 />
//                 {errors.quantity && <span className="text-sm text-red-500">{errors.quantity}</span>}
//               </div>

//               {/* Unit Price */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Unit Price</label>
//                 <input
//                   type="number"
//                   name="unitPrice"
//                   value={form.unitPrice}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                   placeholder="Enter unit price"
//                 />
//                 {errors.unitPrice && <span className="text-sm text-red-500">{errors.unitPrice}</span>}
//               </div>

//               {/* Total Amount */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Total Amount</label>
//                 <input
//                   type="number"
//                   name="totalAmount"
//                   value={form.totalAmount}
//                   readOnly
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full bg-gray-100"
//                   placeholder="Total amount"
//                 />
//               </div>

//               {/* Customer Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Customer Name</label>
//                 <input
//                   type="text"
//                   name="customerName"
//                   value={form.customerName}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                   placeholder="Enter customer name"
//                 />
//                 {errors.customerName && <span className="text-sm text-red-500">{errors.customerName}</span>}
//               </div>

//               {/* Customer Phone */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Customer Phone</label>
//                 <input
//                   type="text"
//                   name="customerPhone"
//                   value={form.customerPhone}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                   placeholder="Enter customer phone"
//                 />
//                 {errors.customerPhone && <span className="text-sm text-red-500">{errors.customerPhone}</span>}
//               </div>

//               {/* Godown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Godown</label>
//                 <select
//                   name="godownId"
//                   value={form.godownId}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                 >
//                   <option value="">Select Godown</option>
//                   {godowns.map((g) => (
//                     <option key={g._id} value={g._id}>
//                       {g.godownId} - {g.location} (Available: {g.availableSpace})
//                     </option>
//                   ))}
//                 </select>
//                 {errors.godownId && <span className="text-sm text-red-500">{errors.godownId}</span>}
//               </div>
//             </div>

//             <Button type="submit" className="mt-6 w-full" disabled={loading}>
//               {loading ? "Processing..." : isEditing ? "Update Sale" : "Add Sale"}
//             </Button>
//           </form>

//           {/* Table */}
//           <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//             <table className="min-w-full table-auto">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-3 px-4">Product</th>
//                   <th className="py-3 px-4">Market</th>
//                   <th className="py-3 px-4">Qty</th>
//                   <th className="py-3 px-4">Unit Price</th>
//                   <th className="py-3 px-4">Total</th>
//                   <th className="py-3 px-4">Customer</th>
//                   <th className="py-3 px-4">Date</th>
//                   <th className="py-3 px-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sales.map((sale) => (
//                   <tr key={sale._id} className="border-t hover:bg-gray-50">
//                     <td className="py-3 px-4">{sale.productId?.name || "—"}</td>
//                     <td className="py-3 px-4">{sale.marketName}</td>
//                     <td className="py-3 px-4">{sale.quantity}</td>
//                     <td className="py-3 px-4">{sale.unitPrice}</td>
//                     <td className="py-3 px-4">{sale.totalAmount}</td>
//                     <td className="py-3 px-4">{sale.customerName} ({sale.customerPhone})</td>
//                     <td className="py-3 px-4">{new Date(sale.saleDate).toLocaleDateString()}</td>
//                     <td className="py-3 px-4 flex gap-4">
//                       <button onClick={() => handleEdit(sale)} className="text-blue-600 hover:text-blue-800">
//                         <Pencil size={20} />
//                       </button>
//                       <button onClick={() => handleDelete(sale._id)} className="text-red-600 hover:text-red-800">
//                         <Trash2 size={20} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {sales.length === 0 && (
//                   <tr>
//                     <td colSpan="8" className="text-center py-4 text-gray-500">
//                       No sales available.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../components/Button";
import api from "../services/apiClient.js";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    id: null,
    productId: "",
    saleDate: "",
    marketName: "",
    quantity: "",
    unitPrice: "",
    totalAmount: 0,
    customerName: "",
    customerPhone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const SALES_API = "/sales";
  const PRODUCT_API = "/products";

  /** Fetch sales and products */
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
      console.error("Error fetching data:", err.response?.data || err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** Handle form input change & calculate totalAmount */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      const qty = parseFloat(updated.quantity) || 0;
      const price = parseFloat(updated.unitPrice) || 0;
      updated.totalAmount = qty * price;
      return updated;
    });
  };

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!form.productId) newErrors.productId = "Product is required.";
    if (!form.saleDate) newErrors.saleDate = "Sale date is required.";
    if (!form.marketName) newErrors.marketName = "Market name is required.";
    if (!form.quantity) newErrors.quantity = "Quantity is required.";
    if (!form.unitPrice) newErrors.unitPrice = "Unit price is required.";
    if (!form.customerName) newErrors.customerName = "Customer name is required.";
    if (!form.customerPhone) newErrors.customerPhone = "Customer phone is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Create Sale */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(SALES_API, {
        productId: form.productId,
        saleDate: form.saleDate,
        marketName: form.marketName,
        quantity: parseFloat(form.quantity),
        unitPrice: parseFloat(form.unitPrice),
        totalAmount: form.totalAmount,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
      });
      fetchData();
      resetForm();
    } catch (err) {
      console.error("Error creating sale:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Update Sale */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.put(`${SALES_API}/${form.id}`, {
        productId: form.productId,
        saleDate: form.saleDate,
        marketName: form.marketName,
        quantity: parseFloat(form.quantity),
        unitPrice: parseFloat(form.unitPrice),
        totalAmount: form.totalAmount,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
      });
      fetchData();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating sale:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Delete Sale */
  const handleDelete = async (id) => {
    try {
      await api.delete(`${SALES_API}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting sale:", err.response?.data || err.message);
    }
  };

  /** Edit Sale */
  const handleEdit = (sale) => {
    setForm({
      id: sale._id,
      productId: sale.productId?._id || sale.productId,
      saleDate: sale.saleDate.split("T")[0],
      marketName: sale.marketName,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      totalAmount: sale.totalAmount,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
    });
    setIsEditing(true);
  };

  /** Reset Form */
  const resetForm = () => {
    setForm({
      id: null,
      productId: "",
      saleDate: "",
      marketName: "",
      quantity: "",
      unitPrice: "",
      totalAmount: 0,
      customerName: "",
      customerPhone: "",
    });
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Sales Management</h1>

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
              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                >
                  <option value="">Select Product</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>{prod.name}</option>
                  ))}
                </select>
                {errors.productId && <span className="text-sm text-red-500">{errors.productId}</span>}
              </div>

              {/* Sale Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Sale Date</label>
                <input
                  type="date"
                  name="saleDate"
                  value={form.saleDate}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                />
                {errors.saleDate && <span className="text-sm text-red-500">{errors.saleDate}</span>}
              </div>

              {/* Market Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Market Name</label>
                <input
                  type="text"
                  name="marketName"
                  value={form.marketName}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter market name"
                />
                {errors.marketName && <span className="text-sm text-red-500">{errors.marketName}</span>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter quantity"
                />
                {errors.quantity && <span className="text-sm text-red-500">{errors.quantity}</span>}
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter unit price"
                />
                {errors.unitPrice && <span className="text-sm text-red-500">{errors.unitPrice}</span>}
              </div>

              {/* Total Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  readOnly
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full bg-gray-100"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter customer name"
                />
                {errors.customerName && <span className="text-sm text-red-500">{errors.customerName}</span>}
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Phone</label>
                <input
                  type="text"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter customer phone"
                />
                {errors.customerPhone && <span className="text-sm text-red-500">{errors.customerPhone}</span>}
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={loading}>
              {loading ? "Processing..." : isEditing ? "Update Sale" : "Add Sale"}
            </Button>
          </form>

          {/* Table */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Market</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{sale.productId?.name || "—"}</td>
                    <td className="py-3 px-4">{sale.marketName}</td>
                    <td className="py-3 px-4">{sale.quantity}</td>
                    <td className="py-3 px-4">{sale.unitPrice}</td>
                    <td className="py-3 px-4">{sale.totalAmount}</td>
                    <td className="py-3 px-4">{sale.customerName} ({sale.customerPhone})</td>
                    <td className="py-3 px-4">{new Date(sale.saleDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 flex gap-4">
                      <button onClick={() => handleEdit(sale)} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleDelete(sale._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">No sales available.</td>
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


