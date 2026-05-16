import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import ApiError from "../utils/ApiError.js";
import tokenService from "./tokenService.js";
import { hashToken } from "../utils/cryptoUtils.js";

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: ROLES.USER,
  });

  const { accessToken, refreshToken, refreshTokenHash } = tokenService.buildTokenResponse(
    user._id.toString(),
    user.role,
  );

  user.refreshTokenHash = refreshTokenHash;
  await user.save({ validateBeforeSave: false });

  return {
    user: user.toSafeJSON(),
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordOk = await user.comparePassword(password);
  if (!passwordOk) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken, refreshTokenHash } = tokenService.buildTokenResponse(
    user._id.toString(),
    user.role,
  );

  user.refreshTokenHash = refreshTokenHash;
  await user.save({ validateBeforeSave: false });

  return {
    user: user.toSafeJSON(),
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { $set: { refreshTokenHash: null } });
};

const refreshSession = async (refreshToken) => {
  const decoded = tokenService.verifyRefreshToken(refreshToken);
  if (decoded.type !== "refresh" || !decoded.sub) {
    throw new ApiError(401, "Invalid refresh token payload");
  }

  const user = await User.findById(decoded.sub).select("+refreshTokenHash");
  if (!user || !user.refreshTokenHash) {
    throw new ApiError(401, "Session not found or already logged out");
  }

  const incomingHash = hashToken(refreshToken);
  if (incomingHash !== user.refreshTokenHash) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  const { accessToken, refreshToken: newRefreshToken, refreshTokenHash } =
    tokenService.buildTokenResponse(user._id.toString(), user.role);

  user.refreshTokenHash = refreshTokenHash;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: user.toSafeJSON(),
  };
};

const getProfileById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user.toSafeJSON();
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  getProfileById,
};
