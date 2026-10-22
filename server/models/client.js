
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    alternatePhone: String,
    city: {
      type: String,
      default: "",
    },
    address: String,
    notes: String,
    createdAt: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    avatar: String,
    accessPasscodeHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Client ||
  mongoose.model("Client", clientSchema);
