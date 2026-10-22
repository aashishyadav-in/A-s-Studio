import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Client from "./models/client.js";

dotenv.config({
  path: path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    ".env"
  ),
});

// Demo clients from the existing frontend data.
// Passcodes are hashed before they are stored in MongoDB.
const demoClients = [
  {
    id: "clt-1",
    clientCode: "CLT-2026-081",
    name: "Priya & Kabir Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98201 12345",
    alternatePhone: "+91 98201 54321",
    city: "Udaipur / Mumbai",
    address: "Bunglow 12, Gulmohar Road, Juhu, Mumbai",
    notes: "Destination Royal Wedding in Udaipur.",
    createdAt: "2026-02-10",
    passcode: "AURA81",
  },
];

async function seedClients() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    for (const item of demoClients) {
      const existing = await Client.findOne({
        $or: [
          { id: item.id },
          { clientCode: item.clientCode },
          { email: item.email.toLowerCase() },
        ],
      });

      if (existing) {
        console.log(`Skipped existing client: ${item.id}`);
        continue;
      }

      const accessPasscodeHash = await bcrypt.hash(item.passcode, 12);
      const { passcode, ...clientData } = item;

      await Client.create({
        ...clientData,
        email: clientData.email.toLowerCase(),
        accessPasscodeHash,
      });

      console.log(`Created client: ${item.id}`);
    }
  } catch (error) {
    console.error("Client seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedClients();
