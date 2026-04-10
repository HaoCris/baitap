/**
 * Bài 6.1: Custom Errors
 * 
 * Tạo các custom error classes và error handling functions
 */

/**
 * ValidationError - Error khi validation fail
 * @extends Error
 */
class ValidationError extends Error {
  /**
   * @param {string} message - Error message
   * @param {string} field - Field bị lỗi (optional)
   */
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
    
    // Để stack trace hoạt động đúng
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * NetworkError - Error khi có vấn đề network
 * @extends Error
 */
class NetworkError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (optional)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}

/**
 * AuthenticationError - Error khi authentication fail
 * @extends Error
 */
class AuthenticationError extends Error {
  /**
   * @param {string} message - Error message
   * @param {string} reason - Lý do fail (optional)
   */
  constructor(message, reason = null) {
    super(message);
    this.name = 'AuthenticationError';
    this.reason = reason;
    this.statusCode = 401;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }
  }
}

/**
 * DatabaseError - Error khi có vấn đề với database
 * @extends Error
 */
class DatabaseError extends Error {
  /**
   * @param {string} message - Error message
   * @param {string} query - Query gây lỗi (optional)
   */
  constructor(message, query = null) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
    this.statusCode = 500;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }
}

/**
 * NotFoundError - Error khi resource không tồn tại
 * @extends Error
 */
class NotFoundError extends Error {
  /**
   * @param {string} message - Error message
   * @param {string} resource - Resource không tìm thấy (optional)
   */
  constructor(message, resource = null) {
    super(message);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.statusCode = 404;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

/**
 * Validate user object và throw appropriate error nếu validation fail
 * 
 * @param {Object} user - User object cần validate
 * @param {string} user.username - Username
 * @param {string} user.email - Email
 * @param {string} user.password - Password
 * @param {number} user.age - Age
 * @returns {boolean} true nếu validation pass
 * @throws {ValidationError} Nếu validation fail
 * 
 * @example
 * validateUser({ username: 'john', email: 'john@example.com', password: '12345678', age: 25 });
 * // true
 * 
 * validateUser({ username: '', email: 'invalid', password: '123', age: 15 });
 * // ValidationError: Username không được rỗng
 */
function validateUser(user) {
  // Kiểm tra user object tồn tại
  if (!user || typeof user !== 'object') {
    throw new ValidationError('User phải là một object');
  }

  // Validate username
  if (!user.username || typeof user.username !== 'string') {
    throw new ValidationError('Username không được rỗng', 'username');
  }
  
  if (user.username.length < 3) {
    throw new ValidationError('Username phải có ít nhất 3 ký tự', 'username');
  }
  
  if (user.username.length > 20) {
    throw new ValidationError('Username không được quá 20 ký tự', 'username');
  }

  // Validate email
  if (!user.email || typeof user.email !== 'string') {
    throw new ValidationError('Email không được rỗng', 'email');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new ValidationError('Email không hợp lệ', 'email');
  }

  // Validate password
  if (!user.password || typeof user.password !== 'string') {
    throw new ValidationError('Password không được rỗng', 'password');
  }
  
  if (user.password.length < 6) {
    throw new ValidationError('Password phải có ít nhất 6 ký tự', 'password');
  }
  
  if (user.password.length > 50) {
    throw new ValidationError('Password không được quá 50 ký tự', 'password');
  }

  // Validate age (optional)
  if (user.age !== undefined) {
    if (typeof user.age !== 'number') {
      throw new ValidationError('Age phải là số', 'age');
    }
    
    if (user.age < 18) {
      throw new ValidationError('Age phải từ 18 tuổi trở lên', 'age');
    }
    
    if (user.age > 120) {
      throw new ValidationError('Age không hợp lệ', 'age');
    }
  }

  return true;
}

/**
 * Xử lý error dựa trên loại error
 * Trả về response object phù hợp cho từng loại error
 * 
 * @param {Error} error - Error object cần xử lý
 * @returns {Object} Response object với message, status, type
 * 
 * @example
 * const error = new ValidationError('Email không hợp lệ', 'email');
 * handleError(error);
 * // {
 * //   success: false,
 * //   message: 'Email không hợp lệ',
 * //   statusCode: 400,
 * //   type: 'ValidationError',
 * //   field: 'email'
 * // }
 */
function handleError(error) {
  // Xử lý ValidationError
  if (error instanceof ValidationError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      type: 'ValidationError',
      field: error.field
    };
  }

  // Xử lý NetworkError
  if (error instanceof NetworkError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      type: 'NetworkError',
      retryable: error.statusCode >= 500
    };
  }

