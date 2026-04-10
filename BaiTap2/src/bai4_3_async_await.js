/**
 * Bài 4.3: Async/Await
 * 
 * Các bài tập về async/await pattern trong JavaScript
 */

/**
 * Mô phỏng API fetch user data với Promise
 * @param {number} userId - ID của user
 * @returns {Promise<Object>} User data
 */
function fetchUserDataPromise(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof userId !== 'number') {
        reject(new Error('userId phải là số'));
      } else if (userId <= 0) {
        reject(new Error('userId phải lớn hơn 0'));
      } else if (userId === 999) {
        reject(new Error('User không tồn tại'));
      } else {
        resolve({
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          role: userId === 1 ? 'admin' : 'user'
        });
      }
    }, 100);
  });
}

/**
 * Fetch user data sử dụng async/await
 * Viết lại fetchUserData từ Bài 4.2 sử dụng async/await
 * 
 * @param {number} userId - ID của user cần fetch
 * @returns {Promise<Object>} Promise resolve với user data
 * @throws {Error} Nếu userId không hợp lệ hoặc user không tồn tại
 * 
 * @example
 * const user = await asyncFetchUser(1);
 * console.log(user); // { id: 1, name: 'User 1', email: 'user1@example.com', role: 'admin' }
 */
async function asyncFetchUser(userId) {
  try {
    const userData = await fetchUserDataPromise(userId);
    return userData;
  } catch (error) {
    throw error;
  }
}

/**
 * Mô phỏng fetch URL với delay
 * @param {string} url - URL cần fetch
 * @param {number} delay - Độ trễ (ms)
 * @returns {Promise<Object>} Response data
 */
function mockFetch(url, delay = 100) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!url || typeof url !== 'string') {
        reject(new Error('URL không hợp lệ'));
      } else if (url.includes('fail')) {
        reject(new Error(`Failed to fetch ${url}`));
      } else {
        resolve({
          url,
          data: `Data from ${url}`,
          status: 200,
          timestamp: Date.now()
        });
      }
    }, delay);
  });
}

/**
 * Fetch các URLs theo thứ tự (sequential)
 * Chờ từng request hoàn thành trước khi fetch request tiếp theo
 * 
 * @param {string[]} urls - Mảng các URLs cần fetch
 * @returns {Promise<Object[]>} Promise resolve với mảng kết quả theo đúng thứ tự
 * @throws {Error} Nếu urls không phải array hoặc có URL bị lỗi
 * 
 * @example
 * const results = await sequentialFetch([
 *   'https://api.example.com/users',
 *   'https://api.example.com/posts'
 * ]);
 */
async function sequentialFetch(urls) {
  if (!Array.isArray(urls)) {
    throw new Error('urls phải là một array');
  }

  const results = [];
  
  for (const url of urls) {
    try {
      const result = await mockFetch(url);
      results.push(result);
    } catch (error) {
      throw error;
    }
  }
  
  return results;
}

/**
 * Fetch các URLs song song (parallel)
 * Thực hiện tất cả requests cùng lúc và chờ tất cả hoàn thành
 * 
 * @param {string[]} urls - Mảng các URLs cần fetch
 * @returns {Promise<Object[]>} Promise resolve với mảng kết quả
 * @throws {Error} Nếu urls không phải array hoặc có bất kỳ URL nào bị lỗi
 * 
 * @example
 * const results = await parallelFetch([
 *   'https://api.example.com/users',
 *   'https://api.example.com/posts',
 *   'https://api.example.com/comments'
 * ]);
 */
async function parallelFetch(urls) {
  if (!Array.isArray(urls)) {
    throw new Error('urls phải là một array');
  }

  try {
    const promises = urls.map(url => mockFetch(url));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw error;
  }
}

/**
 * Mô phỏng operation có thể fail
 * @param {boolean} shouldFail - Có nên fail không
 * @param {number} delay - Độ trễ (ms)
 * @returns {Promise<string>} Result message
 */
function riskyOperation(shouldFail = false, delay = 50) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Operation failed'));
      } else {
        resolve('Operation succeeded');
      }
    }, delay);
  });
}

/**
 * Xử lý errors với try/catch trong async function
 * Demo các patterns xử lý errors khác nhau
 * 
 * @param {boolean} shouldFail - Có nên tạo error không
 * @returns {Promise<Object>} Promise resolve với kết quả xử lý
 * 
 * @example
 * // Success case
 * const result = await handleErrors(false);
 * // { success: true, message: 'Operation succeeded', error: null }
 * 
 * // Error case
 * const result = await handleErrors(true);
 * // { success: false, message: 'Caught error', error: 'Operation failed' }
 */
