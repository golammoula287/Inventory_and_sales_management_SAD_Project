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



import Product from '../models/product.js';
import Sale from '../models/sales.js';
import Category from '../models/category.js';
import Supplier from '../models/supplier.js';
import Vehicle from '../models/Vehicle.js';
import Godown from '../models/Godown.js';
import Expense from '../models/expense.js';
import Purchase from '../models/purchase.js';

export const getDashboardData = async (req, res) => {
  try {
    // Run all independent queries in parallel
    const [
      totalProducts,
      totalCategories,
      totalSalesResult,
      totalSuppliers,
      totalVehicles,
      totalGodowns,
      totalStockResult,
      totalExpensesResult
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Sale.aggregate([{ $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }]),
      Supplier.countDocuments(),
      Vehicle.countDocuments(),
      Godown.countDocuments(),
      // Aggregate total stock directly from Purchase collection
      Purchase.aggregate([{ $group: { _id: null, totalStock: { $sum: "$stock" } } }]),
      Expense.aggregate([{ $group: { _id: null, totalExpenses: { $sum: "$amount" } } }])
    ]);

    const data = {
      totalProducts,
      totalCategories,
      totalSales: totalSalesResult[0]?.totalSales || 0,
      totalSuppliers,
      totalVehicles,
      totalGodowns,
      totalStock: totalStockResult[0]?.totalStock || 0,
      totalExpenses: totalExpensesResult[0]?.totalExpenses || 0
    };

    res.json(data);
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
