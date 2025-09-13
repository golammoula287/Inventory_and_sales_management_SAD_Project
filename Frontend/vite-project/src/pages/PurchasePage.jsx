// import React, { useState, useEffect } from 'react';
// import { Pencil, Trash2 } from 'lucide-react';
// import Button from '../components/Button';
// import api from '../services/apiClient.js';

// export default function PurchasePage() {
//   const [purchases, setPurchases] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loadingData, setLoadingData] = useState(true);
//   const [form, setForm] = useState({
//     id: null,
//     supplierId: '',
//     productId: '',
//     quantity: '',
//     unitPrice: '',
//     totalAmount: 0,
//     purchaseDate: '',
//     storageLocation: '',
//     invoiceUrl: '',
//     note: '',
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const PURCHASE_API = '/purchases';
//   const SUPPLIER_API = '/suppliers';
//   const PRODUCT_API = '/products';

//   /** Fetch all data */
//   const fetchData = async () => {
//     setLoadingData(true);
//     try {
//       const [resPurchases, resSuppliers, resProducts] = await Promise.all([
//         api.get(PURCHASE_API),
//         api.get(SUPPLIER_API),
//         api.get(PRODUCT_API),
//       ]);

//       setPurchases(resPurchases.data || []);
//       setSuppliers(resSuppliers.data || []);
//       setProducts(resProducts.data || []);
//     } catch (err) {
//       console.error('Error fetching data:', err.response?.data || err.message);
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   /** Handle input change and calculate total */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const updatedForm = { ...form, [name]: value };

//     if (name === 'quantity' || name === 'unitPrice') {
//       const qty = parseFloat(updatedForm.quantity) || 0;
//       const price = parseFloat(updatedForm.unitPrice) || 0;
//       updatedForm.totalAmount = qty * price;
//     }

//     setForm(updatedForm);
//   };

