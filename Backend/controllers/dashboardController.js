



const mongoose = require("mongoose");
const Sale = require("../models/sales");
const Expense = require("../models/expense");
const Product = require("../models/product");
const Purchase = require("../models/purchase"); // ✅ fixed import




// // Get Dashboard KPIs
// // ---------------------
// const getDashboardData = async (req, res) => {
//   try {
//     const totalProducts = await Product.countDocuments();

//     // -------------------
//     // Total Sales Amount
//     // -------------------
//     const totalSales = await Sale.aggregate([
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } }
//     ]);
//     const totalSalesAmount = totalSales[0]?.total || 0;

//     // -------------------
//     // Total Expenses Amount
//     // -------------------
//     const totalExpenses = await Expense.aggregate([
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);
//     const totalExpensesAmount = totalExpenses[0]?.total || 0;

//     // -------------------
//     // Total Purchases Quantity
//     // -------------------
//     const totalPurchases = await Purchase.aggregate([
//       { $group: { _id: null, total: { $sum: "$quantity" } } }
//     ]);
//     const totalPurchasedQty = totalPurchases[0]?.total || 0;

//     // -------------------
//     // Total Sales Quantity
//     // -------------------
//     const totalSalesQty = await Sale.aggregate([
//       { $unwind: "$items" },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$items.quantity" }
//         }
//       }
//     ]);
//     const totalSoldQty = totalSalesQty[0]?.total || 0;

//     // -------------------
//     // Stock = Purchase Qty - Sales Qty
//     // -------------------
//     const totalStock = totalPurchasedQty - totalSoldQty;

//     // -------------------
//     // Total Purchase Cost for sold items
//     // -------------------
//     const salesWithCogs = await Sale.aggregate([
//       { $unwind: "$items" },
//       {
//         $lookup: {
//           from: "purchases",
//           let: { pid: "$items.productId", sdate: "$saleDate" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$productId", "$$pid"] },
//                     { $lte: ["$purchaseDate", "$$sdate"] }
//                   ]
//                 }
//               }
//             },
//             { $sort: { purchaseDate: -1 } },
//             { $limit: 1 },
//             { $project: { unitPrice: 1 } }
//           ],
//           as: "lastPurchase"
//         }
//       },
//       {
//         $addFields: {
//           purchaseUnitPrice: {
//             $ifNull: [{ $arrayElemAt: ["$lastPurchase.unitPrice", 0] }, 0]
//           }
//         }
//       },
//       {
//         $project: {
//           cost: {
//             $multiply: ["$items.quantity", "$purchaseUnitPrice"]
//           }
//         }
//       },
//       { $group: { _id: null, totalCost: { $sum: "$cost" } } }
//     ]);

//     const totalPurchaseCost = salesWithCogs[0]?.totalCost || 0;

//     // -------------------
//     // Profit = Sales − (PurchaseCost + Expenses)
//     // -------------------
//     const totalProfit = totalSalesAmount - (totalPurchaseCost + totalExpensesAmount);
//     const totalLoss = totalProfit < 0 ? Math.abs(totalProfit) : 0;

//     res.status(200).json({
//       totalProducts,
//       totalSales: totalSalesAmount,
//       totalExpenses: totalExpensesAmount,
//       totalStock,
//       totalProfit,
//       totalLoss,
//     });
//   } catch (error) {
//     console.error("Dashboard Error:", error.message);
//     res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
//   }
// };

// module.exports = { getDashboardData };






