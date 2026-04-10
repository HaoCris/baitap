/**
 * Bài 4.2: Promises
 * 
 * Thực hành làm việc với Promises trong JavaScript
 */

/**
 * Tạo Promise delay sau một khoảng thời gian
 * @param {number} ms - Số milliseconds để delay
 * @returns {Promise<void>} Promise resolve sau ms milliseconds
 * 
 * @example
 * await wait(1000); // Đợi 1 giây
 */
function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Mô phỏng fetch user data từ server
 * @param {number} userId - ID của user
 * @returns {Promise<Object>} Promise resolve với user data
 * 
 * @example
 * const user = await fetchUserData(1);
 * // { id: 1, name: 'User 1', email: 'user1@example.com' }
 */
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    // Mô phỏng network delay
    setTimeout(() => {
      if (userId <= 0) {
        reject(new Error('Invalid user ID'));
        return;
      }

      // Mô phỏng user không tồn tại
      if (userId > 100) {
        reject(new Error('User not found'));
        return;
      }

      resolve({
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        createdAt: new Date().toISOString()
      });
    }, 100); // Delay 100ms để mô phỏng network
  });
}

/**
 * Fetch nhiều users cùng lúc sử dụng Promise.all
 * @param {number[]} userIds - Array các user IDs
 * @returns {Promise<Object[]>} Promise resolve với array users
 * 
 * @example
 * const users = await fetchMultipleUsers([1, 2, 3]);
 */
function fetchMultipleUsers(userIds) {
  if (!Array.isArray(userIds)) {
    return Promise.reject(new Error('userIds must be an array'));
  }

  if (userIds.length === 0) {
    return Promise.resolve([]);
  }

  const promises = userIds.map(id => fetchUserData(id));
  return Promise.all(promises);
}

/**
 * Fetch user đầu tiên resolve sử dụng Promise.race
 * @param {number[]} userIds - Array các user IDs
 * @returns {Promise<Object>} Promise resolve với user đầu tiên
 * 
 * @example
 * const firstUser = await fetchFirstUser([1, 2, 3]);
 */
function fetchFirstUser(userIds) {
  if (!Array.isArray(userIds)) {
    return Promise.reject(new Error('userIds must be an array'));
  }

  if (userIds.length === 0) {
    return Promise.reject(new Error('userIds cannot be empty'));
  }

  const promises = userIds.map(id => fetchUserData(id));
  return Promise.race(promises);
}

/**
 * Thử lại operation nếu fail
 * @param {Function} operation - Async function cần thực hiện
 * @param {number} maxRetries - Số lần thử lại tối đa
 * @param {number} [delay=1000] - Delay giữa các lần thử (ms)
 * @returns {Promise<*>} Promise với kết quả của operation
 * 
 * @example
 * const result = await retryOperation(() => fetchUserData(1), 3);
 */
async function retryOperation(operation, maxRetries, delay = 1000) {
  if (typeof operation !== 'function') {
    throw new Error('Operation must be a function');
  }

  if (maxRetries < 1) {
    throw new Error('maxRetries must be at least 1');
  }

  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        await wait(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Fetch với timeout
 * @param {Promise} promise - Promise cần wrap
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} Promise với timeout
 * 
 * @example
 * const result = await withTimeout(fetchUserData(1), 5000);
 */
function withTimeout(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Fetch all nhưng bỏ qua errors (Promise.allSettled alternative)
 * @param {Promise[]} promises - Array các promises
 * @returns {Promise<Object[]>} Array với status và value/reason
 * 
 * @example
 * const results = await fetchAllSettled([promise1, promise2]);
 * // [{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: ... }]
 */
function fetchAllSettled(promises) {
  return Promise.all(
    promises.map(promise =>
      promise
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
    )
  );
}

/**
 * Thực hiện promises theo thứ tự (sequential)
 * @param {Function[]} promiseFns - Array các functions trả về Promise
 * @returns {Promise<*[]>} Array kết quả theo thứ tự
 * 
 * @example
 * const results = await sequential([
 *   () => fetchUserData(1),
 *   () => fetchUserData(2),
 *   () => fetchUserData(3)
 * ]);
 */
async function sequential(promiseFns) {
  const results = [];

  for (const fn of promiseFns) {
    const result = await fn();
    results.push(result);
  }

  return results;
}

/**
 * Tạo Promise có thể cancel
 * @param {Function} executor - Promise executor function
 * @returns {Object} Object với promise và cancel function
 * 
 * @example
 * const { promise, cancel } = createCancellablePromise((resolve) => {
 *   setTimeout(() => resolve('done'), 1000);
 * });
 * cancel(); // Cancel the promise
 */
function createCancellablePromise(executor) {
  let cancel;

  const promise = new Promise((resolve, reject) => {
    cancel = () => reject(new Error('Promise cancelled'));
    executor(resolve, reject);
  });

  return { promise, cancel };
}

module.exports = {
  wait,
  fetchUserData,
  fetchMultipleUsers,
  fetchFirstUser,
  retryOperation,
  withTimeout,
  fetchAllSettled,
  sequential,
  createCancellablePromise
};
