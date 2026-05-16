import { body, param, query } from "express-validator";

import { ROLES } from "../constants/roles.js";

export const mongoIdParamRules = [
  param("id").isMongoId().withMessage("Invalid user id"),
];

export const listUsersQueryRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
  query("search").optional().isString().trim(),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "createdAt", "role"])
    .withMessage("sortBy must be one of: name, email, createdAt, role"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be asc or desc"),
];

export const updateUserRules = [
  param("id").isMongoId().withMessage("Invalid user id"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid email is required"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters when provided"),
  body("role")
    .optional()
    .isIn([ROLES.USER, ROLES.ADMIN])
    .withMessage(`Role must be ${ROLES.USER} or ${ROLES.ADMIN}`),
];
