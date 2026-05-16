/**
 * Standard API success response shape.
 */
export const sendSuccess = (res, options) => {
  const { statusCode = 200, message, data = null } = options;
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
