const crypto = require("crypto");
const AppError = require("../utils/appError");
const IdempotencyKey = require("../models/idempotency.model");

const TTL_MS = 24 * 60 * 60 * 1000; // 24 giờ

function hashBody(body) {
  return crypto.createHash("sha256").update(JSON.stringify(body ?? {})).digest("hex");
}

async function enforceIdempotency(req, res, next) {
  try {
    const key = req.header("Idempotency-Key");
    if (!key) {
      return next(new AppError("Idempotency-Key header is required", 400));
    }

    const requestHash = hashBody(req.body);
    const existing = await IdempotencyKey.findOne({ key });

    if (existing) {
      if (existing.expiresAt < new Date()) {
        await IdempotencyKey.deleteOne({ key });
      } else if (existing.requestHash !== requestHash) {
        return next(new AppError("Idempotency-Key already used with different payload", 409));
      } else {
        return res.status(existing.statusCode).json(existing.responseBody);
      }
    }

    req.idempotency = { key, requestHash };
    return next();
  } catch (error) {
    return next(error);
  }
}

async function saveIdempotencyResponse(req, statusCode, body) {
  if (!req.idempotency?.key) return;
  await IdempotencyKey.create({
    key: req.idempotency.key,
    method: req.method,
    path: req.originalUrl,
    requestHash: req.idempotency.requestHash,
    statusCode,
    responseBody: body,
    expiresAt: new Date(Date.now() + TTL_MS),
  });
}

module.exports = {
  enforceIdempotency,
  saveIdempotencyResponse,
};