  // Xử lý AuthenticationError
  if (error instanceof AuthenticationError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      type: 'AuthenticationError',
      reason: error.reason,
      action: 'Please login again'
    };
  }

  // Xử lý DatabaseError
  if (error instanceof DatabaseError) {
    return {
      success: false,
      message: 'Database error occurred',
      statusCode: error.statusCode,
      type: 'DatabaseError',
      details: error.message // Không expose query cho client
    };
  }

  // Xử lý NotFoundError
  if (error instanceof NotFoundError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      type: 'NotFoundError',
      resource: error.resource
    };
  }

  // Xử lý generic Error
  return {
    success: false,
    message: error.message || 'An unexpected error occurred',
    statusCode: 500,
    type: 'Error'
  };
}

/**
 * Async wrapper function with error handling
 * Wrap async function và tự động xử lý errors
 * 
 * @param {Function} fn - Async function cần wrap
 * @returns {Function} Wrapped function
 * 
 * @example
 * const safeFetch = asyncErrorHandler(async (userId) => {
 *   const response = await fetch(`/api/users/${userId}`);
 *   if (!response.ok) throw new NetworkError('Failed to fetch user');
 *   return response.json();
 * });
 * 
 * const result = await safeFetch(1);
 * // { success: true/false, data/error: ... }
 */
function asyncErrorHandler(fn) {
  return async function(...args) {
    try {
      const result = await fn(...args);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  };
}

/**
 * Try-catch wrapper cho synchronous functions
 * 
 * @param {Function} fn - Function cần wrap
 * @param {any} defaultValue - Giá trị mặc định nếu error
 * @returns {Function} Wrapped function
 * 
 * @example
 * const safeParseInt = tryCatch(parseInt, 0);
 * safeParseInt('123'); // 123
 * safeParseInt('abc'); // 0
 */
function tryCatch(fn, defaultValue = null) {
  return function(...args) {
    try {
      return fn(...args);
    } catch (error) {
      console.error('Error caught:', error.message);
      return defaultValue;
    }
  };
}

/**
 * Assert function - throw error nếu condition false
 * 
 * @param {boolean} condition - Điều kiện cần check
 * @param {string} message - Error message nếu fail
 * @param {Error} ErrorClass - Error class để throw (default: Error)
 * @throws {Error} Nếu condition false
 * 
 * @example
 * assert(user.age >= 18, 'User must be 18+', ValidationError);
 */
function assert(condition, message, ErrorClass = Error) {
  if (!condition) {
    throw new ErrorClass(message);
  }
}

/**
 * Guard function - kiểm tra và throw error nếu không pass
 * 
 * @param {any} value - Giá trị cần kiểm tra
 * @param {Function} validator - Validator function
 * @param {string} message - Error message
 * @returns {any} Value nếu pass validation
 * @throws {ValidationError} Nếu validation fail
 * 
 * @example
 * const email = guard(input, (v) => v.includes('@'), 'Invalid email');
 */
function guard(value, validator, message) {
  if (!validator(value)) {
    throw new ValidationError(message);
  }
  return value;
}

/**
 * Error logger - log error với format đẹp
 * 
 * @param {Error} error - Error cần log
 * @param {Object} context - Context bổ sung (optional)
 * @returns {Object} Logged error info
 * 
 * @example
 * logError(new NetworkError('Connection failed'), { userId: 123 });
 */
function logError(error, context = {}) {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    timestamp: new Date().toISOString(),
    context
  };

  // Trong production, gửi tới logging service
  console.error('Error logged:', errorInfo);
  
  return errorInfo;
}

module.exports = {
  ValidationError,
  NetworkError,
  AuthenticationError,
  DatabaseError,
  NotFoundError,
  validateUser,
  handleError,
  asyncErrorHandler,
  tryCatch,
  assert,
  guard,
  logError
};
