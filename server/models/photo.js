import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    shootId: { type: String, required: true, index: true },
    url: { type: String, required: true },
    title: { type: String, default: "" },
    category: { type: String, default: "" },
    isSelectedForAlbum: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    clientNotes: String,
    uploadedAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    resolution: String,
    width: Number,
    height: Number,
  },
  { timestamps: true, versionKey: false, collection: "photos" }
);

export default mongoose.models.Photo ||
  mongoose.model("Photo", photoSchema);
