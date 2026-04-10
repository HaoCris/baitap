/**
 * Unit Tests cho Bài 1.1: Counter với Closure
 */

const { createCounter, createStepCounter } = require('../src/bai1_1_closure_counter');

describe('Bài 1.1: Counter với Closure', () => {
  
  describe('createCounter()', () => {
    let counter;

    beforeEach(() => {
      // Tạo counter mới trước mỗi test
      counter = createCounter();
    });

    test('khởi tạo counter với giá trị 0', () => {
      expect(counter.getValue()).toBe(0);
    });

    test('khởi tạo counter với giá trị tùy chỉnh', () => {
      const customCounter = createCounter(10);
      expect(customCounter.getValue()).toBe(10);
    });

    test('increment() tăng giá trị lên 1', () => {
      counter.increment();
      expect(counter.getValue()).toBe(1);
    });

    test('increment() nhiều lần hoạt động đúng', () => {
      counter.increment();
      counter.increment();
      counter.increment();
      expect(counter.getValue()).toBe(3);
    });

    test('increment() trả về giá trị mới', () => {
      const result = counter.increment();
      expect(result).toBe(1);
    });

    test('decrement() giảm giá trị xuống 1', () => {
      counter.increment();
      counter.increment();
      counter.decrement();
      expect(counter.getValue()).toBe(1);
    });

    test('decrement() có thể tạo giá trị âm', () => {
      counter.decrement();
      expect(counter.getValue()).toBe(-1);
    });

    test('decrement() trả về giá trị mới', () => {
      const result = counter.decrement();
      expect(result).toBe(-1);
    });

    test('reset() đặt lại giá trị về 0', () => {
      counter.increment();
      counter.increment();
      counter.increment();
      counter.reset();
      expect(counter.getValue()).toBe(0);
    });

    test('reset() trả về 0', () => {
      counter.increment();
      const result = counter.reset();
      expect(result).toBe(0);
    });

    test('private variable không thể truy cập trực tiếp', () => {
      // Thử truy cập count property trực tiếp
      expect(counter.count).toBeUndefined();
    });

    test('các counter instances độc lập với nhau', () => {
      const counter1 = createCounter();
      const counter2 = createCounter();

      counter1.increment();
      counter1.increment();
      counter2.increment();

      expect(counter1.getValue()).toBe(2);
      expect(counter2.getValue()).toBe(1);
    });

    test('kết hợp nhiều operations', () => {
      counter.increment();
      counter.increment();
      counter.decrement();
      counter.increment();
      counter.increment();
      counter.decrement();
      expect(counter.getValue()).toBe(2);
    });
  });

  describe('createStepCounter()', () => {
    test('khởi tạo với step mặc định là 1', () => {
      const counter = createStepCounter();
      counter.increment();
      expect(counter.getValue()).toBe(1);
    });

    test('khởi tạo với step tùy chỉnh', () => {
      const counter = createStepCounter(5);
      counter.increment();
      expect(counter.getValue()).toBe(5);
    });

    test('decrement với step tùy chỉnh', () => {
      const counter = createStepCounter(3);
      counter.decrement();
      expect(counter.getValue()).toBe(-3);
    });

    test('setStep() thay đổi step', () => {
      const counter = createStepCounter(2);
      counter.increment(); // +2 = 2
      counter.setStep(5);
      counter.increment(); // +5 = 7
      expect(counter.getValue()).toBe(7);
    });

    test('reset() hoạt động với step counter', () => {
      const counter = createStepCounter(10);
      counter.increment();
      counter.increment();
      counter.reset();
      expect(counter.getValue()).toBe(0);
    });
  });
});
