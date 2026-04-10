/**
 * Bài 2.2: Function Composition
 * 
 * Implement các pattern về function composition, currying và partial application
 */

/**
 * Compose functions từ phải sang trái
 * Thực hiện các function theo thứ tự từ phải qua trái
 * 
 * @param {...Function} fns - Các functions cần compose
 * @returns {Function} Function mới được compose
 * 
 * @example
 * const add = (a, b) => a + b;
 * const square = x => x * x;
 * const composed = compose(square, add);
 * console.log(composed(2, 3)); // 25 (square(add(2,3)) = square(5) = 25)
 */
function compose(...fns) {
  // Validate input - tất cả phải là functions
  if (!fns.every(fn => typeof fn === 'function')) {
    throw new TypeError('All arguments must be functions');
  }

  // Trường hợp không có function nào
  if (fns.length === 0) {
    return (value) => value;
  }

  // Trường hợp chỉ có 1 function
  if (fns.length === 1) {
    return fns[0];
  }

  // Compose từ phải sang trái
  // Bắt đầu với function cuối cùng, sau đó apply lần lượt về đầu
  return function(...args) {
    // Gọi function cuối cùng với tất cả arguments
    let result = fns[fns.length - 1](...args);
    
    // Gọi lần lượt các functions còn lại từ phải sang trái
    for (let i = fns.length - 2; i >= 0; i--) {
      result = fns[i](result);
    }
    
    return result;
  };
}

/**
 * Pipe functions từ trái sang phải
 * Thực hiện các function theo thứ tự từ trái qua phải
 * 
 * @param {...Function} fns - Các functions cần pipe
 * @returns {Function} Function mới được pipe
 * 
 * @example
 * const add = (a, b) => a + b;
 * const square = x => x * x;
 * const piped = pipe(add, square);
 * console.log(piped(2, 3)); // 25 (square(add(2,3)) = square(5) = 25)
 */
function pipe(...fns) {
  // Validate input
  if (!fns.every(fn => typeof fn === 'function')) {
    throw new TypeError('All arguments must be functions');
  }

  // Trường hợp không có function nào
  if (fns.length === 0) {
    return (value) => value;
  }

  // Trường hợp chỉ có 1 function
  if (fns.length === 1) {
    return fns[0];
  }

  // Pipe từ trái sang phải
  return function(...args) {
    // Gọi function đầu tiên với tất cả arguments
    let result = fns[0](...args);
    
    // Gọi lần lượt các functions còn lại từ trái sang phải
    for (let i = 1; i < fns.length; i++) {
      result = fns[i](result);
    }
    
    return result;
  };
}

/**
 * Curry - chuyển đổi function nhiều tham số thành chuỗi functions một tham số
 * 
 * @param {Function} fn - Function cần curry
 * @param {number} [arity] - Số lượng tham số (mặc định lấy từ fn.length)
 * @returns {Function} Curried function
 * 
 * @example
 * const add = (a, b, c) => a + b + c;
 * const curriedAdd = curry(add);
 * console.log(curriedAdd(1)(2)(3)); // 6
 * console.log(curriedAdd(1, 2)(3)); // 6
 * console.log(curriedAdd(1)(2, 3)); // 6
 */
function curry(fn, arity = fn.length) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('First argument must be a function');
  }

  // Hàm helper để tích lũy arguments
  return function curried(...args) {
    // Nếu đã có đủ arguments, gọi function gốc
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    
    // Chưa đủ arguments, trả về function mới để nhận thêm
    return function(...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

/**
 * Partial application - tạo function mới với một số tham số đã được cố định
 * 
 * @param {Function} fn - Function gốc
 * @param {...*} partialArgs - Các arguments được cố định trước
 * @returns {Function} Function mới với partial arguments
 * 
 * @example
 * const multiply = (a, b, c) => a * b * c;
 * const multiplyBy2 = partial(multiply, 2);
 * console.log(multiplyBy2(3, 4)); // 24 (2 * 3 * 4)
 */
function partial(fn, ...partialArgs) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('First argument must be a function');
  }

  // Trả về function mới với partial arguments đã cố định
  return function(...remainingArgs) {
    return fn.apply(this, [...partialArgs, ...remainingArgs]);
  };
}

/**
 * Partial Right - cố định arguments từ bên phải
 * 
 * @param {Function} fn - Function gốc
 * @param {...*} partialArgs - Các arguments được cố định từ phải
 * @returns {Function} Function mới
 * 
 * @example
 * const divide = (a, b) => a / b;
 * const divideBy2 = partialRight(divide, 2);
 * console.log(divideBy2(10)); // 5 (10 / 2)
 */
function partialRight(fn, ...partialArgs) {
  if (typeof fn !== 'function') {
    throw new TypeError('First argument must be a function');
  }

  return function(...remainingArgs) {
    return fn.apply(this, [...remainingArgs, ...partialArgs]);
  };
}

/**
 * Memoize - cache kết quả của function calls
 * 
 * @param {Function} fn - Function cần memoize
 * @returns {Function} Memoized function
 * 
 * @example
 * const fibonacci = memoize((n) => {
 *   if (n <= 1) return n;
 *   return fibonacci(n - 1) + fibonacci(n - 2);
 * });
 */
function memoize(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Argument must be a function');
  }

  const cache = new Map();

  return function(...args) {
    // Tạo cache key từ arguments
    const key = JSON.stringify(args);
    
    // Kiểm tra cache
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Tính toán và lưu vào cache
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * Once - function chỉ được gọi một lần duy nhất
 * 
 * @param {Function} fn - Function cần wrap
 * @returns {Function} Function chỉ execute một lần
 * 
 * @example
 * const initialize = once(() => console.log('Initialized'));
 * initialize(); // Logs: 'Initialized'
 * initialize(); // Không làm gì cả
 */
function once(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Argument must be a function');
  }

  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

/**
 * Flip - đảo ngược thứ tự arguments của function
 * 
 * @param {Function} fn - Function cần flip arguments
 * @returns {Function} Function với arguments đảo ngược
 * 
 * @example
 * const divide = (a, b) => a / b;
 * const flippedDivide = flip(divide);
 * console.log(flippedDivide(2, 10)); // 5 (10 / 2)
 */
function flip(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Argument must be a function');
  }

  return function(...args) {
    return fn.apply(this, args.reverse());
  };
}

/**
 * Identity function - trả về chính input
 * 
 * @param {*} value - Giá trị đầu vào
 * @returns {*} Chính giá trị đó
 */
function identity(value) {
  return value;
}

/**
 * Constant function - luôn trả về cùng một giá trị
 * 
 * @param {*} value - Giá trị cố định
 * @returns {Function} Function luôn trả về value
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * Negate - đảo ngược kết quả boolean của function
 * 
 * @param {Function} fn - Function trả về boolean
 * @returns {Function} Function với kết quả đảo ngược
 * 
 * @example
 * const isEven = x => x % 2 === 0;
 * const isOdd = negate(isEven);
 * console.log(isOdd(3)); // true
 */
function negate(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Argument must be a function');
  }

  return function(...args) {
    return !fn.apply(this, args);
  };
}

// Export các functions
module.exports = {
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
};
