


// // import React, { useEffect, useState } from "react";
// // import api from "../services/apiClient.js";
// // import toast from "react-hot-toast";

// // export default function StockPage() {
// //   const [categories, setCategories] = useState([]);
// //   const [stock, setStock] = useState([]);
// //   const [selectedCategory, setSelectedCategory] = useState("");

// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         const res = await api.get("/categories");
// //         setCategories(res.data);
// //         if (res.data.length > 0) setSelectedCategory(res.data[0]._id); // default first category
// //       } catch (err) {
// //         toast.error("Error fetching categories");
// //       }
// //     };
// //     fetchCategories();
// //   }, []);

// //   useEffect(() => {
// //     if (selectedCategory) {
// //       fetchStock(selectedCategory);
// //     }
// //   }, [selectedCategory]);

// //   const fetchStock = async (catId) => {
// //     try {
// //       const res = await api.get(`/stock/category/${catId}`);
// //       setStock(res.data);
// //     } catch (err) {
// //       toast.error("Error fetching stock");
// //     }
// //   };

// //   return (
// //     <div className="p-8 bg-gray-50 min-h-screen">
// //       <h1 className="text-3xl font-bold text-indigo-600 mb-6"> Stock Management</h1>

// //       <div className="mb-6">
// //         <label className="font-semibold mr-3">Select Category:</label>
// //         <select
// //           value={selectedCategory}
// //           onChange={(e) => setSelectedCategory(e.target.value)}
// //           className="p-2 border rounded"
// //         >
// //           {categories.map((c) => (
// //             <option key={c._id} value={c._id}>
// //               {c.name}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
// //         <thead className="bg-indigo-50">
// //           <tr>
// //             <th className="py-3 px-4">Product</th>
// //             <th className="py-3 px-4">Purchased</th>
// //             <th className="py-3 px-4">Sold</th>
// //             <th className="py-3 px-4">Available Stock</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {stock.map((s) => (
// //             <tr key={s.productId} className="border-t">
// //               <td className="py-3 px-4">{s.productName}</td>
// //               <td className="py-3 px-4 text-center">{s.purchased}</td>
// //               <td className="py-3 px-4 text-center">{s.sold}</td>
// //               <td className="py-3 px-4 text-center font-semibold">{s.available}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }



// import React, { useEffect, useState } from "react";
// import api from "../services/apiClient.js";
// import toast from "react-hot-toast";

// export default function StockPage() {
//   const [categories, setCategories] = useState([]);
//   const [stock, setStock] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all"); // Default: All Products

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await api.get("/categories");
//         setCategories(res.data);
//       } catch (err) {
//         toast.error("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchStock(selectedCategory); // Always call with current category
//   }, [selectedCategory]);

//   const fetchStock = async (catId) => {
//     try {
//       const endpoint = catId === "all" ? "/stock/category/all" : `/stock/category/${catId}`;
//       const res = await api.get(endpoint);
//       setStock(res.data);
//     } catch (err) {
//       toast.error("Error fetching stock");
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h1 className="text-4xl font-bold text-blue-600 mb-6">Stock Management</h1>

//       {/* Category Selector */}
//       <div className="mb-6">
//         <label className="font-semibold mr-3">Select Category:</label>
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="p-2 border rounded"
//         >
//           <option value="all">All Products</option>
//           {categories.map((c) => (
//             <option key={c._id} value={c._id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Stock Table */}
//       <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
//         <thead className="bg-indigo-50">
//           <tr>
//             <th className="py-3 px-4">Product</th>
//             <th className="py-3 px-4">Purchased</th>
//             <th className="py-3 px-4">Sold</th>
//             <th className="py-3 px-4">Available Stock</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stock.map((s) => (
//             <tr key={s.productId} className="border-t">
//               <td className="py-3 px-4">{s.productName}</td>
//               <td className="py-3 px-4 text-center">{s.purchased}</td>
//               <td className="py-3 px-4 text-center">{s.sold}</td>
//               <td className="py-3 px-4 text-center font-semibold">{s.available}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import api from "../services/apiClient.js";
import toast from "react-hot-toast";

export default function StockPage() {
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default: All Products

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        toast.error("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchStock(selectedCategory);
  }, [selectedCategory]);

  const fetchStock = async (catId) => {
    try {
      const endpoint = catId === "all" ? "/stock/category/all" : `/stock/category/${catId}`;
      const res = await api.get(endpoint);
      setStock(res.data);
    } catch (err) {
      toast.error("Error fetching stock");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Stock Management</h1>

      {/* Category Selector */}
      <div className="mb-6">
        <label className="font-semibold mr-3">Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Products</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Table */}
      <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
        <thead className="bg-indigo-50">
          <tr>
            <th className="">Product</th>
            <th className="py-3 px-4">Purchased</th>
            <th className="py-3 px-4">Sold</th>
            <th className="py-3 px-4">Available Stock</th>
            <th className="py-3 px-4">Godown</th>
            <th className="py-3 px-4">Available Space</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((s) => (
            <tr key={s.productId} className="border-t">
              <td className="py-3 px-4 text-center">{s.productName}</td>
              <td className="py-3 px-4 text-center">{s.purchased}</td>
              <td className="py-3 px-4 text-center">{s.sold}</td>
              <td className="py-3 px-4 text-center font-semibold">{s.available}</td>
              <td className="py-3 px-4 text-center">
                {s.godowns?.map((g) => g.location).join(", ") || "N/A"}
              </td>
              <td className="py-3 px-4 text-center">
                {s.godowns?.map((g) => g.availableSpace).join(", ") || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
