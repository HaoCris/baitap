/**
 * Shared Constants
 * Các hằng số dùng chung
 */

// Mathematical constants
export const PI = Math.PI;
export const E = Math.E;
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
export const SQRT_2 = Math.SQRT2;

// Common regex patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_VN: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Time constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000
};

// Array sort directions
export const SORT = {
  ASC: 'asc',
  DESC: 'desc'
};

// Default values
export const DEFAULTS = {
  PAGE_SIZE: 10,
  MAX_RETRIES: 3,
  TIMEOUT: 30000
};

export default {
  PI,
  E,
  GOLDEN_RATIO,
  SQRT_2,
  REGEX,
  HTTP_STATUS,
  TIME,
  SORT,
  DEFAULTS
};
