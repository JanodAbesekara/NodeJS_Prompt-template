import "./src/config/loadEnv.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import env from "./src/config/env.js";
import { seedAdmin } from "./src/scripts/seedAdmin.js";

env.validate();

let server;

const start = async () => {
  await connectDB();

  if (process.env.SEED_ADMIN_ON_START === "true") {
    await seedAdmin();
  }

  const basePort = Number.parseInt(process.env.PORT || "5000", 10);
  const maxRetries = 5;

  const listen = (port, attempt = 1) => {
    server = app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${port} (${process.env.NODE_ENV || "development"})`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        if (attempt < maxRetries) {
          const nextPort = port + 1;
          // eslint-disable-next-line no-console
          console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`);
          listen(nextPort, attempt + 1);
          return;
        }

        // eslint-disable-next-line no-console
        console.error(`Port ${port} is already in use. Make sure the previous process has exited before restarting.`);
        process.exit(1);
      }
      throw err;
    });
  };

  listen(basePort);

  const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`${signal} received, shutting down gracefully`);
    if (server) {
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(0), 5000);
    } else {
      process.exit(0);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGUSR2", () => shutdown("SIGUSR2"));
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});
