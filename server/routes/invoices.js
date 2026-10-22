import express from "express";
import auth from "../middleware/auth.js";
import Invoice from "../models/invoice.js";

const router = express.Router();

const admin = (req, res, next) => {
  if (req.auth?.role === "ADMIN") return next();
  return res.status(403).json({ message: "Admin access required." });
};

const publicInvoice = (row) => {
  const value = row.toObject ? row.toObject() : row;
  return value;
};

router.get("/", auth, admin, async (_req, res) => {
  try {
    const rows = await Invoice.find().sort({ issueDate: -1, createdAt: -1 });
    res.json(rows.map(publicInvoice));
  } catch (error) {
    console.error("Invoice list error:", error);
    res.status(500).json({ message: "Unable to load invoices." });
  }
});

router.post("/migrate", auth, admin, async (req, res) => {
  let created = 0;
  let skipped = 0;
  const errors = [];

  const rows = Array.isArray(req.body?.invoices) ? req.body.invoices.slice(0, 1000) : [];

  for (const invoice of rows) {
    if (!invoice?.id || !invoice?.invoiceNumber || !invoice?.clientId) {
      skipped++;
      continue;
    }

    try {
      const exists = await Invoice.findOne({
        $or: [{ id: String(invoice.id) }, { invoiceNumber: String(invoice.invoiceNumber) }],
      });

      if (exists) {
        skipped++;
        continue;
      }

      await Invoice.create({
        id: String(invoice.id),
        invoiceNumber: String(invoice.invoiceNumber),
        clientId: String(invoice.clientId),
        shootId: invoice.shootId || null,
        issueDate: String(invoice.issueDate || new Date().toISOString().slice(0, 10)),
        dueDate: String(invoice.dueDate || new Date().toISOString().slice(0, 10)),
        items: Array.isArray(invoice.items) ? invoice.items : [],
        subtotal: Number(invoice.subtotal) || 0,
        taxRate: Number(invoice.taxRate) || 0,
        taxAmount: Number(invoice.taxAmount) || 0,
        discount: Number(invoice.discount) || 0,
        totalAmount: Number(invoice.totalAmount) || 0,
        paidAmount: Number(invoice.paidAmount) || 0,
        status: ["Paid", "Partial", "Unpaid"].includes(invoice.status) ? invoice.status : "Unpaid",
        paymentMethod: String(invoice.paymentMethod || ""),
        notes: String(invoice.notes || ""),
      });
      created++;
    } catch (error) {
      errors.push({
        invoiceNumber: String(invoice.invoiceNumber || ""),
        message: error.message,
      });
    }
  }

  res.json({ created, skipped, errors });
});

router.post("/", auth, admin, async (req, res) => {
  try {
    const x = req.body || {};
    if (!x.id || !x.invoiceNumber || !x.clientId || !Array.isArray(x.items)) {
      return res.status(400).json({ message: "Invoice ID, invoice number, client, and items are required." });
    }

    const row = await Invoice.findOneAndUpdate(
      { id: String(x.id) },
      { $setOnInsert: {
        id: String(x.id),
        invoiceNumber: String(x.invoiceNumber),
        clientId: String(x.clientId),
        shootId: x.shootId || null,
        issueDate: String(x.issueDate || new Date().toISOString().slice(0, 10)),
        dueDate: String(x.dueDate || new Date().toISOString().slice(0, 10)),
        items: x.items,
        subtotal: Number(x.subtotal) || 0,
        taxRate: Number(x.taxRate) || 0,
        taxAmount: Number(x.taxAmount) || 0,
        discount: Number(x.discount) || 0,
        totalAmount: Number(x.totalAmount) || 0,
        paidAmount: Number(x.paidAmount) || 0,
        status: ["Paid", "Partial", "Unpaid"].includes(x.status) ? x.status : "Unpaid",
        paymentMethod: String(x.paymentMethod || ""),
        notes: String(x.notes || ""),
      }},
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(publicInvoice(row));
  } catch (error) {
    console.error("Invoice create error:", error);
    res.status(500).json({ message: "Unable to save invoice." });
  }
});

router.patch("/:id", auth, admin, async (req, res) => {
  try {
    const allowed = [
      "invoiceNumber", "clientId", "shootId", "issueDate", "dueDate", "items",
      "subtotal", "taxRate", "taxAmount", "discount", "totalAmount",
      "paidAmount", "status", "paymentMethod", "notes",
    ];
    const update = {};

    for (const key of allowed) {
      if (req.body?.[key] !== undefined) update[key] = req.body[key];
    }

    const row = await Invoice.findOneAndUpdate(
      { id: req.params.id },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!row) return res.status(404).json({ message: "Invoice not found." });
    res.json(publicInvoice(row));
  } catch (error) {
    console.error("Invoice update error:", error);
    res.status(500).json({ message: "Unable to update invoice." });
  }
});

router.post("/:id/payments", auth, admin, async (req, res) => {
  try {
    const amount = Number(req.body?.amount);
    const paymentMethod = String(req.body?.paymentMethod || "").trim();

    if (!Number.isFinite(amount) || amount <= 0 || !paymentMethod) {
      return res.status(400).json({ message: "A positive payment amount and payment method are required." });
    }

    const row = await Invoice.findOne({ id: req.params.id });
    if (!row) return res.status(404).json({ message: "Invoice not found." });

    row.paidAmount = Number(row.paidAmount || 0) + amount;
    row.status = row.paidAmount >= row.totalAmount ? "Paid" : "Partial";
    row.paymentMethod = paymentMethod;
    row.payments.push({ amount, paymentMethod, recordedAt: new Date() });

    await row.save();
    res.json(publicInvoice(row));
  } catch (error) {
    console.error("Payment record error:", error);
    res.status(500).json({ message: "Unable to record payment." });
  }
});

export default router;
