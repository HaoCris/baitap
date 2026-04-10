/**
 * Unit Tests cho Bài 2.2: Function Composition
 */

const {
  compose,
  pipe,
  curry,
  partial,
  partialRight,
  memoize,
  once,
  flip,
  identity,
  constant,
  negate
} = require('../src/bai2_2_function_composition');

describe('Bài 2.2: Function Composition', () => {

  // Helper functions cho tests
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;
  const square = x => x * x;
  const double = x => x * 2;
  const increment = x => x + 1;

  describe('compose()', () => {
    test('compose 2 functions từ phải sang trái', () => {
      const composed = compose(square, add);
      // square(add(2, 3)) = square(5) = 25
      expect(composed(2, 3)).toBe(25);
    });

    test('compose 3 functions', () => {
      const composed = compose(increment, square, add);
      // increment(square(add(2, 3))) = increment(square(5)) = increment(25) = 26
      expect(composed(2, 3)).toBe(26);
    });

    test('compose với 1 function trả về chính function đó', () => {
      const composed = compose(double);
      expect(composed(5)).toBe(10);
    });

    test('compose không có function nào trả về identity', () => {
      const composed = compose();
      expect(composed(5)).toBe(5);
    });

    test('compose nhiều functions', () => {
      const composed = compose(double, increment, square, add);
      // double(increment(square(add(1, 2)))) = double(increment(square(3))) 
      // = double(increment(9)) = double(10) = 20
      expect(composed(1, 2)).toBe(20);
    });

    test('throw error nếu argument không phải function', () => {
      expect(() => compose(square, 'not a function')).toThrow(TypeError);
      expect(() => compose(123, add)).toThrow(TypeError);
    });

    test('compose với các kiểu dữ liệu khác nhau', () => {
      const toString = x => String(x);
      const toUpperCase = str => str.toUpperCase();
      const composed = compose(toUpperCase, toString);
      expect(composed(123)).toBe('123');
    });
  });

  describe('pipe()', () => {
    test('pipe 2 functions từ trái sang phải', () => {
      const piped = pipe(add, square);
      // square(add(2, 3)) = square(5) = 25
      expect(piped(2, 3)).toBe(25);
    });

    test('pipe 3 functions', () => {
      const piped = pipe(add, square, increment);
      // increment(square(add(2, 3))) = increment(square(5)) = increment(25) = 26
      expect(piped(2, 3)).toBe(26);
    });

    test('pipe với 1 function', () => {
      const piped = pipe(double);
      expect(piped(5)).toBe(10);
    });

    test('pipe không có function nào', () => {
      const piped = pipe();
      expect(piped(5)).toBe(5);
    });

    test('pipe nhiều functions', () => {
      const piped = pipe(add, square, increment, double);
      // double(increment(square(add(1, 2)))) = double(increment(square(3)))
      // = double(increment(9)) = double(10) = 20
      expect(piped(1, 2)).toBe(20);
    });

    test('throw error nếu argument không phải function', () => {
      expect(() => pipe(square, null)).toThrow(TypeError);
      expect(() => pipe({}, add)).toThrow(TypeError);
    });

    test('pipe vs compose cho cùng kết quả nhưng thứ tự ngược', () => {
      const composed = compose(increment, square, add);
      const piped = pipe(add, square, increment);
      
      expect(composed(2, 3)).toBe(piped(2, 3));
    });
  });

  describe('curry()', () => {
    test('curry function 2 tham số', () => {
      const curriedAdd = curry(add);
      expect(curriedAdd(2)(3)).toBe(5);
    });

    test('curry có thể nhận nhiều arguments cùng lúc', () => {
      const curriedAdd = curry(add);
      expect(curriedAdd(2, 3)).toBe(5);
    });

    test('curry function 3 tham số', () => {
      const add3 = (a, b, c) => a + b + c;
      const curriedAdd3 = curry(add3);
      
      expect(curriedAdd3(1)(2)(3)).toBe(6);
      expect(curriedAdd3(1, 2)(3)).toBe(6);
      expect(curriedAdd3(1)(2, 3)).toBe(6);
      expect(curriedAdd3(1, 2, 3)).toBe(6);
    });

    test('curry function 4 tham số', () => {
      const add4 = (a, b, c, d) => a + b + c + d;
      const curriedAdd4 = curry(add4);
      
      expect(curriedAdd4(1)(2)(3)(4)).toBe(10);
      expect(curriedAdd4(1, 2)(3)(4)).toBe(10);
      expect(curriedAdd4(1)(2, 3, 4)).toBe(10);
    });

    test('curry với arity tùy chỉnh', () => {
      const fn = (...args) => args.reduce((a, b) => a + b, 0);
      const curried = curry(fn, 3);
      
      expect(curried(1)(2)(3)).toBe(6);
    });

    test('throw error nếu argument không phải function', () => {
      expect(() => curry('not a function')).toThrow(TypeError);
      expect(() => curry(123)).toThrow(TypeError);
    });

    test('curried function giữ nguyên context', () => {
      const obj = {
        value: 10,
        add: function(a, b) {
          return this.value + a + b;
        }
      };
      
      const curriedAdd = curry(obj.add.bind(obj));
      expect(curriedAdd(5)(3)).toBe(18);
    });
  });

  describe('partial()', () => {
    test('partial application với 1 argument', () => {
      const multiply3 = (a, b, c) => a * b * c;
      const multiplyBy2 = partial(multiply3, 2);
      
      expect(multiplyBy2(3, 4)).toBe(24); // 2 * 3 * 4
    });

    test('partial application với nhiều arguments', () => {
      const add3 = (a, b, c) => a + b + c;
      const add5Plus = partial(add3, 5, 3);
      
      expect(add5Plus(2)).toBe(10); // 5 + 3 + 2
    });

    test('partial với function 2 tham số', () => {
      const subtract = (a, b) => a - b;
      const subtract10 = partial(subtract, 10);
      
      expect(subtract10(3)).toBe(7); // 10 - 3
    });

    test('throw error nếu argument đầu không phải function', () => {
      expect(() => partial('not a function', 1)).toThrow(TypeError);
    });

    test('partial application giữ nguyên this context', () => {
      const obj = {
        value: 10,
        add: function(a, b) {
          return this.value + a + b;
        }
      };
      
      const add5 = partial(obj.add.bind(obj), 5);
      expect(add5(3)).toBe(18);
    });
  });

  describe('partialRight()', () => {
    test('partial right application', () => {
      const divide = (a, b) => a / b;
      const divideBy2 = partialRight(divide, 2);
      
      expect(divideBy2(10)).toBe(5); // 10 / 2
    });

    test('partial right với nhiều arguments', () => {
      const subtract3 = (a, b, c) => a - b - c;
      const subtractFrom10 = partialRight(subtract3, 3, 2);
      
      expect(subtractFrom10(10)).toBe(5); // 10 - 3 - 2
    });

    test('throw error nếu không phải function', () => {
      expect(() => partialRight(null, 1)).toThrow(TypeError);
    });
  });

  describe('memoize()', () => {
    test('memoize lưu cache kết quả', () => {
      let callCount = 0;
      const expensive = (n) => {
        callCount++;
        return n * 2;
      };
      
      const memoized = memoize(expensive);
      
      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1); // Chỉ gọi 1 lần
    });

    test('memoize với nhiều arguments khác nhau', () => {
      let callCount = 0;
      const fn = (a, b) => {
        callCount++;
        return a + b;
      };
      
      const memoized = memoize(fn);
      
      expect(memoized(1, 2)).toBe(3);
      expect(memoized(2, 3)).toBe(5);
      expect(memoized(1, 2)).toBe(3);
      expect(callCount).toBe(2); // Gọi 2 lần cho 2 sets arguments khác nhau
    });

    test('memoize fibonacci', () => {
      const fibonacci = memoize(function fib(n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
      });
      
      expect(fibonacci(10)).toBe(55);
      expect(fibonacci(10)).toBe(55);
    });

    test('throw error nếu không phải function', () => {
      expect(() => memoize('not a function')).toThrow(TypeError);
    });
  });

  describe('once()', () => {
    test('function chỉ được gọi một lần', () => {
      let callCount = 0;
      const fn = () => {
        callCount++;
        return 'result';
      };
      
      const onceFn = once(fn);
      
      expect(onceFn()).toBe('result');
      expect(onceFn()).toBe('result');
      expect(callCount).toBe(1);
    });

    test('once function trả về cùng kết quả', () => {
      const fn = (x) => x * 2;
      const onceFn = once(fn);
      
      expect(onceFn(5)).toBe(10);
      expect(onceFn(10)).toBe(10); // Vẫn trả về 10, không tính lại
    });

    test('throw error nếu không phải function', () => {
      expect(() => once(123)).toThrow(TypeError);
    });
  });

  describe('flip()', () => {
    test('flip đảo ngược arguments', () => {
      const divide = (a, b) => a / b;
      const flippedDivide = flip(divide);
      
      expect(flippedDivide(2, 10)).toBe(5); // 10 / 2
    });

    test('flip với nhiều arguments', () => {
      const subtract3 = (a, b, c) => a - b - c;
      const flipped = flip(subtract3);
      
      // Original: 10 - 5 - 2 = 3
      // Flipped: 2 - 5 - 10 = -13
      expect(flipped(10, 5, 2)).toBe(-13);
    });

    test('throw error nếu không phải function', () => {
      expect(() => flip('not a function')).toThrow(TypeError);
    });
  });

  describe('identity()', () => {
    test('trả về chính giá trị input', () => {
      expect(identity(5)).toBe(5);
      expect(identity('hello')).toBe('hello');
      expect(identity(null)).toBe(null);
    });

    test('identity với object', () => {
      const obj = { a: 1 };
      expect(identity(obj)).toBe(obj);
    });
  });

  describe('constant()', () => {
    test('luôn trả về cùng một giá trị', () => {
      const always5 = constant(5);
      
      expect(always5()).toBe(5);
      expect(always5(10)).toBe(5);
      expect(always5('anything')).toBe(5);
    });

    test('constant với object', () => {
      const obj = { a: 1 };
      const alwaysObj = constant(obj);
      
      expect(alwaysObj()).toBe(obj);
      expect(alwaysObj(123)).toBe(obj);
    });
  });

  describe('negate()', () => {
    test('đảo ngược kết quả boolean', () => {
      const isEven = x => x % 2 === 0;
      const isOdd = negate(isEven);
      
      expect(isOdd(3)).toBe(true);
      expect(isOdd(4)).toBe(false);
    });

    test('negate với function trả về truthy/falsy', () => {
      const isEmpty = str => !str.length;
      const isNotEmpty = negate(isEmpty);
      
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('')).toBe(false);
    });

    test('throw error nếu không phải function', () => {
      expect(() => negate(true)).toThrow(TypeError);
    });
  });

  describe('Integration Tests - Kết hợp nhiều patterns', () => {
    test('combine compose và curry', () => {
      const add3 = (a, b, c) => a + b + c;
      const curriedAdd = curry(add3);
      const composed = compose(square, curriedAdd(1)(2));
      
      expect(composed(3)).toBe(36); // square(1 + 2 + 3) = square(6) = 36
    });

    test('combine pipe và partial', () => {
      const multiply3 = (a, b, c) => a * b * c;
      const multiplyBy2 = partial(multiply3, 2);
      const piped = pipe(multiplyBy2, square);
      
      expect(piped(3, 4)).toBe(576); // square(2 * 3 * 4) = square(24) = 576
    });

    test('memoize curried function', () => {
      let callCount = 0;
      const add3 = (a, b, c) => {
        callCount++;
        return a + b + c;
      };
      
      const curriedAdd = curry(add3);
      const memoized = memoize(curriedAdd);
      
      expect(memoized(1)(2)(3)).toBe(6);
      expect(memoized(1)(2)(3)).toBe(6);
      expect(callCount).toBeGreaterThan(0);
    });
  });
});
