



// import mongoose from "mongoose";
// import Sale from "../models/sales.js";
// import Purchase from "../models/purchase.js";
// import Godown from "../models/Godown.js";

// // ✅ Add new sale
// export const addSale = async (req, res) => {
//   try {
//     const {
//       productId,
//       customerName,
//       customerPhone,
//       quantity,
//       unitPrice,
//       totalAmount,
//       saleDate,
//       marketName,
//       note,
//       godowns,
//     } = req.body;

//     if (!productId || !customerName || !customerPhone || !quantity || !unitPrice || !totalAmount || !saleDate) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (!Array.isArray(godowns) || godowns.length === 0) {
//       return res.status(400).json({ message: "Godown allocation is required" });
//     }

//     const totalAllocated = godowns.reduce((sum, g) => sum + (g.soldQuantity || 0), 0);
//     if (totalAllocated !== quantity) {
//       return res.status(400).json({ message: "Sold quantities must match total sale quantity" });
//     }

//     // Check stock in each godown
//     for (const g of godowns) {
//       if (!mongoose.Types.ObjectId.isValid(g.godownId)) {
//         return res.status(400).json({ message: `Invalid godownId: ${g.godownId}` });
//       }

//       const purchase = await Purchase.findOne({ productId, "godowns.godownId": g.godownId });
//       if (!purchase) {
//         return res.status(404).json({ message: `Purchase not found for godown: ${g.godownId}` });
//       }

//       const godownStock = purchase.stock;
//       if (g.soldQuantity > godownStock) {
//         return res.status(400).json({ message: `Not enough stock in godown ${g.godownId}` });
//       }
//     }

//     const newSale = new Sale({
//       productId,
//       customerName,
//       customerPhone,
//       quantity,
//       unitPrice,
//       totalAmount,
//       saleDate,
//       marketName,
//       note,
//       godowns,
//     });

//     await newSale.save();

//     // Update stock in purchases and godowns
//     for (const g of godowns) {
//       const purchase = await Purchase.findOne({ productId, "godowns.godownId": g.godownId });
//       purchase.stock -= g.soldQuantity;
//       if (purchase.stock < 0) purchase.stock = 0;
//       await purchase.save();

//       await Godown.findByIdAndUpdate(g.godownId, {
//         $inc: { availableSpace: g.soldQuantity },
//       });
//     }

//     res.status(201).json({ message: "Sale recorded successfully", sale: newSale });
//   } catch (error) {
//     console.error("Add Sale Error:", error);
//     res.status(500).json({ message: "Error adding sale", error: error.message });
//   }
// };

// // ✅ Get all sales
// export const getSales = async (req, res) => {
//   try {
//     const sales = await Sale.find()
//       .populate("productId", "name")
//       .populate("godowns.godownId", "godownId location capacity availableSpace");
//     res.status(200).json(sales);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching sales", error: error.message });
//   }
// };

// // ✅ Get single sale
// export const getSale = async (req, res) => {
//   try {
//     const sale = await Sale.findById(req.params.sale_id)
//       .populate("productId", "name category")
//       .populate("godowns.godownId", "godownId location capacity availableSpace");

//     if (!sale) {
//       return res.status(404).json({ message: "Sale not found" });
//     }

//     res.status(200).json(sale);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching sale", error: error.message });
//   }
// };

// // ✅ Update sale
// export const updateSale = async (req, res) => {
//   try {
//     const sale = await Sale.findById(req.params.sale_id);
//     if (!sale) return res.status(404).json({ message: "Sale not found" });

//     // Rollback stock from old sale
//     for (const g of sale.godowns) {
//       const purchase = await Purchase.findOne({ productId: sale.productId, "godowns.godownId": g.godownId });
//       if (purchase) {
//         purchase.stock += g.soldQuantity;
//         await purchase.save();
//       }
//       await Godown.findByIdAndUpdate(g.godownId, {
//         $inc: { availableSpace: -g.soldQuantity },
//       });
//     }

//     // Update sale
//     const updatedSale = await Sale.findByIdAndUpdate(req.params.sale_id, req.body, { new: true })
//       .populate("productId", "name")
//       .populate("godowns.godownId", "godownId location capacity availableSpace");

//     // Apply new stock deduction
//     for (const g of updatedSale.godowns) {
//       const purchase = await Purchase.findOne({ productId: updatedSale.productId, "godowns.godownId": g.godownId });
//       if (purchase) {
//         purchase.stock -= g.soldQuantity;
//         if (purchase.stock < 0) purchase.stock = 0;
//         await purchase.save();
//       }
//       await Godown.findByIdAndUpdate(g.godownId, {
//         $inc: { availableSpace: g.soldQuantity },
//       });
//     }

