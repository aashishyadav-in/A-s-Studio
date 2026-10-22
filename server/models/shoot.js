import mongoose from "mongoose";

const shootSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    clientId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    eventDate: { type: String, required: true },
    venue: { type: String, default: "" },
    leadPhotographer: { type: String, default: "" },
    crewMembers: { type: [String], default: [] },
    status: { type: String, required: true },
    packageTitle: { type: String, default: "" },
    totalAmount: { type: Number, default: 0 },
    advancePaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    masterDriveLink: String,
    teaserVideoLink: String,
    rawBackupLink: String,
    notes: String,
    coverImage: { type: String, default: "" },
    photosCount: Number,
    selectedPhotosCount: Number,
  },
  { timestamps: true, versionKey: false, collection: "shoots" }
);

export default mongoose.models.Shoot ||
  mongoose.model("Shoot", shootSchema);
