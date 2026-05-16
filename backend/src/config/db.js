import mongoose from "mongoose";

import env from "./env.js";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const uri = env.MONGODB_URI;

  await mongoose.connect(uri, {
    autoIndex: env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 10_000,
  });

  isConnected = true;
  // eslint-disable-next-line no-console
  console.log(`MongoDB connected: ${mongoose.connection.host}`);

  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err);
  });
};

export default connectDB;
