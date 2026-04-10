/**
 * Bài 1.1: Counter với Closure
 * 
 * Sử dụng closure để tạo counter với private state
 * Giá trị counter không thể truy cập trực tiếp từ bên ngoài
 */

/**
 * Tạo một counter object với các methods để thao tác
 * @param {number} [initialValue=0] - Giá trị khởi tạo của counter
 * @returns {Object} Object chứa các methods: increment, decrement, getValue, reset
 * 
 * @example
 * const counter = createCounter();
 * counter.increment();
 * counter.increment();
 * console.log(counter.getValue()); // 2
 * counter.decrement();
 * console.log(counter.getValue()); // 1
 * counter.reset();
 * console.log(counter.getValue()); // 0
 */
function createCounter(initialValue = 0) {
  // Private variable - không thể truy cập từ bên ngoài
  let count = initialValue;

  // Trả về object với các public methods
  return {
    /**
     * Tăng giá trị counter lên 1
     * @returns {number} Giá trị mới của counter
     */
    increment() {
      count += 1;
      return count;
    },

    /**
     * Giảm giá trị counter xuống 1
     * @returns {number} Giá trị mới của counter
     */
    decrement() {
      count -= 1;
      return count;
    },

    /**
     * Lấy giá trị hiện tại của counter
     * @returns {number} Giá trị hiện tại
     */
    getValue() {
      return count;
    },

    /**
     * Đặt lại counter về giá trị khởi tạo
     * @returns {number} Giá trị sau khi reset (0)
     */
    reset() {
      count = 0;
      return count;
    }
  };
}

/**
 * Tạo counter với step tùy chỉnh
 * @param {number} [step=1] - Bước nhảy của counter
 * @returns {Object} Counter object với step tùy chỉnh
 */
function createStepCounter(step = 1) {
  let count = 0;

  return {
    increment() {
      count += step;
      return count;
    },
    decrement() {
      count -= step;
      return count;
    },
    getValue() {
      return count;
    },
    reset() {
      count = 0;
      return count;
    },
    setStep(newStep) {
      step = newStep;
    }
  };
}

module.exports = {
  createCounter,
  createStepCounter
};
