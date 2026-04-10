const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../services/token.service");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/apiResponse");

function getExpiryDateFromToken(token) {
  const payload = verifyRefreshToken(token);
  return new Date(payload.exp * 1000);
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      throw new AppError("Invalid register payload", 400);
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError("Email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: passwordHash,
    });

    return successResponse(
      res,
      "Register success",
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
      201
    );
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const tokenPayload = { sub: String(user._id), role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const expiresAt = getExpiryDateFromToken(refreshToken);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
    });

    return successResponse(res, "Login success", {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function refreshAccessToken(req, res, next) {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new AppError("refreshToken is required", 400);
    }

    const payload = verifyRefreshToken(refreshToken);
    const record = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
    if (!record) {
      throw new AppError("Refresh token invalid or revoked", 401);
    }

    await RefreshToken.updateOne({ _id: record._id }, { isRevoked: true });

    const nextPayload = { sub: payload.sub, role: payload.role };
    const newAccessToken = generateAccessToken(nextPayload);
    const newRefreshToken = generateRefreshToken(nextPayload);
    const newExpiresAt = getExpiryDateFromToken(newRefreshToken);

    await RefreshToken.create({
      userId: payload.sub,
      token: newRefreshToken,
      expiresAt: newExpiresAt,
    });

    return successResponse(res, "Refresh token success", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new AppError("refreshToken is required", 400);
    }

    await RefreshToken.updateOne({ token: refreshToken }, { isRevoked: true });

    return successResponse(res, "Logout success", {});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
};
