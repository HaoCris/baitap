/**
 * Bài 6.2: Error Handling Patterns
 * 
 * Các pattern xử lý lỗi phổ biến trong JavaScript
 */

/**
 * Wrapper function bắt và xử lý errors
 * Trả về một function mới có xử lý lỗi an toàn
 * 
 * @param {Function} fn - Function cần wrap với error handling
 * @returns {Function} Function mới với error handling
 * 
 * @example
 * const safeDivide = tryCatch((a, b) => a / b);
 * const result = safeDivide(10, 0); // { success: false, error: ... }
 */
function tryCatch(fn) {
  return function(...args) {
    try {
      const result = fn(...args);
      return {
        success: true,
        data: result,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack
        }
      };
    }
  };
}

/**
 * Parse JSON an toàn, trả về null nếu fail
 * 
 * @param {string} jsonString - Chuỗi JSON cần parse
 * @param {*} defaultValue - Giá trị mặc định nếu parse fail (default: null)
 * @returns {*} Object được parse hoặc defaultValue
 * 
 * @example
 * safeJsonParse('{"name":"John"}'); // { name: "John" }
 * safeJsonParse('invalid json'); // null
 * safeJsonParse('invalid', {}); // {}
 */
function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Retry function với exponential backoff
 * Thử lại function nếu fail, với delay tăng dần theo cấp số nhân
 * 
 * @param {Function} fn - Async function cần retry
 * @param {number} retries - Số lần retry tối đa (default: 3)
 * @param {number} delay - Delay ban đầu tính bằng ms (default: 1000)
 * @returns {Promise} Promise resolve với kết quả của fn
 * 
 * @example
 * const unstableFetch = async () => {
 *   if (Math.random() < 0.7) throw new Error('Network error');
 *   return 'Success';
 * };
 * const result = await withRetry(unstableFetch, 3, 100);
 */
