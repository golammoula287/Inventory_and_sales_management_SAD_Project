

// import Sale from "../models/sales.js";
// import Purchase from "../models/purchase.js";
// import Expense from "../models/expense.js";
// import { Parser } from "json2csv";

// // 📊 Profit/Loss Report (with optional CSV Download)
// export const getProfitLossReport = async (req, res) => {
//   try {
//     const { startDate, endDate, download } = req.query;

//     if (!startDate || !endDate) {
//       return res.status(400).json({ message: "Start and End dates are required" });
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     end.setHours(23, 59, 59);

//     // --- Total Sales ---
//     const sales = await Sale.aggregate([
//       { $match: { saleDate: { $gte: start, $lte: end } } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//     ]);

//     // --- Total Purchases ---
//     const purchases = await Purchase.aggregate([
//       { $match: { purchaseDate: { $gte: start, $lte: end } } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//     ]);

//     // --- Total Expenses ---
//     const expenses = await Expense.aggregate([
//       { $match: { date: { $gte: start, $lte: end } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // --- Closing Stock (Unsold Inventory) ---
//     const closingStock = await Purchase.aggregate([
//       { $unwind: "$godowns" },
//       {
//         $lookup: {
//           from: "sales",
//           localField: "godowns.godownId",
//           foreignField: "godowns.godownId",
//           as: "salesData",
//         },
//       },
//       {
//         $project: {
//           productId: 1,
//           purchasePrice: "$unitPrice",
//           allocatedQty: "$godowns.allocatedQuantity",
//           soldQty: {
//             $sum: {
//               $map: {
//                 input: "$salesData",
//                 as: "sale",
//                 in: {
//                   $sum: {
//                     $map: {
//                       input: "$$sale.godowns",
//                       as: "sg",
//                       in: { $cond: [{ $eq: ["$$sg.godownId", "$godowns.godownId"] }, "$$sg.soldQuantity", 0] }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         },
//       },
//       {
//         $project: {
//           remainingQty: { $subtract: ["$allocatedQty", "$soldQty"] },
//           purchasePrice: 1,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalValue: { $sum: { $multiply: ["$remainingQty", "$purchasePrice"] } },
//         },
//       },
//     ]);

//     // --- Values ---
//     const salesAmount = sales[0]?.total || 0;
//     const purchaseAmount = purchases[0]?.total || 0;
//     const expenseAmount = expenses[0]?.total || 0;
//     const closingStockValue = closingStock[0]?.totalValue || 0;

//     // --- COGS & Profit/Loss ---
//     const COGS = purchaseAmount - closingStockValue;
//     const profitOrLoss = salesAmount - (COGS + expenseAmount);

//     // --- CSV Download ---
//     if (download === "csv") {
//       const fields = ["Sales", "Purchases", "Expenses", "Closing Stock", "COGS", "Profit/Loss"];
//       const data = [
//         {
//           Sales: salesAmount,
//           Purchases: purchaseAmount,
//           Expenses: expenseAmount,
//           "Closing Stock": closingStockValue,
//           COGS: COGS,
//           "Profit/Loss": profitOrLoss,
//         },
//       ];

//       const json2csv = new Parser({ fields });
//       const csv = json2csv.parse(data);

//       res.header("Content-Type", "text/csv");
//       res.attachment(`Profit_Loss_Report_${startDate}_to_${endDate}.csv`);
//       return res.send(csv);
//     }

//     // --- JSON Response ---
//     res.json({
//       salesAmount,
//       purchaseAmount,
//       expenseAmount,
//       closingStockValue,
//       COGS,
//       profitOrLoss,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error generating report", error: err.message });
//   }
// };

// // 📈 Daily Sales, Purchases, and Expenses for Graphs
// export const getDailyReportData = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     if (!startDate || !endDate) {
//       return res.status(400).json({ message: "Start and End dates are required" });
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     end.setHours(23, 59, 59);

