import { Router } from "express";

import * as userController from "../controllers/userController.js";
import { ROLES } from "../constants/roles.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  listUsersQueryRules,
  mongoIdParamRules,
  updateUserRules,
} from "../validators/userValidators.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  listUsersQueryRules,
  validateRequest,
  userController.listUsers,
);

router.get(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  mongoIdParamRules,
  validateRequest,
  userController.getUser,
);

router.put(
  "/:id",
  authenticate,
  updateUserRules,
  validateRequest,
  userController.updateUser,
);

router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  mongoIdParamRules,
  validateRequest,
  userController.deleteUser,
);

export default router;