async function withRetry(fn, retries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;
      
      // Nếu đã hết số lần retry, throw error
      if (attempt === retries) {
        throw new Error(`Failed after ${retries + 1} attempts: ${error.message}`);
      }
      
      // Exponential backoff: delay * 2^attempt
      const backoffDelay = delay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed. Retrying in ${backoffDelay}ms...`);
      
      // Đợi trước khi retry
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError;
}

/**
 * Wrap promise với timeout
 * Promise sẽ reject nếu không hoàn thành trong thời gian quy định
 * 
 * @param {Promise} promise - Promise cần wrap
 * @param {number} ms - Timeout tính bằng milliseconds
 * @param {string} timeoutMessage - Custom timeout message
 * @returns {Promise} Promise với timeout
 * 
 * @example
 * const slowPromise = new Promise(resolve => setTimeout(() => resolve('Done'), 5000));
 * const result = await withTimeout(slowPromise, 1000); // Throws timeout error
 */
function withTimeout(promise, ms, timeoutMessage = 'Operation timed out') {
  return new Promise((resolve, reject) => {
    // Tạo timeout timer
    const timeoutId = setTimeout(() => {
      reject(new Error(`${timeoutMessage} after ${ms}ms`));
    }, ms);
    
    // Thực hiện promise gốc
    promise
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Wrapper cho async function với error handling
 * Tương tự tryCatch nhưng cho async functions
 * 
 * @param {Function} asyncFn - Async function cần wrap
 * @returns {Function} Async function mới với error handling
 * 
 * @example
 * const safeFetch = asyncTryCatch(async (url) => {
 *   const response = await fetch(url);
 *   return await response.json();
 * });
 * const result = await safeFetch('https://api.example.com/data');
 */
function asyncTryCatch(asyncFn) {
  return async function(...args) {
    try {
      const result = await asyncFn(...args);
      return {
        success: true,
        data: result,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack
        }
      };
    }
  };
}

/**
 * Retry với custom condition
 * Chỉ retry nếu error thỏa mãn điều kiện
 * 
 * @param {Function} fn - Async function cần retry
 * @param {Object} options - Options cho retry
 * @param {number} options.maxRetries - Số lần retry tối đa
 * @param {number} options.delay - Delay ban đầu
 * @param {Function} options.shouldRetry - Function kiểm tra có nên retry không
 * @returns {Promise} Promise resolve với kết quả
 * 
 * @example
 * await withConditionalRetry(fetchData, {
 *   maxRetries: 3,
 *   delay: 1000,
 *   shouldRetry: (error) => error.statusCode === 503
 * });
 */
async function withConditionalRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    shouldRetry = () => true
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;
      
      // Kiểm tra có nên retry không
      if (!shouldRetry(error) || attempt === maxRetries) {
        throw error;
      }
      
      const backoffDelay = delay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError;
}

/**
 * Promise.allSettled implementation
 * Đợi tất cả promises hoàn thành (fulfilled hoặc rejected)
 * 
 * @param {Promise[]} promises - Array of promises
 * @returns {Promise<Array>} Array of results với status
 * 
 * @example
 * const results = await allSettled([
 *   Promise.resolve(1),
 *   Promise.reject('error'),
 *   Promise.resolve(3)
 * ]);
 * // [
 * //   { status: 'fulfilled', value: 1 },
 * //   { status: 'rejected', reason: 'error' },
 * //   { status: 'fulfilled', value: 3 }
 * // ]
 */
async function allSettled(promises) {
  return Promise.all(
    promises.map(promise =>
      Promise.resolve(promise)
        .then(value => ({
          status: 'fulfilled',
          value
        }))
        .catch(reason => ({
          status: 'rejected',
          reason
        }))
    )
  );
}

/**
 * Batch processing với error handling
 * Xử lý array items theo batch với error handling cho từng item
 * 
 * @param {Array} items - Array of items to process
 * @param {Function} processFn - Async function xử lý mỗi item
 * @param {number} batchSize - Số lượng items xử lý đồng thời
 * @returns {Promise<Object>} Object chứa successes và failures
 * 
 * @example
 * const { successes, failures } = await batchProcess(
 *   [1, 2, 3, 4, 5],
 *   async (item) => item * 2,
 *   2
 * );
 */
async function batchProcess(items, processFn, batchSize = 5) {
  const results = {
    successes: [],
    failures: []
  };
  
  // Chia items thành các batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Xử lý batch với error handling
    const batchResults = await Promise.allSettled(
      batch.map(item => processFn(item))
    );
    
    // Phân loại kết quả
    batchResults.forEach((result, index) => {
      const item = batch[index];
      if (result.status === 'fulfilled') {
        results.successes.push({
          item,
          result: result.value
        });
      } else {
        results.failures.push({
          item,
          error: result.reason
        });
      }
    });
  }
  
  return results;
}

/**
 * Circuit breaker pattern
 * Ngăn chặn gọi function khi fail quá nhiều lần
 * 
 * @param {Function} fn - Function cần protect
 * @param {Object} options - Circuit breaker options
 * @param {number} options.failureThreshold - Số lần fail trước khi open circuit
 * @param {number} options.resetTimeout - Thời gian đợi trước khi thử lại (ms)
 * @returns {Function} Protected function
 * 
 * @example
 * const protectedFetch = createCircuitBreaker(fetchData, {
 *   failureThreshold: 3,
 *   resetTimeout: 5000
 * });
 */
function createCircuitBreaker(fn, options = {}) {
  const {
    failureThreshold = 5,
    resetTimeout = 60000
  } = options;
  
  let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  let failureCount = 0;
  let nextAttempt = Date.now();
  
  return async function(...args) {
    // Kiểm tra state
    if (state === 'OPEN') {
      if (Date.now() < nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn(...args);
      
      // Reset nếu thành công
      if (state === 'HALF_OPEN') {
        state = 'CLOSED';
        failureCount = 0;
      }
      
      return result;
    } catch (error) {
      failureCount++;
      
      if (failureCount >= failureThreshold) {
        state = 'OPEN';
        nextAttempt = Date.now() + resetTimeout;
      }
      
      throw error;
    }
  };
}

module.exports = {
  tryCatch,
  safeJsonParse,
  withRetry,
  withTimeout,
  asyncTryCatch,
  withConditionalRetry,
  allSettled,
  batchProcess,
  createCircuitBreaker
};
