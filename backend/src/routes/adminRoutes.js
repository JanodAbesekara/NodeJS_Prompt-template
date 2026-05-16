import { Router } from "express";

import * as adminController from "../controllers/adminController.js";
import { ROLES } from "../constants/roles.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.get("/dashboard", authenticate, authorize(ROLES.ADMIN), adminController.getDashboard);

export default router;
