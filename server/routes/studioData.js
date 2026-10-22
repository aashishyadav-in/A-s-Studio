import express from "express";
import auth from "../middleware/auth.js";
import StudioData from "../models/studioData.js";

const router = express.Router();
router.use(auth, (req, res, next) => {
  if (req.auth?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
});

async function getOrCreate() {
  let row = await StudioData.findOne({ key: "main" });
  if (!row) row = await StudioData.create({ key: "main" });
  return row;
}

const safeArray = (value) => Array.isArray(value) ? value : [];

router.get("/", async (_req, res) => {
  try {
    const row = await getOrCreate();
    res.json({
      studioConfig: row.studioConfig,
      stages: row.stages,
      equipment: row.equipment,
      documents: row.documents,
    });
  } catch (error) {
    console.error("Studio data load failed:", error);
    res.status(500).json({ message: "Unable to load studio data." });
  }
});

// Import local data without replacing records already in MongoDB.
router.post("/migrate", async (req, res) => {
  try {
    const row = await getOrCreate();
    const body = req.body || {};
    let added = { stages: 0, equipment: 0, documents: 0 };

    if (!row.studioConfig && body.studioConfig && typeof body.studioConfig === "object") {
      row.studioConfig = body.studioConfig;
    }

    for (const key of ["stages", "equipment", "documents"]) {
      const existing = safeArray(row[key]);
      const ids = new Set(existing.map(item => String(item?.id)));
      for (const item of safeArray(body[key]).slice(0, 10000)) {
        if (!item?.id || ids.has(String(item.id))) continue;
        existing.push(item);
        ids.add(String(item.id));
        added[key]++;
      }
      row[key] = existing;
    }

    row.markModified("studioConfig");
    row.markModified("stages");
    row.markModified("equipment");
    row.markModified("documents");
    await row.save();
    res.json({ message: "Migration complete.", added });
  } catch (error) {
    console.error("Studio data migration failed:", error);
    res.status(500).json({ message: "Unable to migrate studio data." });
  }
});

router.patch("/config", async (req, res) => {
  try {
    const row = await getOrCreate();
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ message: "Invalid studio settings." });
    }
    row.studioConfig = { ...(row.studioConfig || {}), ...req.body };
    row.markModified("studioConfig");
    await row.save();
    res.json(row.studioConfig);
  } catch (error) {
    console.error("Studio config update failed:", error);
    res.status(500).json({ message: "Unable to update studio settings." });
  }
});

async function updateRecord(collection, id, updates) {
  const row = await getOrCreate();
  const items = safeArray(row[collection]);
  const index = items.findIndex(item => String(item?.id) === String(id));
  if (index < 0) return null;
  items[index] = { ...items[index], ...updates, id: items[index].id };
  row[collection] = items;
  row.markModified(collection);
  await row.save();
  return items[index];
}

router.patch("/stages/:id", async (req, res) => {
  try {
    const updates = {};
    if (["Available", "In Production", "Reserved"].includes(req.body?.status)) {
      updates.status = req.body.status;
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "Invalid stage update." });
    }
    const item = await updateRecord("stages", req.params.id, updates);
    if (!item) return res.status(404).json({ message: "Stage not found." });
    res.json(item);
  } catch (error) {
    console.error("Stage update failed:", error);
    res.status(500).json({ message: "Unable to update stage." });
  }
});

router.patch("/equipment/:id", async (req, res) => {
  try {
    const updates = {};
    if (["In Vault", "Assigned on Shoot", "Maintenance"].includes(req.body?.status)) {
      updates.status = req.body.status;
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "Invalid equipment update." });
    }
    const item = await updateRecord("equipment", req.params.id, updates);
    if (!item) return res.status(404).json({ message: "Equipment not found." });
    res.json(item);
  } catch (error) {
    console.error("Equipment update failed:", error);
    res.status(500).json({ message: "Unable to update equipment." });
  }
});

router.post("/documents", async (req, res) => {
  try {
    const item = req.body;
    if (!item?.id || !item?.clientId || !item?.title) {
      return res.status(400).json({ message: "Document ID, client ID and title are required." });
    }
    const row = await getOrCreate();
    const items = safeArray(row.documents);
    const index = items.findIndex(doc => String(doc?.id) === String(item.id));
    if (index >= 0) items[index] = item;
    else items.unshift(item);
    row.documents = items;
    row.markModified("documents");
    await row.save();
    res.status(index >= 0 ? 200 : 201).json(item);
  } catch (error) {
    console.error("Document save failed:", error);
    res.status(500).json({ message: "Unable to save document." });
  }
});

router.delete("/documents/:id", async (req, res) => {
  try {
    const row = await getOrCreate();
    row.documents = safeArray(row.documents).filter(
      item => String(item?.id) !== String(req.params.id)
    );
    row.markModified("documents");
    await row.save();
    res.json({ message: "Document deleted." });
  } catch (error) {
    console.error("Document delete failed:", error);
    res.status(500).json({ message: "Unable to delete document." });
  }
});

export default router;