// Get Dashboard KPIs
// ---------------------
const getDashboardData = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    // -------------------
    // Total Sales Amount
    // -------------------
    const totalSales = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalSalesAmount = totalSales[0]?.total || 0;

    // -------------------
    // Total Expenses Amount
    // -------------------
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpensesAmount = totalExpenses[0]?.total || 0;

    // -------------------
    // Total Purchases Quantity & Amount
    // -------------------
    const totalPurchases = await Purchase.aggregate([
      { $group: { _id: null, totalQty: { $sum: "$quantity" }, totalAmt: { $sum: "$totalAmount" } } }
    ]);
    const totalPurchasedQty = totalPurchases[0]?.totalQty || 0;
    const totalPurchasedAmount = totalPurchases[0]?.totalAmt || 0;

    // -------------------
    // Total Sales Quantity
    // -------------------
    const totalSalesQty = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          total: { $sum: "$items.quantity" }
        }
      }
    ]);
    const totalSoldQty = totalSalesQty[0]?.total || 0;

    // -------------------
    // Stock = Purchase Qty - Sales Qty
    // -------------------
    const totalStock = totalPurchasedQty - totalSoldQty;

    // -------------------
    // Total Purchase Cost for sold items
    // -------------------
    const salesWithCogs = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "purchases",
          let: { pid: "$items.productId", sdate: "$saleDate" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", "$$pid"] },
                    { $lte: ["$purchaseDate", "$$sdate"] }
                  ]
                }
              }
            },
            { $sort: { purchaseDate: -1 } },
            { $limit: 1 },
            { $project: { unitPrice: 1 } }
          ],
          as: "lastPurchase"
        }
      },
      {
        $addFields: {
          purchaseUnitPrice: {
            $ifNull: [{ $arrayElemAt: ["$lastPurchase.unitPrice", 0] }, 0]
          }
        }
      },
      {
        $project: {
          cost: {
            $multiply: ["$items.quantity", "$purchaseUnitPrice"]
          }
        }
      },
      { $group: { _id: null, totalCost: { $sum: "$cost" } } }
    ]);

    const totalPurchaseCost = salesWithCogs[0]?.totalCost || 0;

    // -------------------
    // Profit = Sales − (PurchaseCost + Expenses)
    // -------------------
    const totalProfit = totalSalesAmount - (totalPurchaseCost + totalExpensesAmount);
    const totalLoss = totalProfit < 0 ? Math.abs(totalProfit) : 0;

    // -------------------
    // Final Response
    // -------------------
    res.status(200).json({
      totalProducts,
      totalSales: totalSalesAmount,
      totalPurchaseAmount: totalPurchasedAmount, // ✅ Added
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

module.exports = { getDashboardData };

// ---------------------------------------------
// Get Monthly Sales, Expenses, Profit/Loss (12M)
// ---------------------------------------------
// const getMonthlyDataForYear = async (req, res) => {
//   try {
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setFullYear(endDate.getFullYear() - 1);

//     // Sales monthly
//     const salesData = await Sale.aggregate([
//       { $match: { saleDate: { $gte: startDate, $lte: endDate } } },
//       {
//         $project: {
//           month: { $month: "$saleDate" },
//           year: { $year: "$saleDate" },
//           totalAmount: 1,
//         },
//       },
//       {
//         $group: {
//           _id: { month: "$month", year: "$year" },
//           total: { $sum: "$totalAmount" },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//     ]);

//     // Expenses monthly
//     const expenseData = await Expense.aggregate([
//       { $match: { date: { $gte: startDate, $lte: endDate } } },
//       {
//         $project: {
//           month: { $month: "$date" },
//           year: { $year: "$date" },
//           amount: 1,
//         },
//       },
//       {
//         $group: {
//           _id: { month: "$month", year: "$year" },
//           total: { $sum: "$amount" },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//     ]);

//     // Format into 12 months array
//     const formattedSalesData = Array(12)
//       .fill(0)
//       .map((_, index) => {
//         const match = salesData.find((s) => s._id.month === index + 1);
//         return match ? match.total : 0;
//       });

//     const formattedExpenseData = Array(12)
//       .fill(0)
//       .map((_, index) => {
//         const match = expenseData.find((e) => e._id.month === index + 1);
//         return match ? match.total : 0;
//       });

//     const profitLossData = formattedSalesData.map(
//       (s, i) => s - formattedExpenseData[i]
//     );

//     res.status(200).json({
//       salesData: formattedSalesData,
//       expenseData: formattedExpenseData,
//       profitLossData,
//     });
//   } catch (error) {
//     console.error("Monthly Data Error:", error.message);
//     res
//       .status(500)
//       .json({ message: "Error fetching monthly data", error: error.message });
//   }
// };




const getMonthlyDataForYear = async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    // ------------------------
    // Monthly Sales Amount
    // ------------------------
    const salesData = await Sale.aggregate([
      { $match: { saleDate: { $gte: startDate, $lte: endDate } } },
      {
        $project: {
          month: { $month: "$saleDate" },
          year: { $year: "$saleDate" },
          totalAmount: 1
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // ------------------------
    // Monthly Expenses Amount
    // ------------------------
    const expenseData = await Expense.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $project: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          amount: 1
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // ------------------------
    // Monthly Purchase Cost for Sold Items
    // ------------------------
    const purchaseCostData = await Sale.aggregate([
      { $match: { saleDate: { $gte: startDate, $lte: endDate } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "purchases",
          let: { pid: "$items.productId", sdate: "$saleDate" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", "$$pid"] },
                    { $lte: ["$purchaseDate", "$$sdate"] }
                  ]
                }
              }
            },
            { $sort: { purchaseDate: -1 } },
            { $limit: 1 },
            { $project: { unitPrice: 1 } }
          ],
          as: "lastPurchase"
        }
      },
      {
        $addFields: {
          purchaseUnitPrice: {
            $ifNull: [{ $arrayElemAt: ["$lastPurchase.unitPrice", 0] }, 0]
          },
          month: { $month: "$saleDate" },
          year: { $year: "$saleDate" }
        }
      },
      {
        $project: {
          month: 1,
          year: 1,
          cost: { $multiply: ["$items.quantity", "$purchaseUnitPrice"] }
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalCost: { $sum: "$cost" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // ------------------------
    // Convert to 12-month arrays
    // ------------------------
    const formattedSalesData = Array(12).fill(0).map((_, i) => {
      const m = salesData.find(d => d._id.month === i + 1);
      return m ? m.total : 0;
    });

    const formattedExpenseData = Array(12).fill(0).map((_, i) => {
      const m = expenseData.find(d => d._id.month === i + 1);
      return m ? m.total : 0;
    });

    const formattedPurchaseCost = Array(12).fill(0).map((_, i) => {
      const m = purchaseCostData.find(d => d._id.month === i + 1);
      return m ? m.totalCost : 0;
    });

    // ------------------------
    // Profit = Sales − (PurchaseCost + Expenses)
    // ------------------------
    const profitLossData = formattedSalesData.map((sales, i) =>
      sales - (formattedPurchaseCost[i] + formattedExpenseData[i])
    );

    // Send response
    res.status(200).json({
      salesData: formattedSalesData,
      expenseData: formattedExpenseData,
      purchaseCost: formattedPurchaseCost,
      profitLossData
    });

  } catch (error) {
    console.error("Monthly Data Error:", error.message);
    res.status(500).json({ message: "Error fetching monthly data", error: error.message });
  }
};


// ------------------------------------
// Profit/Loss Report for Date Range
// ------------------------------------
const getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start and End dates are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    // Sales
    const sales = await Sale.find({
      saleDate: { $gte: start, $lte: end },
    }).lean();

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
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};

module.exports = {
  getDashboardData,
  getMonthlyDataForYear,
  getProfitLossReport,
};
