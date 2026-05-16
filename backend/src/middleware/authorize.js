import { ROLES } from "../constants/roles.js";
import ApiError from "../utils/ApiError.js";

/**
 * Role-based access control. Use after `authenticate`.
 * @param {...string} allowedRoles — One or more values from `ROLES`.
 */
const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    return next();
  };

export default authorize;
