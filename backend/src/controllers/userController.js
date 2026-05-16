import { ROLES } from "../constants/roles.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import userService from "../services/userService.js";

export const listUsers = catchAsync(async (req, res) => {
  const { page, limit, search, sortBy, sortOrder } = req.query;
  const result = await userService.listUsers({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  return sendSuccess(res, {
    message: "Users retrieved",
    data: result,
  });
});

export const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, {
    message: "User retrieved",
    data: { user },
  });
});

export const updateUser = catchAsync(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN && req.user.id !== req.params.id) {
    throw new ApiError(403, "You can only update your own profile");
  }

  const { name, email, password, role } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (password !== undefined) updates.password = password;
  if (role !== undefined) updates.role = role;

  const user = await userService.updateUserById(req.params.id, updates, {
    requestUser: req.user,
  });

  return sendSuccess(res, {
    message: "User updated successfully",
    data: { user },
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.id);
  return sendSuccess(res, {
    message: "User deleted successfully",
    data: null,
  });
});
