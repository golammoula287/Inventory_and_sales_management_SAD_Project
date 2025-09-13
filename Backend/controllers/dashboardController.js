// import Product from '../models/product.js';
// import Sale from '../models/sales.js';
// import Category from '../models/category.js';
// import Supplier from '../models/supplier.js';
// import Vehicle from '../models/Vehicle.js';
// import Godown from '../models/Godown.js';
// import Expense from '../models/expense.js';

// export const getDashboardData = async (req, res) => {
//   try {
//     // Run all independent queries in parallel for better performance
//     const [
//       totalProducts,
//       totalCategories,
//       totalSalesResult,
//       totalSuppliers,
//       totalVehicles,
//       totalGodowns,
//       stockData,
//       totalExpensesResult
//     ] = await Promise.all([
//       Product.countDocuments(),
//       Category.countDocuments(),
//       Sale.aggregate([{ $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }]),
//       Supplier.countDocuments(),
//       Vehicle.countDocuments(),
//       Godown.countDocuments(),
//       Product.aggregate([
//         { 
//           $lookup: { 
//             from: "purchases", 
//             localField: "_id", 
//             foreignField: "productId", 
//             as: "purchases" 
//           } 
//         },
//         { $unwind: { path: "$purchases", preserveNullAndEmptyArrays: true } },
//         { $group: { _id: "$_id", totalStock: { $sum: "$purchases.stock" } } }
//       ]),
//       Expense.aggregate([{ $group: { _id: null, totalExpenses: { $sum: "$amount" } } }])
//     ]);

//     // Prepare final dashboard data
//     const data = {
//       totalProducts,
//       totalCategories,
//       totalSales: totalSalesResult[0]?.totalSales || 0,
//       totalSuppliers,
//       totalVehicles,
//       totalGodowns,
//       totalStock: stockData.reduce((acc, product) => acc + (product.totalStock || 0), 0),
//       totalExpenses: totalExpensesResult[0]?.totalExpenses || 0
//     };

//     res.json(data);
//   } catch (err) {
//     console.error("Dashboard Error:", err);
//     res.status(500).json({ message: 'Error fetching dashboard data' });
//   }
// };



import mongoose from "mongoose";
import Sale from "../models/sales.js";
import Expense from "../models/expense.js";
import Product from "../models/product.js";
import Purchase from "../models/purchase.js";

// ---------------------
// Get Dashboard KPIs
// ---------------------
export const getDashboardData = async (req, res) => {
  try {
    // Total products
    const totalProducts = await Product.countDocuments();

    // Total sales
    const totalSales = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalSalesAmount = totalSales[0]?.total || 0;

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpensesAmount = totalExpenses[0]?.total || 0;

    // Total purchases (stock in)
    const totalPurchases = await Purchase.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    const totalStock = totalPurchases[0]?.total || 0;

    // Profit / Loss
    const totalProfit = totalSalesAmount - totalExpensesAmount;
    const totalLoss =
      totalExpensesAmount > totalSalesAmount
        ? totalExpensesAmount - totalSalesAmount
        : 0;

    res.status(200).json({
      totalProducts,
      totalSales: totalSalesAmount,
      totalExpenses: totalExpensesAmount,
      totalStock,
      totalProfit,
      totalLoss,
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
};

// ---------------------------------------------
// Get Monthly Sales, Expenses, Profit/Loss (12M)
// ---------------------------------------------
export const getMonthlyDataForYear = async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    // Sales monthly
    const salesData = await Sale.aggregate([
      { $match: { saleDate: { $gte: startDate, $lte: endDate } } },
      {
        $project: {
          month: { $month: "$saleDate" },
          year: { $year: "$saleDate" },
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Expenses monthly
    const expenseData = await Expense.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $project: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          amount: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format into 12 months array
    const formattedSalesData = Array(12)
      .fill(0)
      .map((_, index) => {
        const match = salesData.find((s) => s._id.month === index + 1);
        return match ? match.total : 0;
      });

    const formattedExpenseData = Array(12)
      .fill(0)
      .map((_, index) => {
        const match = expenseData.find((e) => e._id.month === index + 1);
        return match ? match.total : 0;
      });

    const profitLossData = formattedSalesData.map((s, i) => s - formattedExpenseData[i]);

    res.status(200).json({
      salesData: formattedSalesData,
      expenseData: formattedExpenseData,
      profitLossData,
    });
  } catch (error) {
    console.error("Monthly Data Error:", error.message);
    res.status(500).json({ message: "Error fetching monthly data", error: error.message });
  }
};

// ------------------------------------
// Profit/Loss Report for Date Range
// ------------------------------------
export const getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and End dates are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    // Sales
    const sales = await Sale.find({ saleDate: { $gte: start, $lte: end } }).lean();

    let salesAmount = 0;
    let totalProfitFromSales = 0;

    for (const sale of sales) {
      salesAmount += sale.totalAmount;

      for (const item of sale.items) {
        const purchase = await Purchase.findOne({ productId: item.productId })
          .sort({ purchaseDate: 1 })
          .lean();

        const purchaseUnitPrice = purchase ? purchase.unitPrice : 0;
        const profit = (item.unitPrice - purchaseUnitPrice) * item.quantity;
        totalProfitFromSales += profit;
      }
    }

    // Purchases
    const purchases = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const purchaseAmount = purchases[0]?.total || 0;

    // Expenses
    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expenseAmount = expenses[0]?.total || 0;

    // Final
    const profitOrLoss = totalProfitFromSales - expenseAmount;

    res.json({
      salesAmount,
      purchaseAmount,
      totalProfitFromSales,
      expenseAmount,
      profitOrLoss,
    });
  } catch (error) {
    console.error("Profit/Loss Error:", error.message);
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};