async function handleErrors(shouldFail = false) {
  try {
    const result = await riskyOperation(shouldFail);
    return {
      success: true,
      message: result,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      message: 'Caught error',
      error: error.message
    };
  }
}

/**
 * Xử lý multiple async operations với error handling
 * Tiếp tục xử lý các operations khác ngay cả khi một operation fail
 * 
 * @param {boolean[]} failFlags - Mảng boolean cho biết operation nào sẽ fail
 * @returns {Promise<Object[]>} Promise resolve với mảng kết quả
 * 
 * @example
 * const results = await handleMultipleErrors([false, true, false]);
 * // [
 * //   { success: true, result: 'Operation succeeded' },
 * //   { success: false, error: 'Operation failed' },
 * //   { success: true, result: 'Operation succeeded' }
 * // ]
 */
async function handleMultipleErrors(failFlags) {
  if (!Array.isArray(failFlags)) {
    throw new Error('failFlags phải là một array');
  }

  const results = [];
  
  for (const shouldFail of failFlags) {
    try {
      const result = await riskyOperation(shouldFail);
      results.push({ success: true, result });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
}

/**
 * Retry operation với async/await
 * Thử lại operation nếu fail, với số lần retry tối đa
 * 
 * @param {Function} operation - Async function cần thực hiện
 * @param {number} maxRetries - Số lần retry tối đa
 * @param {number} delay - Độ trễ giữa các lần retry (ms)
 * @returns {Promise<any>} Promise resolve với kết quả của operation
 * @throws {Error} Nếu operation fail sau tất cả các lần retry
 * 
 * @example
 * let attempts = 0;
 * const operation = async () => {
 *   attempts++;
 *   if (attempts < 3) throw new Error('Fail');
 *   return 'Success';
 * };
 * const result = await retryAsync(operation, 3, 100);
 */
async function retryAsync(operation, maxRetries = 3, delay = 1000) {
  if (typeof operation !== 'function') {
    throw new Error('operation phải là một function');
  }
  
  if (typeof maxRetries !== 'number' || maxRetries < 0) {
    throw new Error('maxRetries phải là số không âm');
  }

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Đợi trước khi retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries + 1} attempts: ${lastError.message}`);
}

/**
 * Async function với timeout
 * Wrap async operation với timeout, throw error nếu quá thời gian
 * 
 * @param {Promise} promise - Promise cần thực hiện
 * @param {number} timeoutMs - Timeout (ms)
 * @returns {Promise<any>} Promise resolve với kết quả hoặc reject nếu timeout
 * @throws {Error} Nếu operation timeout
 * 
 * @example
 * const slowOperation = new Promise(resolve => setTimeout(() => resolve('done'), 2000));
 * await asyncTimeout(slowOperation, 1000); // Throws timeout error
 */
async function asyncTimeout(promise, timeoutMs) {
  if (!(promise instanceof Promise)) {
    throw new Error('Tham số đầu tiên phải là Promise');
  }
  
  if (typeof timeoutMs !== 'number' || timeoutMs <= 0) {
    throw new Error('timeoutMs phải là số dương');
  }

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Waterfall pattern với async/await
 * Thực hiện các async functions theo thứ tự, truyền kết quả từ function trước sang function sau
 * 
 * @param {Function[]} tasks - Mảng các async functions
 * @param {any} initialValue - Giá trị khởi tạo cho task đầu tiên
 * @returns {Promise<any>} Promise resolve với kết quả cuối cùng
 * @throws {Error} Nếu tasks không phải array hoặc có task bị lỗi
 * 
 * @example
 * const tasks = [
 *   async (value) => value + 1,
 *   async (value) => value * 2,
 *   async (value) => value - 3
 * ];
 * const result = await waterfallAsync(tasks, 5);
 * // ((5 + 1) * 2) - 3 = 9
 */
async function waterfallAsync(tasks, initialValue) {
  if (!Array.isArray(tasks)) {
    throw new Error('tasks phải là một array');
  }

  let result = initialValue;
  
  for (const task of tasks) {
    if (typeof task !== 'function') {
      throw new Error('Mỗi task phải là một function');
    }
    result = await task(result);
  }
  
  return result;
}

module.exports = {
  asyncFetchUser,
  sequentialFetch,
  parallelFetch,
  handleErrors,
  handleMultipleErrors,
  retryAsync,
  asyncTimeout,
  waterfallAsync
};
