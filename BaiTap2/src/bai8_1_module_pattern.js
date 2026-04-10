/**
 * Bài 8.1: Module Pattern
 * 
 * Module pattern sử dụng closures để tạo private methods và variables
 */

/**
 * Tạo Calculator module với private methods và history tracking
 * 
 * @returns {Object} Calculator instance với public API
 * 
 * @example
 * const calc = Calculator();
 * calc.add(5, 3); // 8
 * calc.subtract(10, 4); // 6
 * console.log(calc.getHistory()); // ['5 + 3 = 8', '10 - 4 = 6']
 */
function Calculator() {
  // Private variables
  let history = [];
  
  /**
   * Private method: Validate number
   * 
   * @private
   * @param {*} num - Value to validate
   * @throws {TypeError} If value is not a valid number
   */
  function _validate(num) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      throw new TypeError(`Invalid number: ${num}`);
    }
  }
  
  /**
   * Private helper: Thêm operation vào history
   * 
   * @private
   * @param {number} a - First operand
   * @param {string} operator - Operator symbol
   * @param {number} b - Second operand
   * @param {number} result - Operation result
   */
  function _addToHistory(a, operator, b, result) {
    const entry = `${a} ${operator} ${b} = ${result}`;
    history.push(entry);
  }
  
  // Public API
  return {
    /**
     * Cộng hai số
     * 
     * @param {number} a - Số thứ nhất
     * @param {number} b - Số thứ hai
     * @returns {number} Tổng của a và b
     * 
     * @example
     * calc.add(5, 3); // 8
     */
    add(a, b) {
      _validate(a);
      _validate(b);
      const result = a + b;
      _addToHistory(a, '+', b, result);
      return result;
    },
    
    /**
     * Trừ hai số
     * 
     * @param {number} a - Số bị trừ
     * @param {number} b - Số trừ
     * @returns {number} Hiệu của a và b
     * 
     * @example
     * calc.subtract(10, 4); // 6
     */
    subtract(a, b) {
      _validate(a);
      _validate(b);
      const result = a - b;
      _addToHistory(a, '-', b, result);
      return result;
    },
    
    /**
     * Nhân hai số
     * 
     * @param {number} a - Số thứ nhất
     * @param {number} b - Số thứ hai
     * @returns {number} Tích của a và b
     * 
     * @example
     * calc.multiply(5, 4); // 20
     */
    multiply(a, b) {
      _validate(a);
      _validate(b);
      const result = a * b;
      _addToHistory(a, '*', b, result);
      return result;
    },
    
    /**
     * Chia hai số
     * 
     * @param {number} a - Số bị chia
     * @param {number} b - Số chia
     * @returns {number} Thương của a và b
     * @throws {Error} Nếu chia cho 0
     * 
     * @example
     * calc.divide(20, 4); // 5
     */
    divide(a, b) {
      _validate(a);
      _validate(b);
      
      if (b === 0) {
        throw new Error('Cannot divide by zero');
      }
      
      const result = a / b;
      _addToHistory(a, '/', b, result);
      return result;
    },
    
    /**
     * Lấy lịch sử các phép tính
     * 
     * @returns {Array<string>} Array of history entries
     * 
     * @example
     * calc.getHistory(); // ['5 + 3 = 8', '10 - 4 = 6']
     */
    getHistory() {
      return [...history]; // Return copy để protect internal state
    },
    
    /**
     * Xóa toàn bộ lịch sử
     * 
     * @returns {void}
     * 
     * @example
     * calc.clearHistory();
     * calc.getHistory(); // []
     */
    clearHistory() {
      history = [];
    }
  };
}

/**
 * Singleton Calculator Pattern
 * Đảm bảo chỉ có 1 instance duy nhất
 * 
 * @returns {Object} Calculator singleton instance
 * 
 * @example
 * const calc1 = SingletonCalculator();
 * const calc2 = SingletonCalculator();
 * calc1 === calc2; // true
 */
const SingletonCalculator = (function() {
  let instance;
  
  function createInstance() {
    return Calculator();
  }
  
  return function() {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  };
})();

/**
 * Advanced Calculator với thêm tính năng
 * 
 * @returns {Object} Advanced Calculator instance
 */
