
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Client from "../models/client.js";

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      clientId: user.clientId || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, passcode } = req.body || {};

    if (
      typeof identifier !== "string" ||
      typeof passcode !== "string" ||
      !identifier.trim() ||
      !passcode
    ) {
      return res.status(400).json({
        message: "Email/client code and passcode are required.",
      });
    }

    const loginId = identifier.trim().toLowerCase();

    // Admin login
    const user = await User.findOne({
      email: loginId,
      role: "ADMIN",
      isActive: true,
    }).select("+passwordHash");

    if (user) {
      const valid = await bcrypt.compare(passcode, user.passwordHash);

      if (!valid) {
        return res.status(401).json({ message: "Invalid login credentials." });
      }

      const token = createToken(user);

      return res.json({
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
      });
    }

    // Client login by email or client code
    const client = await Client.findOne({
      $or: [
        { email: loginId },
        { clientCode: identifier.trim() },
      ],
    }).select("+accessPasscodeHash");

    if (!client) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    const valid = await bcrypt.compare(
      passcode,
      client.accessPasscodeHash
    );

    if (!valid) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    // Client identity is represented by the associated User record.
   let clientUser = await User.findOne({
  clientId: client.id,
  role: "CLIENT",
}).select("+passwordHash");

if (clientUser && !clientUser.isActive) {
  return res.status(403).json({
    message: "This client account is inactive. Please contact the studio.",
  });
}

if (!clientUser) {
  clientUser = await User.create({
        name: client.name,
        email: client.email,
        passwordHash: await bcrypt.hash(
          `${Date.now()}-${Math.random()}-${process.env.JWT_SECRET}`,
          12
        ),
        role: "CLIENT",
        clientId: client.id,
        phone: client.phone,
        avatar: client.avatar || "",
      });
    }

    const token = createToken(clientUser);

    return res.json({
      token,
      user: {
        id: clientUser._id.toString(),
        name: clientUser.name,
        email: clientUser.email,
        role: "CLIENT",
        clientId: client.id,
        phone: client.phone,
        avatar: client.avatar || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Login failed." });
  }
});

export default router;
