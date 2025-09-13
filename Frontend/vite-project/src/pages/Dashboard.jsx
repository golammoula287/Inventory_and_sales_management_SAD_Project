


// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext.jsx";
// import {
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [kpis, setKpis] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/dashboard"); // 👈 use full API URL or proxy
//         if (!res.ok) throw new Error("Failed to fetch dashboard data");
//         const data = await res.json();
//         setKpis(data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen">
//       <main className="flex-1 bg-gray-50 p-6 overflow-y-auto ml-64 sm:ml-0 transition-all">
        

//         <div className="mb-10 flex justify-between items-center">
//   <div>
//     <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-2">
//       Dashboard
//     </h1>
//     <p className="text-gray-600 mt-2">Track and manage all  records.</p>
//   </div>
  
// </div>

//         <p className="text-gray-700 mb-6">
//           Welcome {user?.name || user?.email || "back"}!
//         </p>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
//             <Package className="text-blue-500" />
//             <div>
//               <p className="text-sm text-gray-500">Products</p>
//               <p className="text-xl font-semibold">
//                 {kpis?.totalProducts ?? 0}
//               </p>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
//             <ShoppingCart className="text-green-500" />
//             <div>
//               <p className="text-sm text-gray-500">Sales</p>
//               <p className="text-xl font-semibold">{kpis?.totalSales ?? 0}</p>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
//             <DollarSign className="text-yellow-500" />
//             <div>
//               <p className="text-sm text-gray-500">Expenses</p>
//               <p className="text-xl font-semibold">
//                 ৳{kpis?.totalExpenses?.toLocaleString() ?? 0}
//               </p>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
//             <TrendingUp className="text-red-500" />
//             <div>
//               <p className="text-sm text-gray-500">Stock</p>
//               <p className="text-xl font-semibold">{kpis?.totalStock ?? 0}</p>
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
//             <h2 className="text-lg font-semibold mb-4">Profit & Loss Trend</h2>
//             <ResponsiveContainer width="100%" height={250}>
//               <LineChart data={[{ month: "Jan", profit: 1000 }, { month: "Feb", profit: 2000 }]}>
//                 <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={3} />
//                 <Tooltip />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">Sales by Product</h2>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={[
//                     { name: "Rice", value: 40000 },
//                     { name: "Onion", value: 25000 },
//                   ]}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   dataKey="value"
//                   label
//                 >
//                   {colors.map((color, i) => (
//                     <Cell key={i} fill={color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        setKpis(data);

        // also fetch recent purchases and sales
        const [purchasesRes, salesRes] = await Promise.all([
          fetch("http://localhost:5000/api/purchases?limit=5"),
          fetch("http://localhost:5000/api/sales?limit=5"),
        ]);
        setRecentPurchases(await purchasesRes.json());
        setRecentSales(await salesRes.json());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Dummy Profit/Loss trend data (replace with API data)
  const profitLossTrend = [
    { month: "Jan", Profit: 1200, Loss: 200 },
    { month: "Feb", Profit: 800, Loss: 400 },
    { month: "Mar", Profit: 1500, Loss: 500 },
    { month: "Apr", Profit: 1000, Loss: 300 },
  ];

  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto ml-64 sm:ml-0 transition-all">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-2">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage all records.
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          Welcome {user?.name || user?.email || "back"}!
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 col-span-1">
            <Package className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="text-xl font-semibold">{kpis?.totalProducts ?? 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 col-span-1">
            <ShoppingCart className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-xl font-semibold">{kpis?.totalSales ?? 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 col-span-1">
            <DollarSign className="text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-xl font-semibold">
                ৳{kpis?.totalExpenses?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 col-span-1">
            <TrendingUp className="text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Stock</p>
              <p className="text-xl font-semibold">{kpis?.totalStock ?? 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 col-span-1">
            <ArrowUpCircle className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Profit</p>
              <p className="text-xl font-semibold">
                ৳{kpis?.totalProfit?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 col-span-1">
            <ArrowDownCircle className="text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Loss</p>
              <p className="text-xl font-semibold">
                ৳{kpis?.totalLoss?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Profit & Loss Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={profitLossTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Profit" fill="#4CAF50" />
                <Bar dataKey="Loss" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Sales by Product</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Rice", value: 40000 },
                    { name: "Onion", value: 25000 },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {colors.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Purchases & Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Purchases</h2>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-4 py-2">{p.productId?.name}</td>
                    <td className="px-4 py-2 text-center">{p.quantity}</td>
                    <td className="px-4 py-2">
                      {new Date(p.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="px-4 py-2">
                      {s.customerName} ({s.customerPhone})
                    </td>
                    <td className="px-4 py-2 text-center">৳{s.totalAmount}</td>
                    <td className="px-4 py-2">
                      {new Date(s.saleDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
