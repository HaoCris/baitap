/**
 * Bài 2.1: Custom Array Methods
 * 
 * Implement các higher-order functions không sử dụng built-in methods
 */

/**
 * Custom implementation của Array.prototype.map
 * @param {Array} array - Mảng đầu vào
 * @param {Function} callback - Function được gọi cho mỗi phần tử
 * @returns {Array} Mảng mới với các phần tử đã được transform
 * 
 * @example
 * customMap([1, 2, 3], x => x * 2); // [2, 4, 6]
 */
function customMap(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }

  const result = [];
  for (let i = 0; i < array.length; i++) {
    // callback nhận 3 tham số: element, index, array
    result.push(callback(array[i], i, array));
  }
  return result;
}

/**
 * Custom implementation của Array.prototype.filter
 * @param {Array} array - Mảng đầu vào
 * @param {Function} callback - Function kiểm tra điều kiện
 * @returns {Array} Mảng mới chỉ chứa các phần tử thỏa điều kiện
 * 
 * @example
 * customFilter([1, 2, 3, 4], x => x > 2); // [3, 4]
 */
function customFilter(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }

  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

/**
 * Custom implementation của Array.prototype.reduce
 * @param {Array} array - Mảng đầu vào
 * @param {Function} callback - Function reducer
 * @param {*} [initialValue] - Giá trị khởi tạo
 * @returns {*} Giá trị tích lũy cuối cùng
 * 
 * @example
 * customReduce([1, 2, 3, 4], (acc, cur) => acc + cur, 0); // 10
 */
function customReduce(array, callback, initialValue) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }

  if (array.length === 0 && initialValue === undefined) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let accumulator;
  let startIndex;

  if (initialValue !== undefined) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    // callback nhận 4 tham số: accumulator, currentValue, index, array
    accumulator = callback(accumulator, array[i], i, array);
  }

  return accumulator;
}

/**
 * Custom implementation của Array.prototype.find
 * @param {Array} array - Mảng đầu vào
 * @param {Function} callback - Function kiểm tra điều kiện
 * @returns {*} Phần tử đầu tiên thỏa điều kiện hoặc undefined
 * 
 * @example
 * customFind([1, 2, 3, 4], x => x > 2); // 3
 */
function customFind(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }

  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      return array[i];
    }
  }
  return undefined;
}

/**
 * Custom implementation của Array.prototype.every
 * @param {Array} array - Mảng đầu vào
 * @param {Function} callback - Function kiểm tra điều kiện
 * @returns {boolean} true nếu tất cả phần tử thỏa điều kiện
 * 
 * @example
 * customEvery([2, 4, 6], x => x % 2 === 0); // true
 */
function customEvery(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }

  for (let i = 0; i < array.length; i++) {
    if (!callback(array[i], i, array)) {
      return false;
    }
  }
  return true;
}

/**
 * Custom implementation của Array.prototype.some
 * @param {Array} array - Mảng đầu vào
 * @param {Function} callback - Function kiểm tra điều kiện
 * @returns {boolean} true nếu có ít nhất một phần tử thỏa điều kiện
 * 
 * @example
 * customSome([1, 2, 3, 4], x => x > 3); // true
 */
function customSome(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }

  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Custom implementation của Array.prototype.findIndex
 * @param {Array} array - Mảng đầu vào
 * @param {Function} callback - Function kiểm tra điều kiện
 * @returns {number} Index của phần tử đầu tiên thỏa điều kiện hoặc -1
 */
function customFindIndex(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }

  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      return i;
    }
  }
  return -1;
}

/**
 * Custom implementation của Array.prototype.forEach
 * @param {Array} array - Mảng đầu vào
 * @param {Function} callback - Function được gọi cho mỗi phần tử
 */
function customForEach(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }

  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}

module.exports = {
  customMap,
  customFilter,
  customReduce,
  customFind,
  customEvery,
  customSome,
  customFindIndex,
  customForEach
};
