import tokenService from "../services/tokenService.js";
import ApiError from "../utils/ApiError.js";

/**
 * Requires `Authorization: Bearer <access_token>` for protected routes.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const decoded = tokenService.verifyAccessToken(token);
    if (decoded.type && decoded.type !== "access") {
      throw new ApiError(401, "Invalid token type");
    }
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

export default authenticate;
