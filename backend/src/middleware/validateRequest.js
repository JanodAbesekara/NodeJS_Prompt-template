import { validationResult } from "express-validator";

import ApiError from "../utils/ApiError.js";

/**
 * Central validation runner for express-validator chains.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => ({
      field: "path" in e ? e.path : undefined,
      message: e.msg,
    }));
    return next(new ApiError(400, "Validation failed", messages));
  }
  return next();
};

export default validateRequest;
