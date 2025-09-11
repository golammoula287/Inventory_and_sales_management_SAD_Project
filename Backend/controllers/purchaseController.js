// const Purchase = require('../models/purchase');

// const addPurchase = async (req, res) => {
//   try {
//     const { productId, supplierId, quantity, unitPrice, totalAmount, purchaseDate, storageLocation, invoiceUrl, note } = req.body;

//     const newPurchase = new Purchase({
//       productId,
//       supplierId,
//       quantity,
//       unitPrice,
//       totalAmount,
//       purchaseDate,
//       storageLocation,
//       invoiceUrl,
//       note
//     });

//     await newPurchase.save();

//     // Populate supplier and product details in response
//     const populatedPurchase = await newPurchase.populate([
//       { path: 'supplierId', select: 'name' },
//       { path: 'productId', select: 'name' }
//     ]);

//     res.status(201).json({ message: 'Purchase added successfully', purchase: populatedPurchase });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding purchase', error });
//   }
// };

// const getPurchases = async (req, res) => {
//   try {
//     const purchases = await Purchase.find()
//       .populate('supplierId', 'name')
//       .populate('productId', 'name');
//     res.status(200).json(purchases);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching purchases', error });
//   }
// };

// const getPurchase = async (req, res) => {
//   try {
//     const purchase = await Purchase.findById(req.params.purchase_id)
//       .populate('supplierId', 'name contact')
//       .populate('productId', 'name category');
//     if (!purchase) {
//       return res.status(404).json({ message: 'Purchase not found' });
//     }
//     res.status(200).json(purchase);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching purchase', error });
//   }
// };

// const updatePurchase = async (req, res) => {
//   try {
//     const purchase = await Purchase.findByIdAndUpdate(req.params.purchase_id, req.body, { new: true })
//       .populate('supplierId', 'name')
//       .populate('productId', 'name');
//     if (!purchase) {
//       return res.status(404).json({ message: 'Purchase not found' });
//     }
//     res.status(200).json({ message: 'Purchase updated successfully', purchase });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating purchase', error });
//   }
// };

// const deletePurchase = async (req, res) => {
//   try {
//     const purchase = await Purchase.findByIdAndDelete(req.params.purchase_id);
//     if (!purchase) {
//       return res.status(404).json({ message: 'Purchase not found' });
//     }
//     res.status(200).json({ message: 'Purchase deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting purchase', error });
//   }
// };

// module.exports = { addPurchase, getPurchases, getPurchase, updatePurchase, deletePurchase };


import mongoose from "mongoose";
import Purchase from "../models/purchase.js";
import Godown from "../models/Godown.js";

// ✅ Add new purchase
export const addPurchase = async (req, res) => {
  try {
    const {
      productId,
      supplierId,
      quantity,
      unitPrice,
      totalAmount,
      purchaseDate,
      godowns,
      invoiceUrl,
      note,
    } = req.body;

    // 🔹 Validate required fields
    if (!productId || !supplierId || !quantity || !unitPrice || !totalAmount || !purchaseDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔹 Validate IDs
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: "Invalid supplierId" });
    }

    // 🔹 Validate godowns
    if (!Array.isArray(godowns) || godowns.length === 0) {
      return res.status(400).json({ message: "Godown allocation is required" });
    }

    // 🔹 Validate allocated quantities = total purchase quantity
    const totalAllocated = godowns.reduce((sum, g) => sum + (g.allocatedQuantity || 0), 0);
    if (totalAllocated !== quantity) {
      return res.status(400).json({ message: "Allocated quantities must match total purchase quantity" });
    }

    // 🔹 Validate godown capacity
    for (const g of godowns) {
      if (!mongoose.Types.ObjectId.isValid(g.godownId)) {
        return res.status(400).json({ message: `Invalid godownId: ${g.godownId}` });
      }

      const godown = await Godown.findById(g.godownId);
      if (!godown) {
        return res.status(404).json({ message: `Godown not found: ${g.godownId}` });
      }
      if (godown.availableSpace < g.allocatedQuantity) {
        return res.status(400).json({
          message: `Godown ${godown.godownId} does not have enough available space`,
        });
      }
    }

    // 🔹 Save purchase with stock = quantity
    const newPurchase = new Purchase({
      productId,
      supplierId,
      quantity,
      stock: quantity, // ✅ stock initially equals quantity
      unitPrice,
      totalAmount,
      purchaseDate,
      godowns,
      invoiceUrl,
      note,
    });

    await newPurchase.save();

    // 🔹 Update godown available space
    for (const g of godowns) {
      await Godown.findByIdAndUpdate(g.godownId, {
        $inc: { availableSpace: -g.allocatedQuantity },
      });
    }

    const populatedPurchase = await newPurchase.populate([
      { path: "supplierId", select: "name" },
      { path: "productId", select: "name" },
      { path: "godowns.godownId", select: "godownId location capacity availableSpace" },
    ]);

    res.status(201).json({
      message: "Purchase added successfully",
      purchase: populatedPurchase,
    });
  } catch (error) {
    console.error("Add Purchase Error:", error);
    res.status(500).json({ message: "Error adding purchase", error: error.message });
  }
};

// ✅ Get all purchases
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplierId", "name")
      .populate("productId", "name")
      .populate("godowns.godownId", "godownId location capacity availableSpace");

    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchases", error: error.message });
  }
};

// ✅ Get single purchase
export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.purchase_id)
      .populate("supplierId", "name contact")
      .populate("productId", "name category")
      .populate("godowns.godownId", "godownId location capacity availableSpace");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchase", error: error.message });
  }
};

// ✅ Update purchase (rollback logic if godowns change)
export const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.purchase_id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // ⚠️ Rollback previous godown allocations if godowns updated
    if (req.body.godowns) {
      for (const g of purchase.godowns) {
        await Godown.findByIdAndUpdate(g.godownId, {
          $inc: { availableSpace: g.allocatedQuantity },
        });
      }
    }

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.purchase_id,
      { ...req.body, stock: purchase.stock }, // keep stock unchanged
      { new: true }
    )
      .populate("supplierId", "name")
      .populate("productId", "name")
      .populate("godowns.godownId", "godownId location capacity availableSpace");

    // Apply new allocations
    if (req.body.godowns) {
      for (const g of req.body.godowns) {
        await Godown.findByIdAndUpdate(g.godownId, {
          $inc: { availableSpace: -g.allocatedQuantity },
        });
      }
    }

    res.status(200).json({
      message: "Purchase updated successfully",
      purchase: updatedPurchase,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating purchase", error: error.message });
  }
};

// ✅ Delete purchase (restore godown available space)
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.purchase_id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Rollback godown available space
    for (const g of purchase.godowns) {
      await Godown.findByIdAndUpdate(g.godownId, {
        $inc: { availableSpace: g.allocatedQuantity },
      });
    }

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting purchase", error: error.message });
  }
};
