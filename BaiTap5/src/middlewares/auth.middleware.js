const User = require("../models/user.model");
const { verifyAccessToken } = require("../services/token.service");
const AppError = require("../utils/appError");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(new AppError("Unauthorized", 401));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");
    if (!user || !user.isActive) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError("Unauthorized", 401));
  }
}

module.exports = {
  authenticate,
};
