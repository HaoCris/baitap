const AppError = require("../utils/appError");
const { successResponse } = require("../utils/apiResponse");
const MetroEvent = require("../models/metroEvent.model");
const { domainEvents, DOMAIN_EVENTS } = require("../events/domainEvents");

async function validateEntry(req, res, next) {
  try {
    const { ticketCode } = req.params;
    const { stationCode } = req.body;

    if (!ticketCode || !stationCode) {
      throw new AppError("ticketCode and stationCode are required", 400);
    }

    const payload = {
      ticketCode,
      stationCode,
      result: "ALLOW_ENTRY",
      checkedBy: {
        userId: req.user._id,
        role: req.user.role,
      },
      checkedAt: new Date().toISOString(),
    };

    await MetroEvent.create({
      ticketCode,
      eventType: "entry_validated",
      stationCode,
      result: payload.result,
      performedBy: payload.checkedBy,
    });

    domainEvents.emit(DOMAIN_EVENTS.TICKET_ENTRY_VALIDATED, payload);
    return successResponse(res, "Ticket entry validated", payload);
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

    const payload = {
      ticketCode,
      reason,
      status: "PENDING_SUPERVISOR_REVIEW",
      createdBy: {
        userId: req.user._id,
        role: req.user.role,
      },
      createdAt: new Date().toISOString(),
    };

    await MetroEvent.create({
      ticketCode,
      eventType: "manual_inspection",
      reason,
      result: payload.status,
      performedBy: payload.createdBy,
    });

    domainEvents.emit(DOMAIN_EVENTS.TICKET_MANUAL_INSPECTION_CREATED, payload);
    return successResponse(res, "Manual inspection recorded", payload);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  validateEntry,
  manualInspection,
};
