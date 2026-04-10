/**
 * Unit Tests cho Bài 4.1: Custom EventEmitter
 */

const CustomEventEmitter = require('../src/bai4_1_custom_event_emitter');

describe('Bài 4.1: Custom EventEmitter', () => {
  let emitter;

  beforeEach(() => {
    emitter = new CustomEventEmitter();
  });

  describe('on()', () => {
    test('đăng ký listener thành công', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      
      expect(emitter.listenerCount('test')).toBe(1);
    });

    test('đăng ký nhiều listeners cho cùng event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      emitter.on('test', listener1);
      emitter.on('test', listener2);
      
      expect(emitter.listenerCount('test')).toBe(2);
    });

    test('hỗ trợ method chaining', () => {
      const result = emitter.on('test', () => {});
      expect(result).toBe(emitter);
    });

    test('throw error nếu listener không phải function', () => {
      expect(() => emitter.on('test', 'not a function')).toThrow(TypeError);
    });
  });

  describe('emit()', () => {
    test('gọi listener khi emit event', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      
      emitter.emit('test');
      
      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('truyền arguments cho listener', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      
      emitter.emit('test', 'arg1', 'arg2', 123);
      
      expect(listener).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    test('gọi tất cả listeners theo thứ tự', () => {
      const order = [];
      emitter.on('test', () => order.push(1));
      emitter.on('test', () => order.push(2));
      emitter.on('test', () => order.push(3));
      
      emitter.emit('test');
      
      expect(order).toEqual([1, 2, 3]);
    });

    test('trả về true nếu có listeners', () => {
      emitter.on('test', () => {});
      expect(emitter.emit('test')).toBe(true);
    });

    test('trả về false nếu không có listeners', () => {
      expect(emitter.emit('nonexistent')).toBe(false);
    });

    test('không throw nếu emit event không tồn tại', () => {
      expect(() => emitter.emit('nonexistent')).not.toThrow();
    });
  });

  describe('once()', () => {
    test('listener chỉ được gọi một lần', () => {
      const listener = jest.fn();
      emitter.once('test', listener);
      
      emitter.emit('test');
      emitter.emit('test');
      emitter.emit('test');
      
      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('truyền arguments cho once listener', () => {
      const listener = jest.fn();
      emitter.once('test', listener);
      
      emitter.emit('test', 'hello', 123);
      
      expect(listener).toHaveBeenCalledWith('hello', 123);
    });

    test('tự động remove sau khi emit', () => {
      const listener = jest.fn();
      emitter.once('test', listener);
      
      expect(emitter.listenerCount('test')).toBe(1);
      emitter.emit('test');
      expect(emitter.listenerCount('test')).toBe(0);
    });

    test('throw error nếu listener không phải function', () => {
      expect(() => emitter.once('test', 'not a function')).toThrow(TypeError);
    });
  });

  describe('off()', () => {
    test('xóa listener cụ thể', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      emitter.on('test', listener1);
      emitter.on('test', listener2);
      emitter.off('test', listener1);
      
      emitter.emit('test');
      
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    test('không throw nếu event không tồn tại', () => {
      expect(() => emitter.off('nonexistent', () => {})).not.toThrow();
    });

    test('không throw nếu listener không tồn tại', () => {
      emitter.on('test', () => {});
      expect(() => emitter.off('test', () => {})).not.toThrow();
    });

    test('có thể xóa once listener bằng original listener', () => {
      const listener = jest.fn();
      emitter.once('test', listener);
      emitter.off('test', listener);
      
      emitter.emit('test');
      
      expect(listener).not.toHaveBeenCalled();
    });

    test('hỗ trợ method chaining', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      const result = emitter.off('test', listener);
      expect(result).toBe(emitter);
    });
  });

  describe('listenerCount()', () => {
    test('trả về 0 nếu không có listeners', () => {
      expect(emitter.listenerCount('test')).toBe(0);
    });

    test('đếm đúng số listeners', () => {
      emitter.on('test', () => {});
      emitter.on('test', () => {});
      emitter.on('other', () => {});
      
      expect(emitter.listenerCount('test')).toBe(2);
      expect(emitter.listenerCount('other')).toBe(1);
    });
  });

  describe('listeners()', () => {
    test('trả về mảng rỗng nếu không có listeners', () => {
      expect(emitter.listeners('test')).toEqual([]);
    });

    test('trả về copy của listeners array', () => {
      const listener1 = () => {};
      const listener2 = () => {};
      emitter.on('test', listener1);
      emitter.on('test', listener2);
      
      const listeners = emitter.listeners('test');
      expect(listeners).toHaveLength(2);
      
      // Verify it's a copy
      listeners.push(() => {});
      expect(emitter.listenerCount('test')).toBe(2);
    });
  });

  describe('eventNames()', () => {
    test('trả về mảng rỗng khi không có events', () => {
      expect(emitter.eventNames()).toEqual([]);
    });

    test('trả về tên các events đã đăng ký', () => {
      emitter.on('event1', () => {});
      emitter.on('event2', () => {});
      emitter.on('event3', () => {});
      
      const names = emitter.eventNames();
      expect(names).toContain('event1');
      expect(names).toContain('event2');
      expect(names).toContain('event3');
      expect(names).toHaveLength(3);
    });
  });

  describe('removeAllListeners()', () => {
    test('xóa tất cả listeners của một event', () => {
      emitter.on('test', () => {});
      emitter.on('test', () => {});
      emitter.on('other', () => {});
      
      emitter.removeAllListeners('test');
      
      expect(emitter.listenerCount('test')).toBe(0);
      expect(emitter.listenerCount('other')).toBe(1);
    });

    test('xóa tất cả listeners của tất cả events', () => {
      emitter.on('test', () => {});
      emitter.on('other', () => {});
      
      emitter.removeAllListeners();
      
      expect(emitter.eventNames()).toEqual([]);
    });

    test('hỗ trợ method chaining', () => {
      emitter.on('test', () => {});
      const result = emitter.removeAllListeners('test');
      expect(result).toBe(emitter);
    });
  });

  describe('prependListener()', () => {
    test('thêm listener vào đầu danh sách', () => {
      const order = [];
      emitter.on('test', () => order.push(1));
      emitter.prependListener('test', () => order.push(0));
      
      emitter.emit('test');
      
      expect(order).toEqual([0, 1]);
    });

    test('throw error nếu listener không phải function', () => {
      expect(() => emitter.prependListener('test', 'not a function')).toThrow(TypeError);
    });
  });

  describe('prependOnceListener()', () => {
    test('thêm once listener vào đầu danh sách', () => {
      const order = [];
      emitter.on('test', () => order.push(1));
      emitter.prependOnceListener('test', () => order.push(0));
      
      emitter.emit('test');
      emitter.emit('test');
      
      // First emit: [0, 1], Second emit: [1]
      expect(order).toEqual([0, 1, 1]);
    });

    test('throw error nếu listener không phải function', () => {
      expect(() => emitter.prependOnceListener('test', 'not a function')).toThrow(TypeError);
    });
  });

  describe('edge cases', () => {
    test('listener có thể emit cùng event', () => {
      let count = 0;
      const listener = () => {
        count++;
        if (count < 3) {
          emitter.emit('test');
        }
      };
      emitter.on('test', listener);
      
      emitter.emit('test');
      
      expect(count).toBe(3);
    });

    test('listener có thể remove chính nó', () => {
      const listener = jest.fn(() => {
        emitter.off('test', listener);
      });
      emitter.on('test', listener);
      emitter.on('test', jest.fn());
      
      emitter.emit('test');
      emitter.emit('test');
      
      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('nhiều event emitters độc lập', () => {
      const emitter1 = new CustomEventEmitter();
      const emitter2 = new CustomEventEmitter();
      
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      emitter1.on('test', listener1);
      emitter2.on('test', listener2);
      
      emitter1.emit('test');
      
      expect(listener1).toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });
  });
});
