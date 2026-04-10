const express = require("express");
const {
  validateEntry,
  manualInspection,
} = require("../controllers/metro.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const router = express.Router();

router.post(
  "/tickets/:ticketCode/validate-entry",
  authenticate,
  authorizeRoles("staff", "admin"),
  validateEntry
);

router.post(
  "/tickets/:ticketCode/manual-inspection",
  authenticate,
  authorizeRoles("inspector", "admin"),
  manualInspection
);

module.exports = router;
