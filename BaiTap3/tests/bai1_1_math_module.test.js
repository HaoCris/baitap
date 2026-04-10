/**
 * Unit Tests cho Bài 1.1: Math Module
 */

const math = require('../src/bai1_1_math_module');

describe('Bài 1.1: Math Module', () => {

  describe('add()', () => {
    test('cộng hai số dương', () => {
      expect(math.add(5, 3)).toBe(8);
    });

    test('cộng số âm', () => {
      expect(math.add(-5, 3)).toBe(-2);
    });

    test('cộng với 0', () => {
      expect(math.add(5, 0)).toBe(5);
    });

    test('cộng số thập phân', () => {
      expect(math.add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  describe('subtract()', () => {
    test('trừ hai số dương', () => {
      expect(math.subtract(5, 3)).toBe(2);
    });

    test('trừ số âm', () => {
      expect(math.subtract(-5, -3)).toBe(-2);
    });

    test('kết quả âm', () => {
      expect(math.subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply()', () => {
    test('nhân hai số dương', () => {
      expect(math.multiply(5, 3)).toBe(15);
    });

    test('nhân với số âm', () => {
      expect(math.multiply(-5, 3)).toBe(-15);
    });

    test('nhân với 0', () => {
      expect(math.multiply(5, 0)).toBe(0);
    });

    test('nhân với 1', () => {
      expect(math.multiply(5, 1)).toBe(5);
    });
  });

  describe('divide()', () => {
    test('chia hai số dương', () => {
      expect(math.divide(6, 3)).toBe(2);
    });

    test('chia với kết quả thập phân', () => {
      expect(math.divide(5, 2)).toBe(2.5);
    });

    test('throw error khi chia cho 0', () => {
      expect(() => math.divide(5, 0)).toThrow('Cannot divide by zero');
    });

    test('chia số âm', () => {
      expect(math.divide(-6, 3)).toBe(-2);
    });
  });

  describe('power()', () => {
    test('lũy thừa cơ bản', () => {
      expect(math.power(2, 3)).toBe(8);
    });

    test('lũy thừa với số mũ 0', () => {
      expect(math.power(5, 0)).toBe(1);
    });

    test('lũy thừa với số mũ 1', () => {
      expect(math.power(5, 1)).toBe(5);
    });

    test('lũy thừa với số mũ âm', () => {
      expect(math.power(2, -2)).toBe(0.25);
    });

    test('lũy thừa với cơ số 0', () => {
      expect(math.power(0, 5)).toBe(0);
    });
  });

  describe('factorial()', () => {
    test('factorial của 0', () => {
      expect(math.factorial(0)).toBe(1);
    });

    test('factorial của 1', () => {
      expect(math.factorial(1)).toBe(1);
    });

    test('factorial của 5', () => {
      expect(math.factorial(5)).toBe(120);
    });

    test('factorial của 10', () => {
      expect(math.factorial(10)).toBe(3628800);
    });

    test('throw error với số âm', () => {
      expect(() => math.factorial(-1)).toThrow('Factorial is not defined for negative numbers');
    });

    test('throw error với số thập phân', () => {
      expect(() => math.factorial(3.5)).toThrow('Factorial is only defined for integers');
    });
  });

  describe('isPrime()', () => {
    test('2 là số nguyên tố', () => {
      expect(math.isPrime(2)).toBe(true);
    });

    test('3 là số nguyên tố', () => {
      expect(math.isPrime(3)).toBe(true);
    });

    test('4 không phải số nguyên tố', () => {
      expect(math.isPrime(4)).toBe(false);
    });

    test('17 là số nguyên tố', () => {
      expect(math.isPrime(17)).toBe(true);
    });

    test('1 không phải số nguyên tố', () => {
      expect(math.isPrime(1)).toBe(false);
    });

    test('0 không phải số nguyên tố', () => {
      expect(math.isPrime(0)).toBe(false);
    });

    test('số âm không phải số nguyên tố', () => {
      expect(math.isPrime(-5)).toBe(false);
    });

    test('97 là số nguyên tố', () => {
      expect(math.isPrime(97)).toBe(true);
    });

    test('100 không phải số nguyên tố', () => {
      expect(math.isPrime(100)).toBe(false);
    });
  });

  describe('fibonacci()', () => {
    test('fibonacci(1) trả về [0]', () => {
      expect(math.fibonacci(1)).toEqual([0]);
    });

    test('fibonacci(2) trả về [0, 1]', () => {
      expect(math.fibonacci(2)).toEqual([0, 1]);
    });

    test('fibonacci(10)', () => {
      expect(math.fibonacci(10)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
    });

    test('fibonacci(5)', () => {
      expect(math.fibonacci(5)).toEqual([0, 1, 1, 2, 3]);
    });

    test('throw error với n < 1', () => {
      expect(() => math.fibonacci(0)).toThrow('n must be at least 1');
    });

    test('throw error với n âm', () => {
      expect(() => math.fibonacci(-5)).toThrow('n must be at least 1');
    });
  });

  describe('gcd()', () => {
    test('gcd(12, 8) = 4', () => {
      expect(math.gcd(12, 8)).toBe(4);
    });

    test('gcd(17, 13) = 1 (coprime)', () => {
      expect(math.gcd(17, 13)).toBe(1);
    });

    test('gcd với số âm', () => {
      expect(math.gcd(-12, 8)).toBe(4);
    });

    test('gcd với 0', () => {
      expect(math.gcd(12, 0)).toBe(12);
    });

    test('gcd(48, 18) = 6', () => {
      expect(math.gcd(48, 18)).toBe(6);
    });
  });

  describe('lcm()', () => {
    test('lcm(4, 6) = 12', () => {
      expect(math.lcm(4, 6)).toBe(12);
    });

    test('lcm(3, 5) = 15 (coprime)', () => {
      expect(math.lcm(3, 5)).toBe(15);
    });

    test('lcm(12, 8) = 24', () => {
      expect(math.lcm(12, 8)).toBe(24);
    });

    test('lcm với số âm', () => {
      expect(math.lcm(-4, 6)).toBe(12);
    });
  });

  describe('sum()', () => {
    test('tổng mảng số dương', () => {
      expect(math.sum([1, 2, 3, 4, 5])).toBe(15);
    });

    test('tổng mảng rỗng', () => {
      expect(math.sum([])).toBe(0);
    });

    test('tổng mảng có số âm', () => {
      expect(math.sum([1, -2, 3, -4, 5])).toBe(3);
    });

    test('tổng mảng một phần tử', () => {
      expect(math.sum([42])).toBe(42);
    });
  });

  describe('average()', () => {
    test('trung bình cộng cơ bản', () => {
      expect(math.average([2, 4, 6, 8, 10])).toBe(6);
    });

    test('trung bình với kết quả thập phân', () => {
      expect(math.average([1, 2, 3])).toBe(2);
    });

    test('throw error với mảng rỗng', () => {
      expect(() => math.average([])).toThrow('Cannot calculate average of empty array');
    });

    test('trung bình mảng một phần tử', () => {
      expect(math.average([5])).toBe(5);
    });
  });
});
