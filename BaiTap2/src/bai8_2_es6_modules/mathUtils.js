/**
 * Math Utility Functions
 * Các hàm tiện ích toán học
 */

/**
 * Cộng hai số
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export const add = (a, b) => a + b;

/**
 * Trừ hai số
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export const subtract = (a, b) => a - b;

/**
 * Nhân hai số
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export const multiply = (a, b) => a * b;

/**
 * Chia hai số
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 * @throws {Error} Nếu chia cho 0
 */
export const divide = (a, b) => {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
};

/**
 * Tính lũy thừa
 * @param {number} base 
 * @param {number} exponent 
 * @returns {number}
 */
export const power = (base, exponent) => Math.pow(base, exponent);

/**
 * Tính giai thừa
 * @param {number} n 
 * @returns {number}
 */
export const factorial = (n) => {
  if (n < 0) throw new Error('Factorial of negative number is undefined');
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

/**
 * Tính ước chung lớn nhất (GCD)
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

/**
 * Tính bội chung nhỏ nhất (LCM)
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

export default {
  add,
  subtract,
  multiply,
  divide,
  power,
  factorial,
  gcd,
  lcm
};
