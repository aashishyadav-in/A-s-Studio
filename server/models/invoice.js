import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0.01 },
  paymentMethod: { type: String, required: true },
  recordedAt: { type: Date, default: Date.now },
}, { versionKey: false });

const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  invoiceNumber: { type: String, required: true, index: true },
  clientId: { type: String, required: true, index: true },
  shootId: { type: String, default: null },
  issueDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  items: { type: [invoiceItemSchema], default: [] },
  subtotal: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0, min: 0 },
  taxAmount: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["Paid", "Partial", "Unpaid"], default: "Unpaid" },
  paymentMethod: { type: String, default: "" },
  payments: { type: [paymentSchema], default: [] },
  notes: { type: String, default: "" },
}, { timestamps: true, versionKey: false, collection: "invoices" });

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);
