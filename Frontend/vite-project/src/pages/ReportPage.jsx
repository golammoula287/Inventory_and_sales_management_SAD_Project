


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Download } from "lucide-react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { Button } from "@/components/ui/button";

// const ProfitLossReport = () => {
//   const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // 1st of current month
//   const [endDate, setEndDate] = useState(new Date()); // today
//   const [reportData, setReportData] = useState(null);
//   const [dailyData, setDailyData] = useState({ sales: [], purchases: [], expenses: [] });
//   const [loading, setLoading] = useState(false);

//   // Fetch report on page load (current month)
//   useEffect(() => {
//     fetchReport();
//   }, []);

//   // Fetch Profit/Loss Data
//   const fetchReport = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`http://localhost:5000/api/reports/profit-loss`, {
//         params: { startDate, endDate },
//       });
//       setReportData(res.data);
//       fetchDailyStats();
//     } catch (err) {
//       alert("Error fetching report data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Daily Stats Data
//   const fetchDailyStats = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/reports/daily-stats`, {
//         params: { startDate, endDate },
//       });
//       setDailyData(res.data);
//     } catch (err) {
//       alert("Error fetching daily stats");
//     }
//   };

//   // Download CSV with custom format
//   const downloadCSV = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/reports/daily-stats`, {
//         params: { startDate, endDate },
//       });

//       const { sales, purchases, expenses } = res.data;
//       let csvContent = "Munna Enterprise - Profit & Loss Report\n";
//       csvContent += `From: ${startDate.toDateString()} To: ${endDate.toDateString()}\n\n`;
//       csvContent += "Date, Sales, Purchases, Expenses\n";

//       let totalSales = 0, totalPurchases = 0, totalExpenses = 0;

//       // Add daily rows
//       sales.forEach((s, idx) => {
//         const date = s._id;
//         const sale = s.total || 0;
//         const purchase = purchases[idx]?.total || 0;
//         const expense = expenses[idx]?.total || 0;

//         totalSales += sale;
//         totalPurchases += purchase;
//         totalExpenses += expense;

//         csvContent += `${date}, ${sale}, ${purchase}, ${expense}\n`;
//       });

//       // Add totals row
//       const profitLoss = totalSales - (totalPurchases + totalExpenses);
//       csvContent += `\nTotal, ${totalSales}, ${totalPurchases}, ${totalExpenses}\n`;
//       csvContent += `Profit/Loss, ${profitLoss}\n`;

//       // Download CSV
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "Profit_Loss_Report.csv");
//       document.body.appendChild(link);
//       link.click();
//     } catch (err) {
//       alert("Error downloading CSV");
//     }
//   };

//   // Prepare Chart Data
//   const chartData = dailyData.sales.map((sale, idx) => ({
//     date: sale._id,
//     Sales: sale.total || 0,
//     Purchases: dailyData.purchases[idx]?.total || 0,
//     Expenses: dailyData.expenses[idx]?.total || 0,
//   }));

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <h1 className="text-2xl font-bold text-gray-800">📊 Profit & Loss Report - Current Month</h1>

//       {/* Date Picker Section */}
//       <div className="p-4 bg-white shadow rounded-lg">
//         <div className="flex items-center space-x-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Start Date</label>
//             <DatePicker selected={startDate} onChange={setStartDate} className="border p-2 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">End Date</label>
//             <DatePicker selected={endDate} onChange={setEndDate} className="border p-2 rounded-md" />
//           </div>
//           <Button onClick={fetchReport} disabled={loading}>
//             {loading ? "Loading..." : "Generate Report"}
//           </Button>
//           {reportData && (
//             <Button variant="outline" onClick={downloadCSV}>
//               <Download className="w-4 h-4 mr-2" /> Download CSV
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Profit/Loss Summary */}
//       {reportData && (
//         <div className="p-4 bg-gray-50 shadow rounded-lg grid grid-cols-4 gap-4 text-center">
//           <div className="bg-green-100 p-4 rounded-lg">
//             <p className="text-gray-700">Total Sales</p>
//             <p className="text-xl font-bold text-green-700">${reportData.salesAmount}</p>
//           </div>
//           <div className="bg-blue-100 p-4 rounded-lg">
//             <p className="text-gray-700">Total Purchases</p>
//             <p className="text-xl font-bold text-blue-700">${reportData.purchaseAmount}</p>
//           </div>
//           <div className="bg-yellow-100 p-4 rounded-lg">
//             <p className="text-gray-700">Total Expenses</p>
//             <p className="text-xl font-bold text-yellow-700">${reportData.expenseAmount}</p>
//           </div>
//           <div className={`p-4 rounded-lg ${reportData.profitOrLoss >= 0 ? "bg-green-200" : "bg-red-200"}`}>
//             <p className="text-gray-700">Profit/Loss</p>
//             <p className="text-xl font-bold">
//               {reportData.profitOrLoss >= 0 ? "Profit" : "Loss"}: ${reportData.profitOrLoss}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Daily Stats Bar Chart */}
//       {chartData.length > 0 && (
//         <div className="p-4 bg-white shadow rounded-lg">
//           <h2 className="text-lg font-bold mb-4">Daily Sales, Purchases & Expenses</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData}>
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="Sales" fill="#4CAF50" />
//               <Bar dataKey="Purchases" fill="#2196F3" />
//               <Bar dataKey="Expenses" fill="#FF9800" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfitLossReport;



