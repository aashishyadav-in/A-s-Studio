import mongoose from "mongoose";

const studioDataSchema = new mongoose.Schema({
  key: { type: String, default: "main", unique: true, index: true },
  studioConfig: { type: mongoose.Schema.Types.Mixed, default: null },
  stages: { type: [mongoose.Schema.Types.Mixed], default: [] },
  equipment: { type: [mongoose.Schema.Types.Mixed], default: [] },
  documents: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: true, collection: "studio_data" });

export default mongoose.models.StudioData ||
  mongoose.model("StudioData", studioDataSchema);
