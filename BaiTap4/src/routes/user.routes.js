const express = require("express");
const {
  getMe,
  getUsers,
  updateUserRole,
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/me", authenticate, getMe);
router.get("/", authenticate, authorizeRoles("admin"), getUsers);
router.patch("/:id/role", authenticate, authorizeRoles("admin"), updateUserRole);

module.exports = router;
