/**
 * Test suite cho Bài 4.3: Async/Await
 */

const {
  asyncFetchUser,
  sequentialFetch,
  parallelFetch,
  handleErrors,
  handleMultipleErrors,
  retryAsync,
  asyncTimeout,
  waterfallAsync
} = require('../src/bai4_3_async_await');

describe('Bài 4.3: Async/Await', () => {
  
  describe('asyncFetchUser()', () => {
    test('fetch user data thành công', async () => {
      const user = await asyncFetchUser(1);
      expect(user).toEqual({
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        role: 'admin'
      });
    });

    test('fetch nhiều users khác nhau', async () => {
      const user2 = await asyncFetchUser(2);
      const user3 = await asyncFetchUser(3);
      
      expect(user2.id).toBe(2);
      expect(user2.role).toBe('user');
      expect(user3.id).toBe(3);
    });

    test('throw error khi userId không phải số', async () => {
      await expect(asyncFetchUser('abc')).rejects.toThrow('userId phải là số');
    });

    test('throw error khi userId <= 0', async () => {
      await expect(asyncFetchUser(0)).rejects.toThrow('userId phải lớn hơn 0');
      await expect(asyncFetchUser(-1)).rejects.toThrow('userId phải lớn hơn 0');
    });

    test('throw error khi user không tồn tại', async () => {
      await expect(asyncFetchUser(999)).rejects.toThrow('User không tồn tại');
    });
  });

  describe('sequentialFetch()', () => {
    test('fetch các URLs theo thứ tự', async () => {
      const urls = [
        'https://api1.com',
        'https://api2.com',
        'https://api3.com'
      ];
      
      const startTime = Date.now();
      const results = await sequentialFetch(urls);
      const duration = Date.now() - startTime;
      
      expect(results).toHaveLength(3);
      expect(results[0].url).toBe('https://api1.com');
      expect(results[1].url).toBe('https://api2.com');
      expect(results[2].url).toBe('https://api3.com');
      
      // Sequential nên mất ít nhất 300ms (3 * 100ms)
      expect(duration).toBeGreaterThanOrEqual(290);
    });

    test('throw error nếu urls không phải array', async () => {
      await expect(sequentialFetch('not-array')).rejects.toThrow('urls phải là một array');
    });

    test('throw error nếu một URL fail', async () => {
      const urls = [
        'https://api1.com',
        'https://fail.com',
        'https://api3.com'
      ];
      
      await expect(sequentialFetch(urls)).rejects.toThrow('Failed to fetch');
    });

    test('xử lý mảng rỗng', async () => {
      const results = await sequentialFetch([]);
      expect(results).toEqual([]);
    });

    test('throw error nếu URL không hợp lệ', async () => {
      await expect(sequentialFetch([null])).rejects.toThrow('URL không hợp lệ');
    });
  });

  describe('parallelFetch()', () => {
    test('fetch các URLs song song', async () => {
      const urls = [
        'https://api1.com',
        'https://api2.com',
        'https://api3.com'
      ];
      
      const startTime = Date.now();
      const results = await parallelFetch(urls);
      const duration = Date.now() - startTime;
      
      expect(results).toHaveLength(3);
      expect(results[0].url).toBe('https://api1.com');
      expect(results[1].url).toBe('https://api2.com');
      expect(results[2].url).toBe('https://api3.com');
      
      // Parallel nên mất khoảng 100ms (không phải 300ms)
      expect(duration).toBeLessThan(200);
    });

    test('parallel nhanh hơn sequential', async () => {
      const urls = ['https://api1.com', 'https://api2.com', 'https://api3.com'];
      
      const seqStart = Date.now();
      await sequentialFetch(urls);
      const seqDuration = Date.now() - seqStart;
      
      const parStart = Date.now();
      await parallelFetch(urls);
      const parDuration = Date.now() - parStart;
      
      expect(parDuration).toBeLessThan(seqDuration);
    });

    test('throw error nếu urls không phải array', async () => {
      await expect(parallelFetch('not-array')).rejects.toThrow('urls phải là một array');
    });

    test('throw error nếu một URL fail', async () => {
      const urls = [
        'https://api1.com',
        'https://fail.com',
        'https://api3.com'
      ];
      
      await expect(parallelFetch(urls)).rejects.toThrow('Failed to fetch');
    });

    test('xử lý mảng rỗng', async () => {
      const results = await parallelFetch([]);
      expect(results).toEqual([]);
    });
  });

  describe('handleErrors()', () => {
    test('trả về success khi operation thành công', async () => {
      const result = await handleErrors(false);
      
      expect(result).toEqual({
        success: true,
        message: 'Operation succeeded',
        error: null
      });
    });

    test('catch error và trả về error info', async () => {
      const result = await handleErrors(true);
      
      expect(result).toEqual({
        success: false,
        message: 'Caught error',
        error: 'Operation failed'
      });
    });

    test('không throw error ra ngoài', async () => {
      // Nếu throw ra ngoài, test này sẽ fail
      const result = await handleErrors(true);
      expect(result.success).toBe(false);
    });
  });

  describe('handleMultipleErrors()', () => {
    test('xử lý nhiều operations', async () => {
      const results = await handleMultipleErrors([false, false, false]);
      
      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
    });

    test('tiếp tục xử lý sau khi gặp error', async () => {
      const results = await handleMultipleErrors([false, true, false]);
      
      expect(results).toHaveLength(3);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toBe('Operation failed');
      expect(results[2].success).toBe(true);
    });

    test('xử lý nhiều errors liên tiếp', async () => {
      const results = await handleMultipleErrors([true, true, true]);
      
      expect(results).toHaveLength(3);
      expect(results.every(r => !r.success)).toBe(true);
    });

    test('throw error nếu failFlags không phải array', async () => {
      await expect(handleMultipleErrors('not-array')).rejects.toThrow('failFlags phải là một array');
    });

    test('xử lý mảng rỗng', async () => {
      const results = await handleMultipleErrors([]);
      expect(results).toEqual([]);
    });
  });

  describe('retryAsync()', () => {
    test('thành công ở lần đầu tiên', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await retryAsync(operation, 3, 10);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    test('retry khi fail và cuối cùng thành công', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');
      
      const result = await retryAsync(operation, 3, 10);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    test('throw error sau khi hết số lần retry', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Always fail'));
      
      await expect(retryAsync(operation, 2, 10)).rejects.toThrow('Failed after 3 attempts');
      expect(operation).toHaveBeenCalledTimes(3); // 1 lần đầu + 2 lần retry
    });

    test('throw error nếu operation không phải function', async () => {
      await expect(retryAsync('not-function', 3, 10)).rejects.toThrow('operation phải là một function');
    });

    test('throw error nếu maxRetries không hợp lệ', async () => {
      const operation = jest.fn();
      await expect(retryAsync(operation, -1, 10)).rejects.toThrow('maxRetries phải là số không âm');
    });

    test('chờ delay giữa các lần retry', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValue('success');
      
      const startTime = Date.now();
      await retryAsync(operation, 2, 50);
      const duration = Date.now() - startTime;
      
      // Có 1 lần retry, nên phải chờ ít nhất 50ms
      expect(duration).toBeGreaterThanOrEqual(45);
    });

    test('không retry nếu maxRetries = 0', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Fail'));
      
      await expect(retryAsync(operation, 0, 10)).rejects.toThrow('Failed after 1 attempts');
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe('asyncTimeout()', () => {
    test('hoàn thành trước timeout', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('done'), 50));
      
      const result = await asyncTimeout(promise, 200);
      expect(result).toBe('done');
    });

    test('throw error khi timeout', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('done'), 200));
      
      await expect(asyncTimeout(promise, 50)).rejects.toThrow('Operation timeout after 50ms');
    });

    test('throw error nếu tham số đầu không phải Promise', async () => {
      await expect(asyncTimeout('not-promise', 100)).rejects.toThrow('Tham số đầu tiên phải là Promise');
    });

    test('throw error nếu timeoutMs không hợp lệ', async () => {
      const promise = Promise.resolve('done');
      await expect(asyncTimeout(promise, 0)).rejects.toThrow('timeoutMs phải là số dương');
      await expect(asyncTimeout(promise, -100)).rejects.toThrow('timeoutMs phải là số dương');
    });

    test('xử lý promise reject', async () => {
      const promise = Promise.reject(new Error('Promise error'));
      
      await expect(asyncTimeout(promise, 100)).rejects.toThrow('Promise error');
    });
  });

  describe('waterfallAsync()', () => {
    test('thực hiện tasks theo thứ tự và truyền kết quả', async () => {
      const tasks = [
        async (value) => value + 1,
        async (value) => value * 2,
        async (value) => value - 3
      ];
      
      const result = await waterfallAsync(tasks, 5);
      // ((5 + 1) * 2) - 3 = 9
      expect(result).toBe(9);
    });

    test('hoạt động với async operations', async () => {
      const tasks = [
        async (value) => {
          await new Promise(resolve => setTimeout(resolve, 50));
          return value + 10;
        },
        async (value) => {
          await new Promise(resolve => setTimeout(resolve, 50));
          return value * 2;
        }
      ];
      
      const result = await waterfallAsync(tasks, 5);
      // (5 + 10) * 2 = 30
      expect(result).toBe(30);
    });

    test('throw error nếu tasks không phải array', async () => {
      await expect(waterfallAsync('not-array', 0)).rejects.toThrow('tasks phải là một array');
    });

    test('throw error nếu task không phải function', async () => {
      const tasks = [
        async (v) => v + 1,
        'not-function'
      ];
      
      await expect(waterfallAsync(tasks, 5)).rejects.toThrow('Mỗi task phải là một function');
    });

    test('xử lý mảng rỗng', async () => {
      const result = await waterfallAsync([], 42);
      expect(result).toBe(42);
    });

    test('dừng lại khi gặp error', async () => {
      const tasks = [
        async (value) => value + 1,
        async (value) => {
          throw new Error('Task error');
        },
        async (value) => value * 2 // Không được thực hiện
      ];
      
      await expect(waterfallAsync(tasks, 5)).rejects.toThrow('Task error');
    });

    test('hoạt động với các kiểu dữ liệu khác nhau', async () => {
      const tasks = [
        async (value) => ({ ...value, step1: true }),
        async (value) => ({ ...value, step2: true }),
        async (value) => ({ ...value, step3: true })
      ];
      
      const result = await waterfallAsync(tasks, { initial: true });
      expect(result).toEqual({
        initial: true,
        step1: true,
        step2: true,
        step3: true
      });
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    test('kết hợp asyncFetchUser với handleErrors', async () => {
      const fetchWithErrorHandling = async (userId) => {
        try {
          const user = await asyncFetchUser(userId);
          return { success: true, user };
        } catch (error) {
          return { success: false, error: error.message };
        }
      };
      
      const result1 = await fetchWithErrorHandling(1);
      expect(result1.success).toBe(true);
      expect(result1.user.id).toBe(1);
      
      const result2 = await fetchWithErrorHandling(999);
      expect(result2.success).toBe(false);
      expect(result2.error).toContain('không tồn tại');
    });

    test('kết hợp parallelFetch với retry', async () => {
      let attemptCount = 0;
      const fetchWithRetry = async () => {
        attemptCount++;
        if (attemptCount < 2) {
          throw new Error('Network error');
        }
        return parallelFetch(['https://api1.com', 'https://api2.com']);
      };
      
      const results = await retryAsync(fetchWithRetry, 3, 10);
      expect(results).toHaveLength(2);
      expect(attemptCount).toBe(2);
    });

    test('kết hợp waterfallAsync với sequentialFetch', async () => {
      const tasks = [
        async (urls) => {
          const results = await sequentialFetch(urls);
          return results.map(r => r.url);
        },
        async (urls) => urls.filter(url => url.includes('api')),
        async (urls) => urls.length
      ];
      
      const initialUrls = [
        'https://api1.com',
        'https://api2.com',
        'https://test.com'
      ];
      
      const count = await waterfallAsync(tasks, initialUrls);
      expect(count).toBe(2); // Chỉ 2 URLs có 'api'
    });
  });
});
