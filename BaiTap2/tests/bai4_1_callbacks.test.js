/**
 * Unit Tests cho Bài 4.1: Callbacks
 */

const {
  delayedGreeting,
  readFileSimulation,
  callbackHell,
  callbackHellWithError,
  parallelTasks,
  waterfall,
  retryWithCallback
} = require('../src/bai4_1_callbacks');

describe('Bài 4.1: Callbacks', () => {

  describe('delayedGreeting()', () => {
    
    test('gọi callback với lời chào sau delay', (done) => {
      delayedGreeting('Alice', 100, (greeting) => {
        expect(greeting).toBe('Hello, Alice!');
        done();
      });
    });

    test('hoạt động với nhiều tên khác nhau', (done) => {
      delayedGreeting('Bob', 50, (greeting) => {
        expect(greeting).toBe('Hello, Bob!');
        done();
      });
    });

    test('delay được tôn trọng', (done) => {
      const startTime = Date.now();
      
      delayedGreeting('Test', 100, () => {
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(100);
        done();
      });
    });

    test('throw error nếu name không phải string', () => {
      expect(() => {
        delayedGreeting(123, 100, () => {});
      }).toThrow(TypeError);
    });

    test('throw error nếu delay là số âm', () => {
      expect(() => {
        delayedGreeting('Alice', -100, () => {});
      }).toThrow(TypeError);
    });

    test('throw error nếu callback không phải function', () => {
      expect(() => {
        delayedGreeting('Alice', 100, 'not a function');
      }).toThrow(TypeError);
    });

    test('chấp nhận delay = 0', (done) => {
      delayedGreeting('Alice', 0, (greeting) => {
        expect(greeting).toBe('Hello, Alice!');
        done();
      });
    });
  });

  describe('readFileSimulation()', () => {
    
    test('đọc file thành công', (done) => {
      readFileSimulation('data.txt', (error, data) => {
        expect(error).toBeNull();
        expect(data).toBe('This is the content of data.txt');
        done();
      });
    });

    test('trả về error nếu filename rỗng', (done) => {
      readFileSimulation('', (error, data) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Filename cannot be empty');
        expect(data).toBeNull();
        done();
      });
    });

    test('trả về error nếu filename không hợp lệ', (done) => {
      readFileSimulation('noextension', (error, data) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Invalid filename format');
        expect(data).toBeNull();
        done();
      });
    });

    test('trả về error nếu file không tồn tại', (done) => {
      readFileSimulation('notfound.txt', (error, data) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('File not found');
        expect(data).toBeNull();
        done();
      });
    });

    test('trả về error nếu không có permission', (done) => {
      readFileSimulation('secret.txt', (error, data) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Permission denied');
        expect(data).toBeNull();
        done();
      });
    });

    test('throw error nếu filename không phải string', () => {
      expect(() => {
        readFileSimulation(123, () => {});
      }).toThrow(TypeError);
    });

    test('throw error nếu callback không phải function', () => {
      expect(() => {
        readFileSimulation('file.txt', 'not a function');
      }).toThrow(TypeError);
    });

    test('hoạt động với nhiều file types', (done) => {
      readFileSimulation('config.json', (error, data) => {
        expect(error).toBeNull();
        expect(data).toContain('config.json');
        done();
      });
    });
  });

  describe('callbackHell()', () => {
    
    test('thực hiện 3 steps liên tiếp và trả về kết quả', (done) => {
      callbackHell((error, result) => {
        expect(error).toBeNull();
        expect(result).toBe('Step 1 -> Step 2 -> Step 3');
        done();
      });
    }, 500);

    test('throw error nếu callback không phải function', () => {
      expect(() => {
        callbackHell('not a function');
      }).toThrow(TypeError);
    });

    test('kết quả chứa tất cả các steps', (done) => {
      callbackHell((error, result) => {
        expect(result).toContain('Step 1');
        expect(result).toContain('Step 2');
        expect(result).toContain('Step 3');
        done();
      });
    }, 500);
  });

  describe('callbackHellWithError()', () => {
    
    test('thành công khi shouldFail = false', (done) => {
      callbackHellWithError((error, result) => {
        expect(error).toBeNull();
        expect(result).toBe('Step 1 -> Step 2 -> Step 3');
        done();
      }, false);
    }, 500);

    test('fail ở step 2 khi shouldFail = true', (done) => {
      callbackHellWithError((error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed at Step 2');
        expect(result).toBeNull();
        done();
      }, true);
    }, 500);
  });

  describe('parallelTasks()', () => {
    
    test('thực hiện nhiều tasks song song', (done) => {
      const task1 = (cb) => setTimeout(() => cb(null, 'Task 1'), 50);
      const task2 = (cb) => setTimeout(() => cb(null, 'Task 2'), 30);
      const task3 = (cb) => setTimeout(() => cb(null, 'Task 3'), 70);

      parallelTasks([task1, task2, task3], (error, results) => {
        expect(error).toBeNull();
        expect(results).toEqual(['Task 1', 'Task 2', 'Task 3']);
        done();
      });
    }, 200);

    test('trả về error nếu một task fail', (done) => {
      const task1 = (cb) => setTimeout(() => cb(null, 'Task 1'), 50);
      const task2 = (cb) => setTimeout(() => cb(new Error('Task 2 failed'), null), 30);
      const task3 = (cb) => setTimeout(() => cb(null, 'Task 3'), 70);

      parallelTasks([task1, task2, task3], (error, results) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Task 2 failed');
        expect(results).toBeNull();
        done();
      });
    }, 200);

    test('xử lý mảng rỗng', (done) => {
      parallelTasks([], (error, results) => {
        expect(error).toBeNull();
        expect(results).toEqual([]);
        done();
      });
    });

    test('throw error nếu tasks không phải array', () => {
      expect(() => {
        parallelTasks('not array', () => {});
      }).toThrow(TypeError);
    });
  });

  describe('waterfall()', () => {
    
    test('thực hiện tasks theo thứ tự, truyền result giữa các tasks', (done) => {
      const tasks = [
        (cb) => setTimeout(() => cb(null, 10), 50),
        (result, cb) => setTimeout(() => cb(null, result + 5), 50),
        (result, cb) => setTimeout(() => cb(null, result * 2), 50)
      ];

      waterfall(tasks, (error, result) => {
        expect(error).toBeNull();
        expect(result).toBe(30); // (10 + 5) * 2
        done();
      });
    }, 300);

    test('dừng lại khi gặp error', (done) => {
      const tasks = [
        (cb) => setTimeout(() => cb(null, 10), 50),
        (result, cb) => setTimeout(() => cb(new Error('Failed'), null), 50),
        (result, cb) => setTimeout(() => cb(null, result * 2), 50) // Không chạy
      ];

      waterfall(tasks, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed');
        expect(result).toBeNull();
        done();
      });
    }, 300);

    test('xử lý mảng rỗng', (done) => {
      waterfall([], (error, result) => {
        expect(error).toBeNull();
        expect(result).toBeNull();
        done();
      });
    });

    test('throw error nếu tasks không phải array', () => {
      expect(() => {
        waterfall({}, () => {});
      }).toThrow(TypeError);
    });
  });

  describe('retryWithCallback()', () => {
    
    test('thành công ở lần đầu tiên', (done) => {
      let attempts = 0;
      const operation = (cb) => {
        attempts++;
        setTimeout(() => cb(null, 'Success'), 50);
      };

      retryWithCallback(operation, 3, (error, result) => {
        expect(error).toBeNull();
        expect(result).toBe('Success');
        expect(attempts).toBe(1);
        done();
      });
    }, 200);

    test('retry khi fail và cuối cùng thành công', (done) => {
      let attempts = 0;
      const operation = (cb) => {
        attempts++;
        setTimeout(() => {
          if (attempts < 3) {
            cb(new Error('Failed'), null);
          } else {
            cb(null, 'Success on retry');
          }
        }, 50);
      };

      retryWithCallback(operation, 5, (error, result) => {
        expect(error).toBeNull();
        expect(result).toBe('Success on retry');
        expect(attempts).toBe(3);
        done();
      });
    }, 1000);

    test('fail sau khi hết số lần retry', (done) => {
      let attempts = 0;
      const operation = (cb) => {
        attempts++;
        setTimeout(() => cb(new Error('Always fails'), null), 50);
      };

      retryWithCallback(operation, 3, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('Failed after 3 attempts');
        expect(result).toBeNull();
        expect(attempts).toBe(3);
        done();
      });
    }, 1000);

    test('throw error nếu operation không phải function', () => {
      expect(() => {
        retryWithCallback('not function', 3, () => {});
      }).toThrow(TypeError);
    });
  });
});
