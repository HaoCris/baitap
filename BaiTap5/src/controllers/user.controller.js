const User = require("../models/user.model");
const { successResponse } = require("../utils/apiResponse");

async function getMe(req, res, next) {
  try {
    return successResponse(res, "Get profile success", { user: req.user });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const { page, limit, role, q, sortBy, sortOrder } = req.query;
    const filter = {};
    if (role) {
      filter.role = role;
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return successResponse(res, "Get users success", {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return successResponse(res, "Update role success", { user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMe,
  getUsers,
  updateUserRole,
};
