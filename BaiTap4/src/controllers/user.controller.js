const User = require("../models/user.model");
const AppError = require("../utils/appError");
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
    const users = await User.find({}).select("-password");
    return successResponse(res, "Get users success", { users });
  } catch (error) {
    return next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["passenger", "staff", "inspector", "admin"].includes(role)) {
      throw new AppError(
        "role must be passenger, staff, inspector, or admin",
        400
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
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