//     // --- Sales per Day ---
//     const sales = await Sale.aggregate([
//       { $match: { saleDate: { $gte: start, $lte: end } } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
//           total: { $sum: "$totalAmount" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     // --- Purchases per Day ---
//     const purchases = await Purchase.aggregate([
//       { $match: { purchaseDate: { $gte: start, $lte: end } } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
//           total: { $sum: "$totalAmount" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     // --- Expenses per Day ---
//     const expenses = await Expense.aggregate([
//       { $match: { date: { $gte: start, $lte: end } } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//           total: { $sum: "$amount" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     res.json({ sales, purchases, expenses });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching daily data", error: err.message });
//   }
// };


import Sale from "../models/sales.js";
import Purchase from "../models/purchase.js";
import Expense from "../models/expense.js";
import { Parser } from "json2csv";

// 📊 Profit/Loss Report (with optional CSV Download)
export const getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate, download } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and End dates are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    // --- Total Sales ---
    const sales = await Sale.aggregate([
      { $match: { saleDate: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // --- Total Purchases ---
    const purchases = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // --- Total Expenses ---
    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // --- Closing Stock (Unsold Inventory) ---
    const closingStock = await Purchase.aggregate([
      { $unwind: "$godowns" },
      {
        $lookup: {
          from: "sales",
          localField: "godowns.godownId",
          foreignField: "godowns.godownId",
          as: "salesData",
        },
      },
      {
        $project: {
          productId: 1,
          purchasePrice: "$unitPrice",
          allocatedQty: "$godowns.allocatedQuantity",
          soldQty: {
            $sum: {
              $map: {
                input: "$salesData",
                as: "sale",
                in: {
                  $sum: {
                    $map: {
                      input: "$$sale.godowns",
                      as: "sg",
                      in: { $cond: [{ $eq: ["$$sg.godownId", "$godowns.godownId"] }, "$$sg.soldQuantity", 0] }
                    }
                  }
                }
              }
            }
          }
        },
      },
      {
        $project: {
          remainingQty: { $subtract: ["$allocatedQty", "$soldQty"] },
          purchasePrice: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$remainingQty", "$purchasePrice"] } },
        },
      },
    ]);

    // --- Values ---
    const salesAmount = sales[0]?.total || 0;
    const purchaseAmount = purchases[0]?.total || 0;
    const expenseAmount = expenses[0]?.total || 0;
    const closingStockValue = closingStock[0]?.totalValue || 0;

    // --- COGS & Profit/Loss ---
    const COGS = purchaseAmount - closingStockValue;
    const profitOrLoss = salesAmount - (COGS + expenseAmount);

    // --- CSV Download ---
    if (download === "csv") {
      const fields = ["Sales", "Purchases", "Expenses", "Closing Stock", "COGS", "Profit/Loss"];
      const data = [
        {
          Sales: salesAmount,
          Purchases: purchaseAmount,
          Expenses: expenseAmount,
          "Closing Stock": closingStockValue,
          COGS: COGS,
          "Profit/Loss": profitOrLoss,
        },
      ];

      const json2csv = new Parser({ fields });
      const csv = json2csv.parse(data);

      res.header("Content-Type", "text/csv");
      res.attachment(`Profit_Loss_Report_${startDate}_to_${endDate}.csv`);
      return res.send(csv);
    }

    // --- JSON Response ---
    res.json({
      salesAmount,
      purchaseAmount,
      expenseAmount,
      closingStockValue,
      COGS,
      profitOrLoss,
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating report", error: err.message });
  }
};

// 📈 Daily Sales, Purchases, and Expenses for Graphs
export const getDailyReportData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and End dates are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    // --- Sales per Day ---
    const sales = await Sale.aggregate([
      { $match: { saleDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Purchases per Day ---
    const purchases = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Expenses per Day ---
    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ sales, purchases, expenses });
  } catch (err) {
    res.status(500).json({ message: "Error fetching daily data", error: err.message });
  }
};
