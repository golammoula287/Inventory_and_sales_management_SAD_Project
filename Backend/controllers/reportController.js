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

    // Total Sales
    const sales = await Sale.aggregate([
      { $match: { saleDate: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Total Purchases
    const purchases = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Total Expenses
    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const salesAmount = sales[0]?.total || 0;
    const purchaseAmount = purchases[0]?.total || 0;
    const expenseAmount = expenses[0]?.total || 0;

    const profitOrLoss = salesAmount - (purchaseAmount + expenseAmount);

    // 📥 If CSV download requested
    if (download === "csv") {
      const fields = ["Sales", "Purchases", "Expenses", "Profit/Loss"];
      const data = [
        {
          Sales: salesAmount,
          Purchases: purchaseAmount,
          Expenses: expenseAmount,
          "Profit/Loss": profitOrLoss,
        },
      ];

      const json2csv = new Parser({ fields });
      const csv = json2csv.parse(data);

      res.header("Content-Type", "text/csv");
      res.attachment(`Profit_Loss_Report_${startDate}_to_${endDate}.csv`);
      return res.send(csv);
    }

    res.json({ salesAmount, purchaseAmount, expenseAmount, profitOrLoss });
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

    // Sales per Day
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

    // Purchases per Day
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

    // Expenses per Day
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
