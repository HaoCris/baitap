const express = require("express");
const {
  register,
  login,
  refreshAccessToken,
  logout,
} = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validate.middleware");
const { createRateLimit } = require("../middlewares/rateLimit.middleware");
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  createRateLimit({ windowMs: 60_000, limit: 20 }),
  validate(registerSchema),
  register
);
router.post(
  "/login",
  createRateLimit({ windowMs: 60_000, limit: 10 }),
  validate(loginSchema),
  login
);
router.post("/refresh-token", validate(refreshSchema), refreshAccessToken);
router.post("/logout", validate(refreshSchema), logout);

module.exports = router;