import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

const ProfitLossReport = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // 1st day of month
  const [endDate, setEndDate] = useState(new Date()); // Today
  const [reportData, setReportData] = useState(null);
  const [dailyData, setDailyData] = useState({ sales: [], purchases: [], expenses: [] });
  const [loading, setLoading] = useState(false);

  // Fetch report on load
  useEffect(() => {
    fetchReport();
  }, []);

  // Fetch Profit/Loss Data
  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/reports/profit-loss", {
        params: { startDate, endDate },
      });
      setReportData(res.data);
      fetchDailyStats();
    } catch (err) {
      console.error("Error fetching report:", err);
      alert("Error fetching report data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Daily Stats
  const fetchDailyStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/daily-stats", {
        params: { startDate, endDate },
      });
      setDailyData({
        sales: res.data.sales || [],
        purchases: res.data.purchases || [],
        expenses: res.data.expenses || [],
      });
    } catch (err) {
      console.error("Error fetching daily stats:", err);
      setDailyData({ sales: [], purchases: [], expenses: [] });
    }
  };

  // Download CSV
  const downloadCSV = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/daily-stats", {
        params: { startDate, endDate },
      });

      const { sales = [], purchases = [], expenses = [] } = res.data || {};
      let csvContent = "Munna Enterprise - Profit & Loss Report\n";
      csvContent += `From: ${startDate.toDateString()} To: ${endDate.toDateString()}\n\n`;
      csvContent += "Date, Sales, Purchases, Expenses\n";

      let totalSales = 0,
        totalPurchases = 0,
        totalExpenses = 0;

      sales.forEach((s, idx) => {
        const date = s._id;
        const sale = s.total || 0;
        const purchase = purchases[idx]?.total || 0;
        const expense = expenses[idx]?.total || 0;

        totalSales += sale;
        totalPurchases += purchase;
        totalExpenses += expense;

        csvContent += `${date}, ${sale}, ${purchase}, ${expense}\n`;
      });

      const profitLoss = totalSales - (totalPurchases + totalExpenses);
      csvContent += `\nTotal, ${totalSales}, ${totalPurchases}, ${totalExpenses}\n`;
      csvContent += `Profit/Loss, ${profitLoss}\n`;

      // Download File
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Profit_Loss_Report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Error downloading CSV");
    }
  };

  // Chart Data (Safe Mapping)
  const chartData =
    (dailyData?.sales || []).map((sale, idx) => ({
      date: sale._id,
      Sales: sale.total || 0,
      Purchases: dailyData?.purchases?.[idx]?.total || 0,
      Expenses: dailyData?.expenses?.[idx]?.total || 0,
    })) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      
      <div className="mb-10 flex justify-between items-center">
  <div>
    <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-2">
     Profit & Loss Report - Current Month
    </h1>
    <p className="text-gray-600 mt-2">Track and manage all Profit & Loss Report.</p>
  </div>
  
</div>


      {/* Date Pickers */}
      <div className="p-4 bg-white shadow rounded-lg">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Start Date</label>
            <DatePicker selected={startDate} onChange={setStartDate} className="border p-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">End Date</label>
            <DatePicker selected={endDate} onChange={setEndDate} className="border p-2 rounded-md" />
          </div>
          <Button onClick={fetchReport} disabled={loading}>
            {loading ? "Loading..." : "Generate Report"}
          </Button>
          {reportData && (
            <Button variant="outline" onClick={downloadCSV}>
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      {reportData && (
        <div className="p-4 bg-gray-50 shadow rounded-lg grid grid-cols-4 gap-4 text-center">
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-gray-700">Total Sales</p>
            <p className="text-xl font-bold text-green-700">${reportData.salesAmount}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-gray-700">Total Purchases</p>
            <p className="text-xl font-bold text-blue-700">${reportData.purchaseAmount}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-gray-700">Total Expenses</p>
            <p className="text-xl font-bold text-yellow-700">${reportData.expenseAmount}</p>
          </div>
          <div className={`p-4 rounded-lg ${reportData.profitOrLoss >= 0 ? "bg-green-200" : "bg-red-200"}`}>
            <p className="text-gray-700">Profit/Loss</p>
            <p className="text-xl font-bold">
              {reportData.profitOrLoss >= 0 ? "Profit" : "Loss"}: ${reportData.profitOrLoss}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData && chartData.length > 0 ? (
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Daily Sales, Purchases & Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sales" fill="#4CAF50" />
              <Bar dataKey="Purchases" fill="#2196F3" />
              <Bar dataKey="Expenses" fill="#FF9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-500">No data available for this period.</p>
      )}
    </div>
  );
};

export default ProfitLossReport;
