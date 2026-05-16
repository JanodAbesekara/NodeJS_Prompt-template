import ApiError from "../utils/ApiError.js";

/**
 * Express error-handling middleware (must be registered last).
 */
const errorHandler = (err, req, res, _next) => {
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid identifier format",
    });
  }

  if (err.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : null;
    return res.status(409).json({
      success: false,
      message: field ? `Duplicate value for field: ${field}` : "Duplicate key error",
    });
  }

  const statusCode = err.statusCode && Number.isFinite(err.statusCode) ? err.statusCode : 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Something went wrong";

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV !== "production" && statusCode >= 500 && err.stack
      ? { stack: err.stack }
      : {}),
  });
};

export default errorHandler;
