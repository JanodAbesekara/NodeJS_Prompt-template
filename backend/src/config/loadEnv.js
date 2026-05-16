import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/.env (works when app runs from server.js or scripts)
const envPath = path.join(__dirname, "..", "..", ".env");
dotenv.config({ path: envPath });
