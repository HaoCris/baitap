const AppError = require("../utils/appError");

const bucketStore = new Map();

function createRateLimit({ windowMs = 60_000, limit = 20, keyGenerator } = {}) {
  return (req, res, next) => {
    const key =
      keyGenerator?.(req) ||
      `${req.ip || "unknown"}:${req.method}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const bucket = bucketStore.get(key);

    if (!bucket || now >= bucket.resetAt) {
      bucketStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    bucket.count += 1;
    if (bucket.count > limit) {
      return next(
        new AppError(
          `Too many requests, retry after ${Math.ceil(
            (bucket.resetAt - now) / 1000
          )}s`,
          429
        )
      );
    }

    return next();
  };
}

module.exports = {
  createRateLimit,
  resetRateLimitStore: () => bucketStore.clear(),
};
