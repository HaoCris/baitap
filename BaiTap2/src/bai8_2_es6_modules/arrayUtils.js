/**
 * Array Utility Functions
 * Các hàm tiện ích xử lý mảng
 */

/**
 * Lấy phần tử đầu tiên
 * @param {Array} arr 
 * @returns {*}
 */
export const first = (arr) => arr[0];

/**
 * Lấy phần tử cuối cùng
 * @param {Array} arr 
 * @returns {*}
 */
export const last = (arr) => arr[arr.length - 1];

/**
 * Loại bỏ duplicates
 * @param {Array} arr 
 * @returns {Array}
 */
export const unique = (arr) => [...new Set(arr)];

/**
 * Flatten array nhiều cấp
 * @param {Array} arr 
 * @param {number} depth 
 * @returns {Array}
 */
export const flatten = (arr, depth = Infinity) => {
  if (depth === 0) return arr.slice();
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
};

/**
 * Chia array thành chunks
 * @param {Array} arr 
 * @param {number} size 
 * @returns {Array}
 */
export const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Xáo trộn array (Fisher-Yates)
 * @param {Array} arr 
 * @returns {Array}
 */
export const shuffle = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Lấy phần tử ngẫu nhiên
 * @param {Array} arr 
 * @returns {*}
 */
export const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Lấy nhiều phần tử ngẫu nhiên
 * @param {Array} arr 
 * @param {number} n 
 * @returns {Array}
 */
export const sampleMany = (arr, n) => shuffle(arr).slice(0, n);

/**
 * Tính tổng
 * @param {number[]} arr 
 * @returns {number}
 */
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

/**
 * Tính trung bình
 * @param {number[]} arr 
 * @returns {number}
 */
export const average = (arr) => arr.length === 0 ? 0 : sum(arr) / arr.length;

/**
 * Tìm giá trị lớn nhất
 * @param {number[]} arr 
 * @returns {number}
 */
export const max = (arr) => Math.max(...arr);

/**
 * Tìm giá trị nhỏ nhất
 * @param {number[]} arr 
 * @returns {number}
 */
export const min = (arr) => Math.min(...arr);

/**
 * Giao của hai mảng
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns {Array}
 */
export const intersection = (arr1, arr2) => {
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item));
};

/**
 * Hiệu của hai mảng
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns {Array}
 */
export const difference = (arr1, arr2) => {
  const set2 = new Set(arr2);
  return arr1.filter(item => !set2.has(item));
};

/**
 * Hợp của hai mảng
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns {Array}
 */
export const union = (arr1, arr2) => unique([...arr1, ...arr2]);

/**
 * Nhóm array theo key
 * @param {Array} arr 
 * @param {string|Function} key 
 * @returns {Object}
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    acc[groupKey] = acc[groupKey] || [];
    acc[groupKey].push(item);
    return acc;
  }, {});
};

/**
 * Zip nhiều arrays
 * @param  {...Array} arrays 
 * @returns {Array}
 */
export const zip = (...arrays) => {
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  return Array.from({ length: maxLength }, (_, i) =>
    arrays.map(arr => arr[i])
  );
};

export default {
  first,
  last,
  unique,
  flatten,
  chunk,
  shuffle,
  sample,
  sampleMany,
  sum,
  average,
  max,
  min,
  intersection,
  difference,
  union,
  groupBy,
  zip
};
