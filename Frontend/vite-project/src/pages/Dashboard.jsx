




import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  // Mock data (replace with API later)
  const kpis = {
    products: 120,
    sales: 350,
    revenue: 540000,
    expenses: 120000,
    growth: "15.6%",
  };

  const profitLossData = [
    { month: "Jan", profit: 20000 },
    { month: "Feb", profit: 15000 },
    { month: "Mar", profit: 30000 },
    { month: "Apr", profit: 18000 },
    { month: "May", profit: 35000 },
  ];

  const pieData = [
    { name: "Rice", value: 40000 },
    { name: "Onion", value: 25000 },
    { name: "Pulses", value: 15000 },
    { name: "Potato", value: 10000 },
  ];

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Loading state (Optional if you're fetching data asynchronously)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulating 1.5 seconds data fetch delay
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto ml-64 sm:ml-0 transition-all">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-6">
          Welcome {user?.name || user?.email || "back"}!
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Object.keys(kpis).map((key) => (
            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              {key === 'products' && <Package className="text-blue-500" />}
              {key === 'sales' && <ShoppingCart className="text-green-500" />}
              {key === 'revenue' && <DollarSign className="text-yellow-500" />}
              {key === 'growth' && <TrendingUp className="text-red-500" />}
              <div>
                <p className="text-sm text-gray-500 capitalize">{key}</p>
                <p className="text-xl font-semibold">
                  {key === 'revenue' ? `৳${kpis[key].toLocaleString()}` : kpis[key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Profit & Loss Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={profitLossData}>
                <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={3} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Sales by Product</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <table className="w-full text-sm text-left border-t">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2">Product</th>
                <th>Sold Qty</th>
                <th>Revenue</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2">Rice</td>
                <td>500</td>
                <td>৳50,000</td>
                <td>৳10,000</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Onion</td>
                <td>300</td>
                <td>৳30,000</td>
                <td>৳5,000</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Potato</td>
                <td>200</td>
                <td>৳20,000</td>
                <td>৳3,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
