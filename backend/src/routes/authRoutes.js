import { Router } from "express";
import rateLimit from "express-rate-limit";

import * as authController from "../controllers/authController.js";
import authenticate from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import { loginRules, refreshRules, registerRules } from "../validators/authValidators.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, registerRules, validateRequest, authController.register);
router.post("/login", authLimiter, loginRules, validateRequest, authController.login);
router.post("/refresh", authLimiter, refreshRules, validateRequest, authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/profile", authenticate, authController.profile);

export default router;
