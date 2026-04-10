const AppError = require("../utils/appError");
const { successResponse } = require("../utils/apiResponse");

async function validateEntry(req, res, next) {
  try {
    const { ticketCode } = req.params;
    const { stationCode } = req.body;

    if (!ticketCode || !stationCode) {
      throw new AppError("ticketCode and stationCode are required", 400);
    }

    return successResponse(res, "Ticket entry validated", {
      ticketCode,
      stationCode,
      result: "ALLOW_ENTRY",
      checkedBy: {
        userId: req.user._id,
        role: req.user.role,
      },
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

async function manualInspection(req, res, next) {
  try {
    const { ticketCode } = req.params;
    const { reason } = req.body;

    if (!ticketCode || !reason) {
      throw new AppError("ticketCode and reason are required", 400);
    }

    return successResponse(res, "Manual inspection recorded", {
      ticketCode,
      reason,
      status: "PENDING_SUPERVISOR_REVIEW",
      createdBy: {
        userId: req.user._id,
        role: req.user.role,
      },
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  validateEntry,
  manualInspection,
};