//   /** Validate form before submit */
//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.supplierId) newErrors.supplierId = 'Supplier is required.';
//     if (!form.productId) newErrors.productId = 'Product is required.';
//     if (!form.quantity) newErrors.quantity = 'Quantity is required.';
//     if (!form.unitPrice) newErrors.unitPrice = 'Unit Price is required.';
//     if (!form.purchaseDate) newErrors.purchaseDate = 'Purchase date is required.';
//     if (!form.storageLocation) newErrors.storageLocation = 'Storage location is required.';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /** Create Purchase */
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     try {
//       await api.post(PURCHASE_API, {
//         supplierId: form.supplierId,
//         productId: form.productId,
//         quantity: parseFloat(form.quantity),
//         unitPrice: parseFloat(form.unitPrice),
//         totalAmount: form.totalAmount,
//         purchaseDate: form.purchaseDate,
//         storageLocation: form.storageLocation,
//         invoiceUrl: form.invoiceUrl,
//         note: form.note,
//       });
//       fetchData();
//       resetForm();
//     } catch (err) {
//       console.error('Error creating purchase:', err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** Update Purchase */
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     try {
//       await api.put(`${PURCHASE_API}/${form.id}`, {
//         supplierId: form.supplierId,
//         productId: form.productId,
//         quantity: parseFloat(form.quantity),
//         unitPrice: parseFloat(form.unitPrice),
//         totalAmount: form.totalAmount,
//         purchaseDate: form.purchaseDate,
//         storageLocation: form.storageLocation,
//         invoiceUrl: form.invoiceUrl,
//         note: form.note,
//       });
//       fetchData();
//       resetForm();
//       setIsEditing(false);
//     } catch (err) {
//       console.error('Error updating purchase:', err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** Delete Purchase */
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`${PURCHASE_API}/${id}`);
//       fetchData();
//     } catch (err) {
//       console.error('Error deleting purchase:', err.response?.data || err.message);
//     }
//   };

//   /** Edit Purchase */
//   const handleEdit = (purchase) => {
//     setForm({
//       id: purchase._id,
//       supplierId: purchase.supplierId?._id || purchase.supplierId,
//       productId: purchase.productId?._id || purchase.productId,
//       quantity: purchase.quantity,
//       unitPrice: purchase.unitPrice,
//       totalAmount: purchase.totalAmount,
//       purchaseDate: purchase.purchaseDate.split('T')[0],
//       storageLocation: purchase.storageLocation,
//       invoiceUrl: purchase.invoiceUrl || '',
//       note: purchase.note || '',
//     });
//     setIsEditing(true);
//   };

//   /** Reset Form */
//   const resetForm = () => {
//     setForm({
//       id: null,
//       supplierId: '',
//       productId: '',
//       quantity: '',
//       unitPrice: '',
//       totalAmount: 0,
//       purchaseDate: '',
//       storageLocation: '',
//       invoiceUrl: '',
//       note: '',
//     });
//     setErrors({});
//   };

//   return (
//     <div className="p-8 bg-gray-50">
//       <h1 className="text-3xl font-semibold mb-6 text-gray-900">Purchase Management</h1>

//       {loadingData ? (
//         <div className="text-center text-gray-500 py-6">Loading data...</div>
//       ) : (
//         <>
//           <form
//             onSubmit={isEditing ? handleUpdate : handleCreate}
//             className="bg-white p-6 shadow-lg rounded-lg mb-8"
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {/* Supplier Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Supplier</label>
//                 <select
//                   name="supplierId"
//                   value={form.supplierId}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                 >
//                   <option value="">Select Supplier</option>
//                   {suppliers.length > 0 ? (
//                     suppliers.map((sup) => (
//                       <option key={sup._id} value={sup._id}>{sup.name}</option>
//                     ))
//                   ) : (
//                     <option disabled>No suppliers found</option>
//                   )}
//                 </select>
//                 {errors.supplierId && <span className="text-sm text-red-500">{errors.supplierId}</span>}
//               </div>

//               {/* Product Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Product</label>
//                 <select
//                   name="productId"
//                   value={form.productId}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                 >
//                   <option value="">Select Product</option>
//                   {products.length > 0 ? (
//                     products.map((prod) => (
//                       <option key={prod._id} value={prod._id}>{prod.name}</option>
//                     ))
//                   ) : (
//                     <option disabled>No products found</option>
//                   )}
//                 </select>
//                 {errors.productId && <span className="text-sm text-red-500">{errors.productId}</span>}
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
//                 />
//               </div>

//               {/* Purchase Date */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
//                 <input
//                   type="date"
//                   name="purchaseDate"
//                   value={form.purchaseDate}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                 />
//                 {errors.purchaseDate && <span className="text-sm text-red-500">{errors.purchaseDate}</span>}
//               </div>

//               {/* Storage Location */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Storage Location</label>
//                 <input
//                   type="text"
//                   name="storageLocation"
//                   value={form.storageLocation}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                   placeholder="Enter storage location"
//                 />
//                 {errors.storageLocation && <span className="text-sm text-red-500">{errors.storageLocation}</span>}
//               </div>

//               {/* Invoice URL */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Invoice URL</label>
//                 <input
//                   type="url"
//                   name="invoiceUrl"
//                   value={form.invoiceUrl}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                   placeholder="Enter invoice link"
//                 />
//               </div>

//               {/* Note */}
//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">Note</label>
//                 <textarea
//                   name="note"
//                   value={form.note}
//                   onChange={handleChange}
//                   className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
//                   placeholder="Additional notes"
//                   rows={3}
//                 ></textarea>
//               </div>
//             </div>

//             <Button type="submit" className="mt-6 w-full" disabled={loading}>
//               {loading ? 'Processing...' : isEditing ? 'Update Purchase' : 'Add Purchase'}
//             </Button>
//           </form>

//           {/* Table */}
//           <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//             <table className="min-w-full table-auto">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-3 px-4">Supplier</th>
//                   <th className="py-3 px-4">Product</th>
//                   <th className="py-3 px-4">Qty</th>
//                   <th className="py-3 px-4">Unit Price</th>
//                   <th className="py-3 px-4">Total</th>
//                   <th className="py-3 px-4">Storage</th>
//                   <th className="py-3 px-4">Date</th>
//                   <th className="py-3 px-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {purchases.map((purchase) => (
//                   <tr key={purchase._id} className="border-t hover:bg-gray-50">
//                     <td className="py-3 px-4">{purchase.supplierId?.name || '—'}</td>
//                     <td className="py-3 px-4">{purchase.productId?.name || '—'}</td>
//                     <td className="py-3 px-4">{purchase.quantity}</td>
//                     <td className="py-3 px-4">{purchase.unitPrice}</td>
//                     <td className="py-3 px-4">{purchase.totalAmount}</td>
//                     <td className="py-3 px-4">{purchase.storageLocation}</td>
//                     <td className="py-3 px-4">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
//                     <td className="py-3 px-4 flex gap-4">
//                       <button onClick={() => handleEdit(purchase)} className="text-blue-600 hover:text-blue-800">
//                         <Pencil size={20} />
//                       </button>
//                       <button onClick={() => handleDelete(purchase._id)} className="text-red-600 hover:text-red-800">
//                         <Trash2 size={20} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {purchases.length === 0 && (
//                   <tr>
//                     <td colSpan="8" className="text-center py-4 text-gray-500">No purchases available.</td>
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



import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/apiClient.js';
import toast from 'react-hot-toast';

export default function PurchasePage() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    id: null,
    supplierId: '',
    productId: '',
    quantity: '',
    unitPrice: '',
    totalAmount: 0,
    purchaseDate: '',
    godownId: '',
    invoiceUrl: '',
    note: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const PURCHASE_API = '/purchases';
  const SUPPLIER_API = '/suppliers';
  const PRODUCT_API = '/products';
  const GODOWN_API = '/godowns';

  /** Fetch all data */
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [resPurchases, resSuppliers, resProducts, resGodowns] = await Promise.all([
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
      toast.error(err.response?.data?.message || '❌ Error fetching data');
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

    if (name === 'quantity' || name === 'unitPrice') {
      const qty = parseFloat(updatedForm.quantity) || 0;
      const price = parseFloat(updatedForm.unitPrice) || 0;
      updatedForm.totalAmount = qty * price;
    }

    setForm(updatedForm);
  };

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!form.supplierId) newErrors.supplierId = 'Supplier is required.';
    if (!form.productId) newErrors.productId = 'Product is required.';
    if (!form.quantity) newErrors.quantity = 'Quantity is required.';
    if (!form.unitPrice) newErrors.unitPrice = 'Unit Price is required.';
    if (!form.purchaseDate) newErrors.purchaseDate = 'Purchase date is required.';
    if (!form.godownId) newErrors.godownId = 'Godown is required.';
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
      toast.success('✅ Purchase added successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Error creating purchase');
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
      toast.success('✏️ Purchase updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Error updating purchase');
    } finally {
      setLoading(false);
    }
  };

  /** Delete Purchase (with confirmation) */
  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this purchase?')) return;
    try {
      await api.delete(`${PURCHASE_API}/${id}`);
      fetchData();
      toast.success('🗑️ Purchase deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Error deleting purchase');
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
      purchaseDate: purchase.purchaseDate.split('T')[0],
      godownId: firstGodown?.godownId?._id || firstGodown?.godownId || '',
      invoiceUrl: purchase.invoiceUrl || '',
      note: purchase.note || '',
    });
    setIsEditing(true);
  };

  /** Reset Form */
  const resetForm = () => {
    setForm({
      id: null,
      supplierId: '',
      productId: '',
      quantity: '',
      unitPrice: '',
      totalAmount: 0,
      purchaseDate: '',
      godownId: '',
      invoiceUrl: '',
      note: '',
    });
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50">
      <div className="mb-10 flex justify-between items-center">
  <div>
    <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-2">
      Purchases Management
    </h1>
    <p className="text-gray-600 mt-2">Track and manage all purchase records.</p>
  </div>
  
</div>


      {loadingData ? (
        <div className="text-center text-gray-500 py-6">Loading data...</div>
      ) : (
        <>
          {/* ✅ Form */}
          <form
            onSubmit={isEditing ? handleUpdate : handleCreate}
            className="bg-white p-6 shadow-lg rounded-lg mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <select
                  name="supplierId"
                  autoComplete="off"
                  value={form.supplierId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup._id} value={sup._id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
                {errors.supplierId && (
                  <span className="text-sm text-red-500">{errors.supplierId}</span>
                )}
              </div>

              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product
                </label>
                <select
                  name="productId"
                  autoComplete="off"
                  value={form.productId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                >
                  <option value="">Select Product</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name}
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <span className="text-sm text-red-500">{errors.productId}</span>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  autoComplete="off"
                  value={form.quantity}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter quantity"
                />
                {errors.quantity && (
                  <span className="text-sm text-red-500">{errors.quantity}</span>
                )}
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Price
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  autoComplete="off"
                  value={form.unitPrice}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter unit price"
                />
                {errors.unitPrice && (
                  <span className="text-sm text-red-500">{errors.unitPrice}</span>
                )}
              </div>

              {/* Total */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  readOnly
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full bg-gray-100"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  autoComplete="off"
                  value={form.purchaseDate}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                />
                {errors.purchaseDate && (
                  <span className="text-sm text-red-500">
                    {errors.purchaseDate}
                  </span>
                )}
              </div>

              {/* Godown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Godown
                </label>
                <select
                  name="godownId"
                  autoComplete="off"
                  value={form.godownId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                >
                  <option value="">Select Godown</option>
                  {godowns.map((gd) => (
                    <option key={gd._id} value={gd._id}>
                      {gd.location} (Available: {gd.availableSpace})
                    </option>
                  ))}
                </select>
                {errors.godownId && (
                  <span className="text-sm text-red-500">{errors.godownId}</span>
                )}
              </div>

              {/* Invoice URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Invoice URL
                </label>
                <input
                  type="url"
                  name="invoiceUrl"
                  autoComplete="off"
                  value={form.invoiceUrl}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter invoice link"
                />
              </div>

              {/* Note */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Note
                </label>
                <textarea
                  name="note"
                  autoComplete="off"
                  value={form.note}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Additional notes"
                  rows={3}
                ></textarea>
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full" loading={loading}>
              {isEditing ? 'Update Purchase' : 'Add Purchase'}
            </Button>
          </form>

          {/* ✅ Table with scrollbar */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Godown</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr
                      key={purchase._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {purchase.supplierId?.name || '—'}
                      </td>
                      <td className="py-3 px-4">
                        {purchase.productId?.name || '—'}
                      </td>
                      <td className="py-3 px-4">{purchase.quantity}</td>
                      <td className="py-3 px-4">{purchase.unitPrice}</td>
                      <td className="py-3 px-4">{purchase.totalAmount}</td>
                      <td className="py-3 px-4">
                        {purchase.godowns?.[0]?.godownId?.location || '—'}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 flex gap-4">
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
                      <td
                        colSpan="8"
                        className="text-center py-4 text-gray-500"
                      >
                        No purchases available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
