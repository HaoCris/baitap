const { pipeline } = require("stream/promises");
const Report = require("../models/report.model");
const { successResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const { queueReportGeneration, createCsvStream } = require("../services/report.service");
const { saveIdempotencyResponse } = require("../middlewares/idempotency.middleware");
const { domainEvents, DOMAIN_EVENTS } = require("../events/domainEvents");

async function createReport(req, res, next) {
  try {
    const { title, type, fromDate, toDate } = req.body;
    if (new Date(fromDate) > new Date(toDate)) {
      throw new AppError("fromDate must be earlier than toDate", 400);
    }

    const report = await Report.create({
      title,
      type,
      fromDate,
      toDate,
      requestedBy: req.user._id,
      status: "pending",
    });

    const responseBody = {
      success: true,
      message: "Report created",
      data: { report },
    };

    await saveIdempotencyResponse(req, 201, responseBody);

    domainEvents.emit(DOMAIN_EVENTS.REPORT_CREATED, {
      reportId: String(report._id),
      title: report.title,
      type: report.type,
    });

    void queueReportGeneration(report);
    return res.status(201).json(responseBody);
  } catch (error) {
    return next(error);
  }
}

async function getReports(req, res, next) {
  try {
    const { page, limit, status, sortBy, sortOrder } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [items, total] = await Promise.all([
      Report.find(filter).sort(sort).skip(skip).limit(limit),
      Report.countDocuments(filter),
    ]);

    return successResponse(res, "Get reports success", {
      reports: items,
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

async function getReportById(req, res, next) {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      throw new AppError("Report not found", 404);
    }
    return successResponse(res, "Get report success", { report });
  } catch (error) {
    return next(error);
  }
}

async function downloadReportCsv(req, res, next) {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      throw new AppError("Report not found", 404);
    }

    const csvStream = createCsvStream(report);
    const fileName = `report-${report._id}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await pipeline(csvStream, res);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createReport,
  getReports,
  getReportById,
  downloadReportCsv,
};
