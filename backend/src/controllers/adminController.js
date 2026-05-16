import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import userService from "../services/userService.js";

export const getDashboard = catchAsync(async (req, res) => {
  const stats = await userService.getDashboardStats();
  return sendSuccess(res, {
    message: "Dashboard statistics retrieved",
    data: stats,
  });
});
