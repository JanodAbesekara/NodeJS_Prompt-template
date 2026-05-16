import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import ApiError from "../utils/ApiError.js";

const ALLOWED_SORT_FIELDS = new Set(["name", "email", "createdAt", "role"]);

const buildFilters = (search) => {
  if (!search || String(search).trim() === "") {
    return {};
  }
  const q = String(search).trim();
  return {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  };
};

const listUsers = async ({ page, limit, search, sortBy, sortOrder }) => {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 10));
  const skip = (safePage - 1) * safeLimit;

  const sortField = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;
  const sort = { [sortField]: order };

  const filter = buildFilters(search);

  const [items, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(safeLimit).lean(),
    User.countDocuments(filter),
  ]);

  const sanitized = items.map((u) => {
    const { password, refreshTokenHash, ...rest } = u;
    return rest;
  });

  return {
    items: sanitized,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).lean();
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { password, refreshTokenHash, ...rest } = user;
  return rest;
};

const updateUserById = async (id, updates, { requestUser }) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (requestUser.role !== ROLES.ADMIN && user._id.toString() !== requestUser.id) {
    throw new ApiError(403, "You can only update your own profile");
  }

  if (requestUser.role !== ROLES.ADMIN && updates.role !== undefined) {
    throw new ApiError(403, "You cannot change your role");
  }

  if (updates.name !== undefined) {
    user.name = updates.name;
  }

  if (updates.email !== undefined) {
    const emailLower = updates.email.toLowerCase();
    const exists = await User.findOne({ email: emailLower, _id: { $ne: id } });
    if (exists) {
      throw new ApiError(409, "Email is already in use");
    }
    user.email = emailLower;
  }

  if (updates.password !== undefined && updates.password !== "") {
    user.password = updates.password;
  }

  if (requestUser.role === ROLES.ADMIN && updates.role !== undefined) {
    user.role = updates.role;
  }

  await user.save();

  return user.toSafeJSON();
};

const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
};

const getDashboardStats = async () => {
  const [totalUsers, adminCount, userCount, recentUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: ROLES.ADMIN }),
    User.countDocuments({ role: ROLES.USER }),
    User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt").lean(),
  ]);

  return {
    totalUsers,
    usersByRole: {
      admin: adminCount,
      user: userCount,
    },
    recentRegistrations: recentUsers,
  };
};

export default {
  listUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getDashboardStats,
};
