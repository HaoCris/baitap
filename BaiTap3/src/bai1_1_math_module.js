/**
 * Bài 1.1: Math Module
 * 
 * Module chứa các phép toán toán học cơ bản
 * @module mathOperations
 */

/**
 * Cộng hai số
 * @param {number} a - Số thứ nhất
 * @param {number} b - Số thứ hai
 * @returns {number} Tổng của a và b
 */
function add(a, b) {
  return a + b;
}

/**
 * Trừ hai số
 * @param {number} a - Số bị trừ
 * @param {number} b - Số trừ
 * @returns {number} Hiệu của a và b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Nhân hai số
 * @param {number} a - Số thứ nhất
 * @param {number} b - Số thứ hai
 * @returns {number} Tích của a và b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Chia hai số
 * @param {number} a - Số bị chia
 * @param {number} b - Số chia
 * @returns {number} Thương của a và b
 * @throws {Error} Nếu chia cho 0
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

/**
 * Tính lũy thừa
 * @param {number} base - Cơ số
 * @param {number} exponent - Số mũ
 * @returns {number} base^exponent
 */
function power(base, exponent) {
  return Math.pow(base, exponent);
}

/**
 * Tính giai thừa
 * @param {number} n - Số nguyên không âm
 * @returns {number} n!
 * @throws {Error} Nếu n < 0 hoặc không phải số nguyên
 */
function factorial(n) {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  if (!Number.isInteger(n)) {
    throw new Error('Factorial is only defined for integers');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Kiểm tra số nguyên tố
 * @param {number} n - Số cần kiểm tra
 * @returns {boolean} true nếu n là số nguyên tố
 */
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  const sqrt = Math.sqrt(n);
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Tạo dãy Fibonacci
 * @param {number} n - Số lượng phần tử
 * @returns {number[]} Mảng n số Fibonacci đầu tiên
 * @throws {Error} Nếu n < 1
 */
function fibonacci(n) {
  if (n < 1) {
    throw new Error('n must be at least 1');
  }
  if (n === 1) return [0];
  if (n === 2) return [0, 1];
  
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result;
}

/**
 * Tìm ước chung lớn nhất (GCD)
 * @param {number} a - Số thứ nhất
 * @param {number} b - Số thứ hai
 * @returns {number} GCD của a và b
 */
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Tìm bội chung nhỏ nhất (LCM)
 * @param {number} a - Số thứ nhất
 * @param {number} b - Số thứ hai
 * @returns {number} LCM của a và b
 */
function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Tính tổng các số trong mảng
 * @param {number[]} numbers - Mảng các số
 * @returns {number} Tổng các số
 */
function sum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * Tính trung bình cộng
 * @param {number[]} numbers - Mảng các số
 * @returns {number} Trung bình cộng
 * @throws {Error} Nếu mảng rỗng
 */
function average(numbers) {
  if (numbers.length === 0) {
    throw new Error('Cannot calculate average of empty array');
  }
  return sum(numbers) / numbers.length;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  factorial,
  isPrime,
  fibonacci,
  gcd,
  lcm,
  sum,
  average
};