//     res.status(200).json({ message: "Sale updated successfully", sale: updatedSale });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating sale", error: error.message });
//   }
// };

// // ✅ Delete sale
// export const deleteSale = async (req, res) => {
//   try {
//     const sale = await Sale.findByIdAndDelete(req.params.sale_id);
//     if (!sale) return res.status(404).json({ message: "Sale not found" });

//     // Rollback stock
//     for (const g of sale.godowns) {
//       const purchase = await Purchase.findOne({ productId: sale.productId, "godowns.godownId": g.godownId });
//       if (purchase) {
//         purchase.stock += g.soldQuantity;
//         await purchase.save();
//       }
//       await Godown.findByIdAndUpdate(g.godownId, {
//         $inc: { availableSpace: -g.soldQuantity },
//       });
//     }

//     res.status(200).json({ message: "Sale deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting sale", error: error.message });
//   }
// };


import mongoose from "mongoose";
import Sale from "../models/sales.js";
import Purchase from "../models/purchase.js";
import Godown from "../models/Godown.js";

// ✅ Add new sale
export const addSale = async (req, res) => {
  try {
    const {
      productId,
      customerName,
      customerPhone,
      quantity,
      unitPrice,
      saleDate,
      marketName,
      note,
    } = req.body;

    // Validate required fields
    if (!productId || !customerName || !customerPhone || !quantity || !unitPrice || !saleDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    const productObjectId = new mongoose.Types.ObjectId(productId);

    let remainingQty = quantity;
    const godownAllocations = [];

    // Find purchases with this product
    const purchases = await Purchase.find({ productId: productObjectId });

    for (const purchase of purchases) {
      for (const g of purchase.godowns) {
        const godownId = g.godownId;
        if (!mongoose.Types.ObjectId.isValid(godownId)) continue;

        const godownObjectId = new mongoose.Types.ObjectId(godownId);

        // Calculate already sold quantity from this godown
        const soldFromGodown = await Sale.aggregate([
          { $unwind: "$godowns" },
          {
            $match: {
              "godowns.godownId": godownObjectId,
              productId: productObjectId,
            },
          },
          { $group: { _id: null, totalSold: { $sum: "$godowns.soldQuantity" } } },
        ]);

        const soldQty = soldFromGodown[0]?.totalSold || 0;
        const available = g.allocatedQuantity - soldQty;
        if (available <= 0) continue;

        const allocate = Math.min(available, remainingQty);
        godownAllocations.push({ godownId: godownObjectId, soldQuantity: allocate });

        remainingQty -= allocate;
        if (remainingQty <= 0) break;
      }
      if (remainingQty <= 0) break;
    }

    if (remainingQty > 0) return res.status(400).json({ message: "Not enough stock in godowns" });

    const totalAmount = quantity * unitPrice;

    const newSale = new Sale({
      productId: productObjectId,
      customerName,
      customerPhone,
      quantity,
      unitPrice,
      totalAmount,
      saleDate,
      marketName,
      note,
      godowns: godownAllocations,
    });

    await newSale.save();

    // Update godown availableSpace
    for (const g of godownAllocations) {
      await Godown.findByIdAndUpdate(g.godownId, { $inc: { availableSpace: -g.soldQuantity } });
    }

    res.status(201).json({ message: "Sale added successfully", sale: newSale });
  } catch (error) {
    console.error("Add Sale Error:", error);
    res.status(500).json({ message: "Error adding sale", error: error.message });
  }
};

// ✅ Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("productId", "name")
      .populate("godowns.godownId", "godownId location capacity availableSpace");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error: error.message });
  }
};

// ✅ Get single sale
export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.sale_id)
      .populate("productId", "name category")
      .populate("godowns.godownId", "godownId location capacity availableSpace");

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale", error: error.message });
  }
};

// ✅ Update sale
export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.sale_id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Rollback previous godown allocations
    for (const g of sale.godowns) {
      if (mongoose.Types.ObjectId.isValid(g.godownId)) {
        await Godown.findByIdAndUpdate(new mongoose.Types.ObjectId(g.godownId), {
          $inc: { availableSpace: g.soldQuantity },
        });
      }
    }

    // Delete previous sale to recalc allocations
    await Sale.findByIdAndDelete(sale._id);

    // Reuse addSale logic with updated body
    return addSale(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error updating sale", error: error.message });
  }
};

// ✅ Delete sale
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.sale_id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Rollback godown availableSpace
    for (const g of sale.godowns) {
      if (mongoose.Types.ObjectId.isValid(g.godownId)) {
        await Godown.findByIdAndUpdate(new mongoose.Types.ObjectId(g.godownId), {
          $inc: { availableSpace: g.soldQuantity },
        });
      }
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale", error: error.message });
  }
};
