/**
 * Unit Tests cho Bài 4.2: Promises
 */

const {
  wait,
  fetchUserData,
  fetchMultipleUsers,
  fetchFirstUser,
  retryOperation,
  withTimeout,
  fetchAllSettled,
  sequential,
  createCancellablePromise
} = require('../src/bai4_2_promises');

describe('Bài 4.2: Promises', () => {

  describe('wait()', () => {
    test('resolve sau khoảng thời gian chỉ định', async () => {
      const start = Date.now();
      await wait(100);
      const elapsed = Date.now() - start;
      
      // Cho phép sai số 50ms
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(elapsed).toBeLessThan(200);
    });

    test('resolve với undefined', async () => {
      const result = await wait(10);
      expect(result).toBeUndefined();
    });
  });

  describe('fetchUserData()', () => {
    test('resolve với user data hợp lệ', async () => {
      const user = await fetchUserData(1);
      
      expect(user).toHaveProperty('id', 1);
      expect(user).toHaveProperty('name', 'User 1');
      expect(user).toHaveProperty('email', 'user1@example.com');
      expect(user).toHaveProperty('createdAt');
    });

    test('reject với user ID không hợp lệ (<=0)', async () => {
      await expect(fetchUserData(0)).rejects.toThrow('Invalid user ID');
      await expect(fetchUserData(-1)).rejects.toThrow('Invalid user ID');
    });

    test('reject với user không tồn tại (>100)', async () => {
      await expect(fetchUserData(101)).rejects.toThrow('User not found');
    });

    test('trả về Promise', () => {
      const result = fetchUserData(1);
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('fetchMultipleUsers()', () => {
    test('fetch nhiều users thành công', async () => {
      const users = await fetchMultipleUsers([1, 2, 3]);
      
      expect(users).toHaveLength(3);
      expect(users[0].id).toBe(1);
      expect(users[1].id).toBe(2);
      expect(users[2].id).toBe(3);
    });

    test('trả về mảng rỗng nếu input rỗng', async () => {
      const users = await fetchMultipleUsers([]);
      expect(users).toEqual([]);
    });

    test('reject nếu một trong các users fail', async () => {
      await expect(fetchMultipleUsers([1, 0, 3])).rejects.toThrow('Invalid user ID');
    });

    test('reject nếu input không phải array', async () => {
      await expect(fetchMultipleUsers('not an array')).rejects.toThrow('userIds must be an array');
    });
  });

  describe('fetchFirstUser()', () => {
    test('resolve với user đầu tiên', async () => {
      const user = await fetchFirstUser([1, 2, 3]);
      
      // Vì tất cả có cùng delay, nên có thể là bất kỳ user nào
      expect(user).toHaveProperty('id');
      expect([1, 2, 3]).toContain(user.id);
    });

    test('reject nếu input rỗng', async () => {
      await expect(fetchFirstUser([])).rejects.toThrow('userIds cannot be empty');
    });

    test('reject nếu input không phải array', async () => {
      await expect(fetchFirstUser('not an array')).rejects.toThrow('userIds must be an array');
    });
  });

  describe('retryOperation()', () => {
    test('thành công ở lần thử đầu tiên', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await retryOperation(operation, 3);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    test('retry khi fail và thành công sau đó', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');
      
      const result = await retryOperation(operation, 3, 10);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    test('throw error sau khi vượt quá maxRetries', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('always fail'));
      
      await expect(retryOperation(operation, 2, 10)).rejects.toThrow('always fail');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    test('throw error nếu operation không phải function', async () => {
      await expect(retryOperation('not a function', 3)).rejects.toThrow('Operation must be a function');
    });

    test('throw error nếu maxRetries < 1', async () => {
      await expect(retryOperation(() => {}, 0)).rejects.toThrow('maxRetries must be at least 1');
    });
  });

  describe('withTimeout()', () => {
    test('resolve nếu promise hoàn thành trước timeout', async () => {
      const promise = wait(50).then(() => 'success');
      
      const result = await withTimeout(promise, 200);
      
      expect(result).toBe('success');
    });

    test('reject với timeout error nếu promise quá chậm', async () => {
      const promise = wait(200).then(() => 'success');
      
      await expect(withTimeout(promise, 50)).rejects.toThrow('Operation timed out after 50ms');
    });

    test('reject với original error nếu promise reject', async () => {
      const promise = Promise.reject(new Error('original error'));
      
      await expect(withTimeout(promise, 200)).rejects.toThrow('original error');
    });
  });

  describe('fetchAllSettled()', () => {
    test('trả về kết quả của tất cả promises', async () => {
      const promises = [
        Promise.resolve('success 1'),
        Promise.reject(new Error('error 2')),
        Promise.resolve('success 3')
      ];
      
      const results = await fetchAllSettled(promises);
      
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({ status: 'fulfilled', value: 'success 1' });
      expect(results[1].status).toBe('rejected');
      expect(results[1].reason.message).toBe('error 2');
      expect(results[2]).toEqual({ status: 'fulfilled', value: 'success 3' });
    });

    test('hoạt động với tất cả promises thành công', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3)
      ];
      
      const results = await fetchAllSettled(promises);
      
      expect(results.every(r => r.status === 'fulfilled')).toBe(true);
    });

    test('hoạt động với tất cả promises thất bại', async () => {
      const promises = [
        Promise.reject(new Error('error 1')),
        Promise.reject(new Error('error 2'))
      ];
      
      const results = await fetchAllSettled(promises);
      
      expect(results.every(r => r.status === 'rejected')).toBe(true);
    });
  });

  describe('sequential()', () => {
    test('thực hiện promises theo thứ tự', async () => {
      const order = [];
      const promiseFns = [
        () => wait(30).then(() => { order.push(1); return 'a'; }),
        () => wait(10).then(() => { order.push(2); return 'b'; }),
        () => wait(20).then(() => { order.push(3); return 'c'; })
      ];
      
      const results = await sequential(promiseFns);
      
      expect(results).toEqual(['a', 'b', 'c']);
      expect(order).toEqual([1, 2, 3]); // Thực hiện theo thứ tự, không phải theo thời gian
    });

    test('hoạt động với mảng rỗng', async () => {
      const results = await sequential([]);
      expect(results).toEqual([]);
    });

    test('dừng lại nếu có promise reject', async () => {
      const promiseFns = [
        () => Promise.resolve('a'),
        () => Promise.reject(new Error('fail')),
        () => Promise.resolve('c')
      ];
      
      await expect(sequential(promiseFns)).rejects.toThrow('fail');
    });
  });

  describe('createCancellablePromise()', () => {
    test('resolve bình thường nếu không cancel', async () => {
      const { promise } = createCancellablePromise((resolve) => {
        setTimeout(() => resolve('done'), 50);
      });
      
      const result = await promise;
      expect(result).toBe('done');
    });

    test('reject với error khi cancel', async () => {
      const { promise, cancel } = createCancellablePromise((resolve) => {
        setTimeout(() => resolve('done'), 100);
      });
      
      // Cancel ngay lập tức
      cancel();
      
      await expect(promise).rejects.toThrow('Promise cancelled');
    });

    test('cancel function có thể gọi được', () => {
      const { cancel } = createCancellablePromise((resolve) => {
        setTimeout(resolve, 100);
      });
      
      expect(typeof cancel).toBe('function');
    });
  });
});
