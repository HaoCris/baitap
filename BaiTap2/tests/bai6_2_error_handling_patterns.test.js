/**
 * Test suite cho Bài 6.2: Error Handling Patterns
 */

const {
  tryCatch,
  safeJsonParse,
  withRetry,
  withTimeout,
  asyncTryCatch,
  withConditionalRetry,
  allSettled,
  batchProcess,
  createCircuitBreaker
} = require('../src/bai6_2_error_handling_patterns');

describe('Bài 6.2: Error Handling Patterns', () => {
  
  describe('tryCatch()', () => {
    test('trả về success: true nếu không có error', () => {
      const safeFn = tryCatch((a, b) => a + b);
      const result = safeFn(2, 3);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe(5);
      expect(result.error).toBeNull();
    });

    test('trả về success: false nếu có error', () => {
      const safeFn = tryCatch(() => {
        throw new Error('Test error');
      });
      const result = safeFn();
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error.message).toBe('Test error');
    });

    test('bắt TypeError', () => {
      const safeFn = tryCatch((obj) => obj.nonExistent.property);
      const result = safeFn(null);
      
      expect(result.success).toBe(false);
      expect(result.error.name).toBe('TypeError');
    });

    test('pass arguments đúng', () => {
      const safeFn = tryCatch((a, b, c) => a + b + c);
      const result = safeFn(1, 2, 3);
      
      expect(result.data).toBe(6);
    });

    test('bắt ReferenceError', () => {
      const safeFn = tryCatch(() => {
        return undefinedVariable; // eslint-disable-line
      });
      const result = safeFn();
      
      expect(result.success).toBe(false);
      expect(result.error.name).toBe('ReferenceError');
    });

    test('include stack trace', () => {
      const safeFn = tryCatch(() => {
        throw new Error('Test');
      });
      const result = safeFn();
      
      expect(result.error.stack).toBeDefined();
    });
  });

  describe('safeJsonParse()', () => {
    test('parse valid JSON string', () => {
      const result = safeJsonParse('{"name":"John","age":30}');
      
      expect(result).toEqual({ name: 'John', age: 30 });
    });

    test('trả về null nếu JSON invalid', () => {
      const result = safeJsonParse('invalid json');
      
      expect(result).toBeNull();
    });

    test('trả về defaultValue nếu parse fail', () => {
      const result = safeJsonParse('invalid', { default: true });
      
      expect(result).toEqual({ default: true });
    });

    test('parse array JSON', () => {
      const result = safeJsonParse('[1,2,3]');
      
      expect(result).toEqual([1, 2, 3]);
    });

    test('parse string JSON', () => {
      const result = safeJsonParse('"hello"');
      
      expect(result).toBe('hello');
    });

    test('parse number JSON', () => {
      const result = safeJsonParse('42');
      
      expect(result).toBe(42);
    });

    test('parse boolean JSON', () => {
      const result = safeJsonParse('true');
      
      expect(result).toBe(true);
    });

    test('parse null JSON', () => {
      const result = safeJsonParse('null');
      
      expect(result).toBeNull();
    });

    test('xử lý empty string', () => {
      const result = safeJsonParse('');
      
      expect(result).toBeNull();
    });

    test('xử lý undefined input', () => {
      const result = safeJsonParse(undefined);
      
      expect(result).toBeNull();
    });

    test('parse nested object', () => {
      const json = '{"user":{"name":"John","address":{"city":"NYC"}}}';
      const result = safeJsonParse(json);
      
      expect(result.user.address.city).toBe('NYC');
    });
  });

  describe('withRetry()', () => {
    test('trả về kết quả nếu thành công ngay lần đầu', async () => {
      const fn = jest.fn(async () => 'success');
      
      const result = await withRetry(fn, 3, 100);
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('retry khi fail và thành công', async () => {
      let attemptCount = 0;
      const fn = jest.fn(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Fail');
        }
        return 'success';
      });
      
      const result = await withRetry(fn, 3, 10);
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    test('throw error sau khi hết retries', async () => {
      const fn = jest.fn(async () => {
        throw new Error('Always fail');
      });
      
      await expect(withRetry(fn, 2, 10)).rejects.toThrow('Failed after 3 attempts');
      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    test('exponential backoff delay', async () => {
      const delays = [];
      const originalSetTimeout = setTimeout;
      
      global.setTimeout = jest.fn((fn, delay) => {
        delays.push(delay);
        return originalSetTimeout(fn, 0);
      });
      
      const fn = jest.fn(async () => {
        throw new Error('Fail');
      });
      
      try {
        await withRetry(fn, 2, 100);
      } catch (e) {
        // Expected to fail
      }
      
      // Delays: 100 * 2^0 = 100, 100 * 2^1 = 200
      expect(delays).toContain(100);
      expect(delays).toContain(200);
      
      global.setTimeout = originalSetTimeout;
    });

    test('default retries = 3', async () => {
      const fn = jest.fn(async () => {
        throw new Error('Fail');
      });
      
      try {
        await withRetry(fn, 3, 10); // Use small delay for testing
      } catch (e) {
        // Expected
      }
      
      expect(fn).toHaveBeenCalledTimes(4); // initial + 3 retries
    });

    test('default delay = 1000', async () => {
      let attempt = 0;
      const fn = async () => {
        attempt++;
        if (attempt < 2) {
          throw new Error('Fail');
        }
        return 'success';
      };
      
      const result = await withRetry(fn);
      expect(result).toBe('success');
    });
  });

  describe('withTimeout()', () => {
    test('resolve promise nếu hoàn thành trước timeout', async () => {
      const promise = new Promise(resolve => {
        setTimeout(() => resolve('success'), 10);
      });
      
      const result = await withTimeout(promise, 100);
      
      expect(result).toBe('success');
    });

    test('reject nếu timeout', async () => {
      const promise = new Promise(resolve => {
        setTimeout(() => resolve('too late'), 200);
      });
      
      await expect(withTimeout(promise, 50)).rejects.toThrow('Operation timed out after 50ms');
    });

    test('custom timeout message', async () => {
      const promise = new Promise(resolve => {
        setTimeout(() => resolve('done'), 100);
      });
      
      await expect(
        withTimeout(promise, 10, 'Custom timeout')
      ).rejects.toThrow('Custom timeout after 10ms');
    });

    test('reject với original error nếu promise reject', async () => {
      const promise = Promise.reject(new Error('Original error'));
      
      await expect(withTimeout(promise, 100)).rejects.toThrow('Original error');
    });

    test('clear timeout nếu promise resolve', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      const promise = Promise.resolve('success');
      await withTimeout(promise, 100);
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    test('clear timeout nếu promise reject', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      const promise = Promise.reject(new Error('Fail'));
      
      try {
        await withTimeout(promise, 100);
      } catch (e) {
        // Expected
      }
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('asyncTryCatch()', () => {
    test('trả về success: true với async function thành công', async () => {
      const safeFn = asyncTryCatch(async (x) => x * 2);
      const result = await safeFn(5);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe(10);
      expect(result.error).toBeNull();
    });

    test('trả về success: false nếu async function throw error', async () => {
      const safeFn = asyncTryCatch(async () => {
        throw new Error('Async error');
      });
      const result = await safeFn();
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error.message).toBe('Async error');
    });

    test('pass arguments đúng', async () => {
      const safeFn = asyncTryCatch(async (a, b) => a + b);
      const result = await safeFn(3, 4);
      
      expect(result.data).toBe(7);
    });

    test('bắt promise rejection', async () => {
      const safeFn = asyncTryCatch(async () => {
        return Promise.reject(new Error('Rejected'));
      });
      const result = await safeFn();
      
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Rejected');
    });
  });

  describe('withConditionalRetry()', () => {
    test('retry nếu shouldRetry trả về true', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) {
          const error = new Error('Retry me');
          error.statusCode = 503;
          throw error;
        }
        return 'success';
      };
      
      const result = await withConditionalRetry(fn, {
        maxRetries: 3,
        delay: 10,
        shouldRetry: (error) => error.statusCode === 503
      });
      
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    test('không retry nếu shouldRetry trả về false', async () => {
      const fn = jest.fn(async () => {
        const error = new Error('Do not retry');
        error.statusCode = 400;
        throw error;
      });
      
      await expect(
        withConditionalRetry(fn, {
          maxRetries: 3,
          delay: 10,
          shouldRetry: (error) => error.statusCode >= 500
        })
      ).rejects.toThrow('Do not retry');
      
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('sử dụng default options', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Fail');
        }
        return 'success';
      };
      
      const result = await withConditionalRetry(fn);
      expect(result).toBe('success');
    });
  });

  describe('allSettled()', () => {
    test('trả về array với tất cả promises', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.reject('error'),
        Promise.resolve(3)
      ];
      
      const results = await allSettled(promises);
      
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({ status: 'fulfilled', value: 1 });
      expect(results[1]).toEqual({ status: 'rejected', reason: 'error' });
      expect(results[2]).toEqual({ status: 'fulfilled', value: 3 });
    });

    test('xử lý tất cả promises fulfilled', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3)
      ];
      
      const results = await allSettled(promises);
      
      results.forEach(result => {
        expect(result.status).toBe('fulfilled');
      });
    });

    test('xử lý tất cả promises rejected', async () => {
      const promises = [
        Promise.reject('error1'),
        Promise.reject('error2'),
        Promise.reject('error3')
      ];
      
      const results = await allSettled(promises);
      
      results.forEach(result => {
        expect(result.status).toBe('rejected');
      });
    });

    test('xử lý empty array', async () => {
      const results = await allSettled([]);
      
      expect(results).toHaveLength(0);
    });
  });

  describe('batchProcess()', () => {
    test('xử lý tất cả items thành công', async () => {
      const items = [1, 2, 3, 4, 5];
      const processFn = async (item) => item * 2;
      
      const { successes, failures } = await batchProcess(items, processFn, 2);
      
      expect(successes).toHaveLength(5);
      expect(failures).toHaveLength(0);
      successes.forEach((s, i) => {
        expect(s.result).toBe(items[i] * 2);
      });
    });

    test('xử lý một số items fail', async () => {
      const items = [1, 2, 3, 4, 5];
      const processFn = async (item) => {
        if (item % 2 === 0) {
          throw new Error(`Failed: ${item}`);
        }
        return item * 2;
      };
      
      const { successes, failures } = await batchProcess(items, processFn, 2);
      
      expect(successes).toHaveLength(3); // 1, 3, 5
      expect(failures).toHaveLength(2); // 2, 4
      
      successes.forEach(s => {
        expect(s.item % 2).toBe(1);
      });
      
      failures.forEach(f => {
        expect(f.item % 2).toBe(0);
      });
    });

    test('xử lý với batch size khác nhau', async () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const processFn = async (item) => item;
      
      const result = await batchProcess(items, processFn, 3);
      
      expect(result.successes).toHaveLength(10);
    });

    test('default batch size = 5', async () => {
      const items = [1, 2, 3, 4, 5, 6];
      const processFn = async (item) => item;
      
      const result = await batchProcess(items, processFn);
      
      expect(result.successes).toHaveLength(6);
    });
  });

  describe('createCircuitBreaker()', () => {
    test('hoạt động bình thường khi CLOSED', async () => {
      const fn = jest.fn(async () => 'success');
      const protectedFn = createCircuitBreaker(fn, {
        failureThreshold: 3,
        resetTimeout: 100
      });
      
      const result = await protectedFn();
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('chuyển sang OPEN sau khi đạt failure threshold', async () => {
      const fn = jest.fn(async () => {
        throw new Error('Fail');
      });
      const protectedFn = createCircuitBreaker(fn, {
        failureThreshold: 3,
        resetTimeout: 1000
      });
      
      // Gây ra 3 failures
      for (let i = 0; i < 3; i++) {
        try {
          await protectedFn();
        } catch (e) {
          // Expected
        }
      }
      
      // Circuit should be OPEN now
      await expect(protectedFn()).rejects.toThrow('Circuit breaker is OPEN');
    });

    test('chuyển sang HALF_OPEN sau reset timeout', async () => {
      jest.useFakeTimers();
      
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockRejectedValueOnce(new Error('Fail'))
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValueOnce('success');
      
      const protectedFn = createCircuitBreaker(fn, {
        failureThreshold: 3,
        resetTimeout: 100
      });
      
      // Gây ra 3 failures
      for (let i = 0; i < 3; i++) {
        try {
          await protectedFn();
        } catch (e) {
          // Expected
        }
      }
      
      // Fast forward time
      jest.advanceTimersByTime(150);
      
      // Should allow one attempt (HALF_OPEN)
      const result = await protectedFn();
      expect(result).toBe('success');
      
      jest.useRealTimers();
    });

    test('reset về CLOSED sau khi thành công trong HALF_OPEN', async () => {
      jest.useFakeTimers();
      
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockRejectedValueOnce(new Error('Fail'))
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValue('success');
      
      const protectedFn = createCircuitBreaker(fn, {
        failureThreshold: 3,
        resetTimeout: 100
      });
      
      // Trigger failures
      for (let i = 0; i < 3; i++) {
        try {
          await protectedFn();
        } catch (e) {
          // Expected
        }
      }
      
      // Advance time và thử lại
      jest.advanceTimersByTime(150);
      await protectedFn();
      
      // Bây giờ CLOSED, nên hoạt động bình thường
      const result = await protectedFn();
      expect(result).toBe('success');
      
      jest.useRealTimers();
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    test('kết hợp tryCatch và safeJsonParse', () => {
      const parseData = tryCatch((jsonString) => {
        const data = safeJsonParse(jsonString);
        if (!data) throw new Error('Invalid JSON');
        return data;
      });
      
      const result1 = parseData('{"name":"John"}');
      expect(result1.success).toBe(true);
      expect(result1.data.name).toBe('John');
      
      const result2 = parseData('invalid');
      expect(result2.success).toBe(false);
    });

    test('kết hợp withRetry và withTimeout', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Retry');
        }
        return new Promise(resolve => {
          setTimeout(() => resolve('success'), 10);
        });
      };
      
      const result = await withRetry(
        () => withTimeout(fn(), 100),
        3,
        10
      );
      
      expect(result).toBe('success');
    });

    test('batchProcess với circuit breaker', async () => {
      const fn = jest.fn(async (item) => {
        if (item > 5) throw new Error('Too large');
        return item * 2;
      });
      
      const protectedFn = createCircuitBreaker(fn, {
        failureThreshold: 2,
        resetTimeout: 1000
      });
      
      const items = [1, 2, 3, 4, 5, 6, 7, 8];
      const { successes, failures } = await batchProcess(
        items,
        protectedFn,
        2
      );
      
      expect(successes.length + failures.length).toBe(items.length);
    });

    test('asyncTryCatch với withRetry', async () => {
      let attempts = 0;
      const riskyFn = asyncTryCatch(async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Fail');
        }
        return 'success';
      });
      
      // First call fails
      const result1 = await riskyFn();
      expect(result1.success).toBe(false);
      
      // Second call succeeds
      const result2 = await riskyFn();
      expect(result2.success).toBe(true);
    });
  });
});
