



import mongoose from "mongoose";
import Sale from "../models/sales.js";
import Purchase from "../models/purchase.js";
import Godown from "../models/Godown.js";
import PDFDocument from "pdfkit";

//  Add new Sale (multi-product + profit/loss calculation + godown allocation)
export const addSale = async (req, res) => {
  try {
    const { items, customerName, customerPhone, saleDate, marketName, note } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one product is required" });
    }

    let totalSaleAmount = 0;
    let totalPurchaseCost = 0;
    const processedItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: `Invalid productId: ${item.productId}` });
      }

      const productObjectId = new mongoose.Types.ObjectId(item.productId);
      let remainingQty = item.quantity;
      let allocatedGodownId = null;

      const purchases = await Purchase.find({ productId: productObjectId });

      for (const purchase of purchases) {
        for (const g of purchase.godowns) {
          const godownId = g.godownId;
          if (!mongoose.Types.ObjectId.isValid(godownId)) continue;

          const godownObjectId = new mongoose.Types.ObjectId(godownId);

          // Already sold qty from this godown
          const soldFromGodown = await Sale.aggregate([
            { $unwind: "$items" },
            { $match: { "items.godownId": godownObjectId, "items.productId": productObjectId } },
            { $group: { _id: null, totalSold: { $sum: "$items.quantity" } } },
          ]);

          const soldQty = soldFromGodown[0]?.totalSold || 0;
          const available = g.allocatedQuantity - soldQty;
          if (available <= 0) continue;

          const allocate = Math.min(available, remainingQty);
          totalPurchaseCost += allocate * purchase.unitPrice;

          // Update godown available space immediately
          await Godown.findByIdAndUpdate(godownId, { $inc: { availableSpace: -allocate } });

          allocatedGodownId = godownObjectId;
          remainingQty -= allocate;

          if (remainingQty <= 0) break;
        }
        if (remainingQty <= 0) break;
      }

      if (remainingQty > 0) {
        return res.status(400).json({ message: "Not enough stock in godowns" });
      }

      const total = item.quantity * item.unitPrice;
      totalSaleAmount += total;

      processedItems.push({
        productId: productObjectId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total,
        godownId: allocatedGodownId,
      });
    }

    const profitLoss = totalSaleAmount - totalPurchaseCost;

    const newSale = new Sale({
      items: processedItems,
      customerName,
      customerPhone,
      saleDate,
      marketName,
      note,
      totalAmount: totalSaleAmount,
      profitLoss,
    });

    await newSale.save();
    res.status(201).json({ message: "Sale added successfully", sale: newSale });
  } catch (error) {
    res.status(500).json({ message: "Error adding sale", error: error.message });
  }
};

//  Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("items.productId", "name category")
      .populate("items.godownId", "location capacity availableSpace");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error: error.message });
  }
};

// 🟢Get single sale
export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.sale_id)
      .populate("items.productId", "name category")
      .populate("items.godownId", "location");

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale", error: error.message });
  }
};

// Update sale (rollback godown first)
export const updateSale = async (req, res) => {
  try {
    const existingSale = await Sale.findById(req.params.sale_id);
    if (!existingSale) return res.status(404).json({ message: "Sale not found" });

    // Rollback godown quantities from old sale
    for (const item of existingSale.items) {
      if (mongoose.Types.ObjectId.isValid(item.godownId)) {
        await Godown.findByIdAndUpdate(item.godownId, { $inc: { availableSpace: item.quantity } });
      }
    }

    // Delete old sale and create new
    await Sale.findByIdAndDelete(existingSale._id);
    return addSale(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error updating sale", error: error.message });
  }
};

//  Delete sale (rollback godown)
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.sale_id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Rollback godown stock
    for (const item of sale.items) {
      if (mongoose.Types.ObjectId.isValid(item.godownId)) {
        await Godown.findByIdAndUpdate(item.godownId, { $inc: { availableSpace: item.quantity } });
      }
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale", error: error.message });
  }
};

//  Download Invoice (multi-product)
export const downloadInvoice = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.sale_id)
      .populate("items.productId", "name category")
      .populate("items.godownId", "location");

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${sale._id}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Header
    doc.fontSize(26).fillColor("#001a9dff").text("Munna", { continued: true });
    doc.fillColor("#ffcf66ff").text("Traders");

    doc.moveDown();
    doc.fontSize(14).fillColor("black").text("Invoice");

    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${sale._id}`);
    doc.text(`Customer: ${sale.customerName}`);
    doc.text(`Phone: ${sale.customerPhone}`);
    doc.text(`Market: ${sale.marketName || "N/A"}`);
    doc.text(`Date: ${new Date(sale.saleDate).toLocaleDateString()}`);
    doc.moveDown();

    // Table Header
    const tableTop = 250;
    doc.fontSize(12).text("Product", 50, tableTop);
    doc.text("Qty", 200, tableTop);
    doc.text("Unit Price", 300, tableTop);
    doc.text("Total", 400, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(560, tableTop + 15).stroke();

    // Table Data
    let position = tableTop + 25;
    sale.items.forEach((item) => {
      doc.text(item.productId?.name || "N/A", 50, position);
      doc.text(item.quantity.toString(), 200, position);
      doc.text(item.unitPrice.toFixed(2), 300, position);
      doc.text(item.total.toFixed(2), 400, position);
      position += 20;
    });

    doc.moveTo(50, position).lineTo(560, position).stroke();
    doc.fontSize(12).text(`Total Amount: ${sale.totalAmount.toFixed(2)}`, 400, position + 20);

    // Signature
    doc.moveDown(4);
    doc.text("Authorized Signature", 400, doc.y + 50);
    doc.moveTo(400, doc.y + 15).lineTo(550, doc.y + 15).stroke();

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating invoice", error: error.message });
  }
};
