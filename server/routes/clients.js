import express from "express";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.js";
import Client from "../models/client.js";
import Shoot from "../models/shoot.js";
import Photo from "../models/photo.js";
import User from "../models/user.js";

const router = express.Router();
const admin = (req, res, next) => {
  console.log("[CLIENT ADMIN DEBUG] role =", req.auth?.role);
  if (req.auth?.role === "ADMIN") return next();
  return res.status(403).json({
    message: "Admin access required.",
    receivedRole: req.auth?.role ?? null
  });
};

router.get("/", auth, admin, async (_req, res) => {
  try {
    const rows = await Client.find().sort({ createdAt: -1 });
    res.json(rows.map(x => { const v = x.toObject(); delete v.accessPasscodeHash; return v; }));
  } catch (e) { res.status(500).json({ message: "Unable to load clients." }); }
});

router.post("/migrate", auth, admin, async (req, res) => {
  let created = 0, skipped = 0;
  const errors = [];
  for (const x of (Array.isArray(req.body?.clients) ? req.body.clients.slice(0, 500) : [])) {
    const id = String(x.id || ""), clientCode = String(x.clientCode || "");
    const email = String(x.email || "").trim().toLowerCase();
    const pass = String(x.accessPasscode || "");
    if (!id || !clientCode || !x.name || !email || !pass) { skipped++; continue; }
    try {
      if (await Client.findOne({ $or: [{ id }, { clientCode }, { email }] })) { skipped++; continue; }
      await Client.create({
        id, clientCode, name: x.name, email, phone: x.phone || "",
        alternatePhone: x.alternatePhone || "", city: x.city || "",
        address: x.address || "", notes: x.notes || "",
        createdAt: x.createdAt || new Date().toISOString().slice(0, 10),
        avatar: x.avatar || "", accessPasscodeHash: await bcrypt.hash(pass, 12)
      });
      created++;
    } catch (e) { errors.push({ clientCode, message: e.message }); }
  }
  res.json({ created, skipped, errors });
});

router.post("/", auth, admin, async (req, res) => {
  try {
    const x = req.body || {};
    if (!x.id || !x.clientCode || !x.name || !x.email || !x.accessPasscode)
      return res.status(400).json({ message: "Client details and passcode are required." });
    const email = String(x.email).trim().toLowerCase();
    if (await Client.findOne({ $or: [{ id: x.id }, { clientCode: x.clientCode }, { email }] }))
      return res.status(409).json({ message: "Client ID, code, or email already exists." });
    const row = await Client.create({
      id: x.id, clientCode: x.clientCode, name: x.name, email,
      phone: x.phone || "", alternatePhone: x.alternatePhone || "",
      city: x.city || "", address: x.address || "", notes: x.notes || "",
      createdAt: x.createdAt || new Date().toISOString().slice(0, 10),
      avatar: x.avatar || "", accessPasscodeHash: await bcrypt.hash(String(x.accessPasscode), 12)
    });
    const v = row.toObject(); delete v.accessPasscodeHash;
    res.status(201).json(v);
  } catch (e) { res.status(500).json({ message: "Unable to create client." }); }
});

router.patch("/:id", auth, admin, async (req, res) => {
  try {
    const x = req.body || {}, update = {};
    for (const k of ["clientCode","name","email","phone","alternatePhone","city","address","notes","avatar"])
      if (x[k] !== undefined) update[k] = x[k];
    if (update.email) update.email = String(update.email).trim().toLowerCase();
    if (x.accessPasscode) update.accessPasscodeHash = await bcrypt.hash(String(x.accessPasscode), 12);
    const row = await Client.findOneAndUpdate({ id: req.params.id }, { $set: update }, { new: true, runValidators: true });
    if (!row) return res.status(404).json({ message: "Client not found." });
    await User.updateMany({ clientId: row.id, role: "CLIENT" }, { $set: { name: row.name, email: row.email, phone: row.phone, avatar: row.avatar } });
    const v = row.toObject(); delete v.accessPasscodeHash;
    res.json(v);
  } catch (e) { res.status(500).json({ message: "Unable to update client." }); }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const row = await Client.findOneAndDelete({ id: req.params.id });
    if (!row) return res.status(404).json({ message: "Client not found." });
    const shoots = await Shoot.find({ clientId: row.id }).select("id");
    const ids = shoots.map(x => x.id);
    if (ids.length) await Photo.deleteMany({ shootId: { $in: ids } });
    await Shoot.deleteMany({ clientId: row.id });
    await User.deleteMany({ clientId: row.id, role: "CLIENT" });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: "Unable to delete client." }); }
});
export default router;
