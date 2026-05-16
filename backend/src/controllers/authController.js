import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import authService from "../services/authService.js";

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Registration successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  return sendSuccess(res, {
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const logout = catchAsync(async (req, res) => {
  await authService.logoutUser(req.user.id);
  return sendSuccess(res, {
    message: "Logged out successfully",
    data: null,
  });
});

export const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshSession(refreshToken);

  return sendSuccess(res, {
    message: "Tokens refreshed",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const profile = catchAsync(async (req, res) => {
  const user = await authService.getProfileById(req.user.id);
  return sendSuccess(res, {
    message: "Profile retrieved",
    data: { user },
  });
});
