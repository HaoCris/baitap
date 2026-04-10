/**
 * String Utility Functions
 * Các hàm tiện ích xử lý chuỗi
 */

/**
 * Chuyển chuỗi thành Title Case
 * @param {string} str 
 * @returns {string}
 * @example titleCase('hello world') // 'Hello World'
 */
export const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Chuyển chuỗi thành camelCase
 * @param {string} str 
 * @returns {string}
 * @example camelCase('hello world') // 'helloWorld'
 */
export const camelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
};

/**
 * Chuyển chuỗi thành snake_case
 * @param {string} str 
 * @returns {string}
 * @example snakeCase('helloWorld') // 'hello_world'
 */
export const snakeCase = (str) => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/\s+/g, '_');
};

/**
 * Chuyển chuỗi thành kebab-case
 * @param {string} str 
 * @returns {string}
 * @example kebabCase('helloWorld') // 'hello-world'
 */
export const kebabCase = (str) => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/\s+/g, '-');
};

/**
 * Đảo ngược chuỗi
 * @param {string} str 
 * @returns {string}
 */
export const reverse = (str) => str.split('').reverse().join('');

/**
 * Kiểm tra palindrome
 * @param {string} str 
 * @returns {boolean}
 */
export const isPalindrome = (str) => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
};

/**
 * Đếm số từ trong chuỗi
 * @param {string} str 
 * @returns {number}
 */
export const wordCount = (str) => {
  const words = str.trim().split(/\s+/);
  return words[0] === '' ? 0 : words.length;
};

/**
 * Cắt ngắn chuỗi
 * @param {string} str 
 * @param {number} length 
 * @param {string} suffix 
 * @returns {string}
 */
export const truncate = (str, length, suffix = '...') => {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};

/**
 * Tạo slug từ chuỗi
 * @param {string} str 
 * @returns {string}
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default {
  titleCase,
  camelCase,
  snakeCase,
  kebabCase,
  reverse,
  isPalindrome,
  wordCount,
  truncate,
  slugify
};
