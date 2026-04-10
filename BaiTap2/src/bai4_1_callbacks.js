/**
 * Bài 4.1: Callbacks
 * 
 * Thực hành về callback patterns trong JavaScript
 */

/**
 * Gửi lời chào sau một khoảng thời gian delay
 * 
 * @param {string} name - Tên người được chào
 * @param {number} delay - Thời gian delay (ms)
 * @param {Function} callback - Callback nhận lời chào
 * 
 * @example
 * delayedGreeting('Alice', 1000, (greeting) => {
 *   console.log(greeting); // "Hello, Alice!" sau 1 giây
 * });
 */
function delayedGreeting(name, delay, callback) {
  // Validate inputs
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new TypeError('Delay must be a non-negative number');
  }
  
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function');
  }

  // Delay rồi gọi callback
  setTimeout(() => {
    const greeting = `Hello, ${name}!`;
    callback(greeting);
  }, delay);
}

/**
 * Mô phỏng đọc file với callback pattern (error-first callback)
 * 
 * @param {string} filename - Tên file cần đọc
 * @param {Function} callback - Callback với signature (error, data)
 * 
 * @example
 * readFileSimulation('data.txt', (error, data) => {
 *   if (error) {
 *     console.error(error);
 *   } else {
 *     console.log(data);
 *   }
 * });
 */
function readFileSimulation(filename, callback) {
  // Validate inputs
  if (typeof filename !== 'string') {
    throw new TypeError('Filename must be a string');
  }
  
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function');
  }

  // Mô phỏng async operation
  setTimeout(() => {
    // Kiểm tra các trường hợp lỗi
    if (!filename) {
      return callback(new Error('Filename cannot be empty'), null);
    }

    if (!filename.includes('.')) {
      return callback(new Error('Invalid filename format'), null);
    }

    // Mô phỏng file không tồn tại
    if (filename === 'notfound.txt') {
      return callback(new Error('File not found'), null);
    }

    // Mô phỏng permission denied
    if (filename === 'secret.txt') {
      return callback(new Error('Permission denied'), null);
    }

    // Success case
    const mockData = `This is the content of ${filename}`;
    callback(null, mockData);
  }, 100);
}

/**
 * Mô phỏng callback hell với 3 async operations liên tiếp
 * Minh họa vấn đề của callback nesting
 * 
 * @param {Function} callback - Callback nhận kết quả cuối cùng
 * 
 * @example
 * callbackHell((error, result) => {
 *   if (error) {
 *     console.error(error);
 *   } else {
 *     console.log(result); // "Step 1 -> Step 2 -> Step 3"
 *   }
 * });
 */
function callbackHell(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function');
  }

  // Step 1
  setTimeout(() => {
    const step1Result = 'Step 1';

    // Step 2 (nested trong Step 1)
    setTimeout(() => {
      const step2Result = step1Result + ' -> Step 2';

      // Step 3 (nested trong Step 2)
      setTimeout(() => {
        const step3Result = step2Result + ' -> Step 3';
        
        // Gọi callback với kết quả cuối cùng
        callback(null, step3Result);
      }, 100);
    }, 100);
  }, 100);
}

/**
 * Mô phỏng callback hell với khả năng xử lý lỗi
 * 
 * @param {Function} callback - Callback (error, result)
 * @param {boolean} shouldFail - Có nên fail ở step 2 không
 */
function callbackHellWithError(callback, shouldFail = false) {
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function');
  }

  // Step 1
  setTimeout(() => {
    const step1Result = 'Step 1';

    // Step 2
    setTimeout(() => {
      // Mô phỏng error ở step 2
      if (shouldFail) {
        return callback(new Error('Failed at Step 2'), null);
      }

      const step2Result = step1Result + ' -> Step 2';

      // Step 3
      setTimeout(() => {
        const step3Result = step2Result + ' -> Step 3';
        callback(null, step3Result);
      }, 100);
    }, 100);
  }, 100);
}

/**
 * Thực hiện nhiều async operations song song và gọi callback khi tất cả hoàn thành
 * 
 * @param {Function[]} tasks - Mảng các async tasks
 * @param {Function} callback - Callback (error, results)
 */
function parallelTasks(tasks, callback) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('Tasks must be an array');
  }

  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function');
  }

  const results = [];
  let completed = 0;
  let hasError = false;

  if (tasks.length === 0) {
    return callback(null, results);
  }

  tasks.forEach((task, index) => {
    task((error, result) => {
      if (hasError) return; // Đã có error, bỏ qua

      if (error) {
        hasError = true;
        return callback(error, null);
      }

      results[index] = result;
      completed++;

      if (completed === tasks.length) {
        callback(null, results);
      }
    });
  });
}

/**
 * Thực hiện async operations theo thứ tự (waterfall)
 * 
 * @param {Function[]} tasks - Mảng các tasks, mỗi task nhận result của task trước
 * @param {Function} callback - Callback (error, finalResult)
 */
function waterfall(tasks, callback) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('Tasks must be an array');
  }

  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function');
  }

  if (tasks.length === 0) {
    return callback(null, null);
  }

  let currentIndex = 0;

  function next(error, result) {
    if (error) {
      return callback(error, null);
    }

    if (currentIndex >= tasks.length) {
      return callback(null, result);
    }

    const currentTask = tasks[currentIndex];
    currentIndex++;

    // Task đầu tiên không nhận input
    if (currentIndex === 1) {
      currentTask(next);
    } else {
      currentTask(result, next);
    }
  }

  next(null, null);
}

/**
 * Retry async operation với callback
 * 
 * @param {Function} operation - Operation cần retry
 * @param {number} maxRetries - Số lần retry tối đa
 * @param {Function} callback - Callback (error, result)
 */
function retryWithCallback(operation, maxRetries, callback) {
  if (typeof operation !== 'function') {
    throw new TypeError('Operation must be a function');
  }

  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function');
  }

  let attempts = 0;

  function attempt() {
    attempts++;
    
    operation((error, result) => {
      if (error) {
        if (attempts < maxRetries) {
          // Retry
          return setTimeout(attempt, 100);
        } else {
          // Hết số lần retry
          return callback(new Error(`Failed after ${maxRetries} attempts: ${error.message}`), null);
        }
      }

      // Success
      callback(null, result);
    });
  }

  attempt();
}

// Export
module.exports = {
  delayedGreeting,
  readFileSimulation,
  callbackHell,
  callbackHellWithError,
  parallelTasks,
  waterfall,
  retryWithCallback
};