function AdvancedCalculator() {
  // Private variables
  let history = [];
  let memory = 0;
  
  /**
   * Private method: Validate number
   * 
   * @private
   */
  function _validate(num) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      throw new TypeError(`Invalid number: ${num}`);
    }
  }
  
  /**
   * Private helper: Add to history
   * 
   * @private
   */
  function _addToHistory(entry) {
    history.push(entry);
  }
  
  // Get base calculator methods
  const baseCalc = Calculator();
  
  // Public API - extend base calculator
  return {
    // Inherit base methods
    add: baseCalc.add,
    subtract: baseCalc.subtract,
    multiply: baseCalc.multiply,
    divide: baseCalc.divide,
    getHistory: baseCalc.getHistory,
    clearHistory: baseCalc.clearHistory,
    
    /**
     * Tính lũy thừa
     * 
     * @param {number} base - Số cơ số
     * @param {number} exponent - Số mũ
     * @returns {number} base^exponent
     */
    power(base, exponent) {
      _validate(base);
      _validate(exponent);
      const result = Math.pow(base, exponent);
      _addToHistory(`${base} ^ ${exponent} = ${result}`);
      return result;
    },
    
    /**
     * Tính căn bậc hai
     * 
     * @param {number} num - Số cần tính căn
     * @returns {number} √num
     * @throws {Error} Nếu num < 0
     */
    sqrt(num) {
      _validate(num);
      
      if (num < 0) {
        throw new Error('Cannot calculate square root of negative number');
      }
      
      const result = Math.sqrt(num);
      _addToHistory(`√${num} = ${result}`);
      return result;
    },
    
    /**
     * Lưu giá trị vào memory
     * 
     * @param {number} value - Giá trị cần lưu
     */
    memoryStore(value) {
      _validate(value);
      memory = value;
    },
    
    /**
     * Lấy giá trị từ memory
     * 
     * @returns {number} Memory value
     */
    memoryRecall() {
      return memory;
    },
    
    /**
     * Xóa memory
     */
    memoryClear() {
      memory = 0;
    },
    
    /**
     * Cộng vào memory
     * 
     * @param {number} value - Giá trị cần cộng
     */
    memoryAdd(value) {
      _validate(value);
      memory += value;
    }
  };
}

/**
 * Counter Module Pattern
 * Đơn giản hơn để minh họa pattern
 * 
 * @param {number} initialValue - Initial counter value
 * @returns {Object} Counter instance
 */
function Counter(initialValue = 0) {
  // Private variable
  let count = initialValue;
  
  /**
   * Private method: Validate step
   */
  function _validateStep(step) {
    if (typeof step !== 'number' || isNaN(step)) {
      throw new TypeError('Step must be a valid number');
    }
  }
  
  // Public API
  return {
    /**
     * Tăng counter
     * 
     * @param {number} step - Số lượng tăng (default: 1)
     * @returns {number} Current count
     */
    increment(step = 1) {
      _validateStep(step);
      count += step;
      return count;
    },
    
    /**
     * Giảm counter
     * 
     * @param {number} step - Số lượng giảm (default: 1)
     * @returns {number} Current count
     */
    decrement(step = 1) {
      _validateStep(step);
      count -= step;
      return count;
    },
    
    /**
     * Lấy giá trị hiện tại
     * 
     * @returns {number} Current count
     */
    getValue() {
      return count;
    },
    
    /**
     * Reset về giá trị ban đầu
     */
    reset() {
      count = initialValue;
    }
  };
}

/**
 * Module Pattern với IIFE
 * Tạo namespace để tránh pollution global scope
 */
const MathUtils = (function() {
  // Private constants
  const PI = Math.PI;
  const E = Math.E;
  
  // Private helper
  function _isPositive(num) {
    return num > 0;
  }
  
  // Public API
  return {
    /**
     * Tính diện tích hình tròn
     */
    circleArea(radius) {
      if (!_isPositive(radius)) {
        throw new Error('Radius must be positive');
      }
      return PI * radius * radius;
    },
    
    /**
     * Tính chu vi hình tròn
     */
    circleCircumference(radius) {
      if (!_isPositive(radius)) {
        throw new Error('Radius must be positive');
      }
      return 2 * PI * radius;
    },
    
    /**
     * Expose constants (readonly)
     */
    constants: {
      PI: PI,
      E: E
    }
  };
})();

module.exports = {
  Calculator,
  SingletonCalculator,
  AdvancedCalculator,
  Counter,
  MathUtils
};
