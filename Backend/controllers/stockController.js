// import mongoose from "mongoose";
// import Purchase from "../models/purchase.js";
// import Sale from "../models/sales.js";
// import Product from "../models/product.js";

// //  Get Stock by Category
// export const getStockByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     // Fetch products (filtered by category if provided)
//     const query = categoryId ? { category: categoryId } : {};
//     const products = await Product.find(query).populate("category", "name");

//     const stockData = [];

//     for (const p of products) {
//       //  total purchased (sum of all godown allocations for this product)
//       const purchases = await Purchase.find({ productId: p._id });
//       const totalPurchased = purchases.reduce(
//         (sum, pur) =>
//           sum +
//           pur.godowns.reduce(
//             (gsum, g) => gsum + (g.allocatedQuantity || 0),
//             0
//           ),
//         0
//       );

//       //  total sold (sum of sale items for this product)
//       const sales = await Sale.find({ "items.productId": p._id });
//       const totalSold = sales.reduce(
//         (sum, s) =>
//           sum +
//           s.items
//             .filter((it) => it.productId.toString() === p._id.toString())
//             .reduce((isum, it) => isum + (it.quantity || 0), 0),
//         0
//       );

//       //  available stock
//       const availableStock = totalPurchased - totalSold;

//       stockData.push({
//         productId: p._id,
//         productName: p.name,
//         categoryName: p.category?.name || "—",
//         purchased: totalPurchased,
//         sold: totalSold,
//         available: availableStock < 0 ? 0 : availableStock, // no negative stock
//       });
//     }

//     res.json(stockData);
//   } catch (err) {
//     console.error(" Stock fetch error:", err.message);
//     res
//       .status(500)
//       .json({ message: "Error fetching stock", error: err.message });
//   }
// };


import mongoose from "mongoose";
import Purchase from "../models/purchase.js";
import Sale from "../models/sales.js";
import Product from "../models/product.js";
import Godown from "../models/Godown.js";

export const getStockByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    let query = {};
    if (categoryId && categoryId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      query = { category: categoryId };
    }

    const products = await Product.find(query).populate("category", "name");

    const stockData = await Promise.all(
      products.map(async (p) => {
        // Purchases for this product
        const purchases = await Purchase.find({ productId: p._id });

        let totalPurchased = 0;
        const godowns = [];

        for (const pur of purchases) {
          for (const g of pur.godowns) {
            const godown = await Godown.findById(g.godownId);
            if (godown) {
              godowns.push({
                godownId: godown.godownId,
                location: godown.location,
                availableSpace: godown.availableSpace,
              });
              totalPurchased += g.allocatedQuantity || 0;
            }
          }
        }

        // Total sold
        const sales = await Sale.find({ "items.productId": p._id });
        const totalSold = sales.reduce(
          (sum, s) =>
            sum +
            s.items
              .filter((it) => it.productId.toString() === p._id.toString())
              .reduce((isum, it) => isum + (it.quantity || 0), 0),
          0
        );

        const availableStock = Math.max(totalPurchased - totalSold, 0);

        return {
          productId: p._id,
          productName: p.name,
          categoryName: p.category?.name || "—",
          purchased: totalPurchased,
          sold: totalSold,
          available: availableStock,
          godowns, // ✅ Add Godown info here
        };
      })
    );

    res.json(stockData);
  } catch (err) {
    console.error("Stock fetch error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching stock", error: err.message });
  }
};
