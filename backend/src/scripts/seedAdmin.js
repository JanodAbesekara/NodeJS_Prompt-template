import "../config/loadEnv.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import env from "../config/env.js";
import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";

/**
 * Creates the initial admin account when missing (idempotent).
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in environment for a real insert.
 */
export const seedAdmin = async () => {
  const emailRaw = env.ADMIN_EMAIL;
  const passwordRaw = env.ADMIN_PASSWORD;

  if (!emailRaw || !passwordRaw) {
    // eslint-disable-next-line no-console
    console.warn("[seed] ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed");
    return;
  }

  const email = String(emailRaw).toLowerCase().trim();

  const existing = await User.findOne({ email });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("[seed] Admin user already exists — skipping");
    return;
  }

  await User.create({
    name: env.ADMIN_NAME || "Admin User",
    email,
    password: String(passwordRaw),
    role: ROLES.ADMIN,
  });

  // eslint-disable-next-line no-console
  console.log("[seed] Admin user created");
};

const __filename = fileURLToPath(import.meta.url);

async function runCli() {
  env.validate();
  await connectDB();
  await seedAdmin();
  await mongoose.connection.close();
  process.exit(0);
}

const invokedDirectly =
  Boolean(process.argv[1]) &&
  path.resolve(process.cwd(), process.argv[1]) === path.resolve(__filename);

if (invokedDirectly) {
  runCli().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[seed] Failed:", err);
    process.exit(1);
  });
}
