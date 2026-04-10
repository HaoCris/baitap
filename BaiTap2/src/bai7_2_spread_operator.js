/**
 * Bài 7.2: Spread Operator
 * 
 * Các bài tập về spread operator trong JavaScript ES6+
 */

/**
 * Deep clone object
 * Sử dụng spread operator và recursion để clone nested objects
 * 
 * @param {*} obj - Object cần clone
 * @returns {*} Deep cloned object
 * 
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = cloneDeep(original);
 * cloned.b.c = 3;
 * console.log(original.b.c); // 2 (không bị thay đổi)
 */
function cloneDeep(obj) {
  // Xử lý primitive types và null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Xử lý Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Xử lý Array
  if (Array.isArray(obj)) {
    return obj.map(item => cloneDeep(item));
  }
  
  // Xử lý Object
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = cloneDeep(obj[key]);
    }
  }
  
  return cloned;
}

/**
 * Merge arrays và loại bỏ duplicates
 * Sử dụng spread operator và Set
 * 
 * @param {...Array} arrays - Các arrays cần merge
 * @returns {Array} Array đã merge và unique
 * 
 * @example
 * mergeArraysUnique([1, 2], [2, 3], [3, 4]); // [1, 2, 3, 4]
 */
function mergeArraysUnique(...arrays) {
  const merged = arrays.flat();
  return [...new Set(merged)];
}

/**
 * Cập nhật nested property immutably
 * Sử dụng spread operator để tạo object mới
 * 
 * @param {Object} obj - Object gốc
 * @param {string} path - Path đến property (dạng 'a.b.c')
 * @param {*} value - Giá trị mới
 * @returns {Object} Object mới với property đã cập nhật
 * 
 * @example
 * const obj = { a: { b: { c: 1 } } };
 * const updated = updateNestedObject(obj, 'a.b.c', 2);
 * // updated: { a: { b: { c: 2 } } }
 * // obj vẫn giữ nguyên
 */
function updateNestedObject(obj, path, value) {
  const keys = path.split('.');
  const [firstKey, ...restKeys] = keys;
  
  // Base case: chỉ còn 1 key
  if (keys.length === 1) {
    return {
      ...obj,
      [firstKey]: value
    };
  }
  
  // Recursive case: còn nhiều keys
  return {
    ...obj,
    [firstKey]: updateNestedObject(obj[firstKey] || {}, restKeys.join('.'), value)
  };
}

/**
 * Array operations immutably
 * Các operations immutable cho arrays
 */
const arrayOperations = {
  /**
   * Push immutably
   * 
   * @param {Array} arr - Array gốc
   * @param {...*} items - Items cần thêm
   * @returns {Array} Array mới với items đã được thêm
   * 
   * @example
   * arrayOperations.push([1, 2], 3, 4); // [1, 2, 3, 4]
   */
  push: (arr, ...items) => [...arr, ...items],
  
  /**
   * Pop immutably
   * 
   * @param {Array} arr - Array gốc
   * @returns {Array} Array mới không có phần tử cuối
   * 
   * @example
   * arrayOperations.pop([1, 2, 3]); // [1, 2]
   */
  pop: (arr) => arr.slice(0, -1),
  
  /**
   * Shift immutably
   * 
   * @param {Array} arr - Array gốc
   * @returns {Array} Array mới không có phần tử đầu
   * 
   * @example
   * arrayOperations.shift([1, 2, 3]); // [2, 3]
   */
  shift: (arr) => arr.slice(1),
  
  /**
   * Unshift immutably
   * 
   * @param {Array} arr - Array gốc
   * @param {...*} items - Items cần thêm vào đầu
   * @returns {Array} Array mới với items đã được thêm vào đầu
   * 
   * @example
   * arrayOperations.unshift([3, 4], 1, 2); // [1, 2, 3, 4]
   */
  unshift: (arr, ...items) => [...items, ...arr]
};

/**
 * Merge nested objects deeply
 * 
 * @param {...Object} objects - Objects cần merge
 * @returns {Object} Deep merged object
 * 
 * @example
 * mergeDeep({ a: { b: 1 } }, { a: { c: 2 } }); 
 * // { a: { b: 1, c: 2 } }
 */
function mergeDeep(...objects) {
  const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);
  
  return objects.reduce((merged, obj) => {
    Object.keys(obj).forEach(key => {
      const mergedValue = merged[key];
      const objValue = obj[key];
      
      if (isObject(mergedValue) && isObject(objValue)) {
        merged[key] = mergeDeep(mergedValue, objValue);
      } else {
        merged[key] = objValue;
      }
    });
    
    return merged;
  }, {});
}

/**
 * Clone array và apply transformation
 * 
 * @param {Array} arr - Array gốc
 * @param {Function} transform - Function transform từng phần tử
 * @returns {Array} Array mới đã transformed
 * 
 * @example
 * cloneAndTransform([1, 2, 3], x => x * 2); // [2, 4, 6]
 */
function cloneAndTransform(arr, transform) {
  return [...arr].map(transform);
}

/**
 * Insert vào vị trí immutably
 * 
 * @param {Array} arr - Array gốc
 * @param {number} index - Vị trí insert
 * @param {...*} items - Items cần insert
 * @returns {Array} Array mới với items đã insert
 * 
 * @example
 * insertAt([1, 2, 5], 2, 3, 4); // [1, 2, 3, 4, 5]
 */
function insertAt(arr, index, ...items) {
  return [
    ...arr.slice(0, index),
    ...items,
    ...arr.slice(index)
  ];
}

/**
 * Remove vị trí immutably
 * 
 * @param {Array} arr - Array gốc
 * @param {number} index - Vị trí cần xóa
 * @param {number} count - Số lượng phần tử cần xóa (default: 1)
 * @returns {Array} Array mới đã xóa
 * 
 * @example
 * removeAt([1, 2, 3, 4, 5], 2, 2); // [1, 2, 5]
 */
function removeAt(arr, index, count = 1) {
  return [
    ...arr.slice(0, index),
    ...arr.slice(index + count)
  ];
}

/**
 * Update vị trí immutably
 * 
 * @param {Array} arr - Array gốc
 * @param {number} index - Vị trí cần update
 * @param {*} value - Giá trị mới
 * @returns {Array} Array mới với value đã update
 * 
 * @example
 * updateAt([1, 2, 3], 1, 10); // [1, 10, 3]
 */
function updateAt(arr, index, value) {
  return [
    ...arr.slice(0, index),
    value,
    ...arr.slice(index + 1)
  ];
}

/**
 * Reverse array immutably
 * 
 * @param {Array} arr - Array gốc
 * @returns {Array} Array đã reverse
 * 
 * @example
 * reverseArray([1, 2, 3]); // [3, 2, 1]
 */
function reverseArray(arr) {
  return [...arr].reverse();
}

/**
 * Sort array immutably
 * 
 * @param {Array} arr - Array gốc
 * @param {Function} compareFn - Compare function (optional)
 * @returns {Array} Array đã sort
 * 
 * @example
 * sortArray([3, 1, 2]); // [1, 2, 3]
 */
function sortArray(arr, compareFn) {
  return [...arr].sort(compareFn);
}

/**
 * Flatten array immutably
 * 
 * @param {Array} arr - Array gốc (có thể nested)
 * @param {number} depth - Độ sâu flatten (default: Infinity)
 * @returns {Array} Array đã flatten
 * 
 * @example
 * flattenArray([1, [2, [3, 4]]]); // [1, 2, 3, 4]
 */
function flattenArray(arr, depth = Infinity) {
  if (depth === 0) return [...arr];
  
  return arr.reduce((flat, item) => {
    if (Array.isArray(item)) {
      return [...flat, ...flattenArray(item, depth - 1)];
    }
    return [...flat, item];
  }, []);
}

/**
 * Tách array thành chunks
 * 
 * @param {Array} arr - Array gốc
 * @param {number} size - Kích thước mỗi chunk
 * @returns {Array<Array>} Array of chunks
 * 
 * @example
 * chunkArray([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 */
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push([...arr.slice(i, i + size)]);
  }
  return chunks;
}

/**
 * Toggle item trong array immutably
 * Thêm nếu không có, xóa nếu có
 * 
 * @param {Array} arr - Array gốc
 * @param {*} item - Item cần toggle
 * @returns {Array} Array mới sau khi toggle
 * 
 * @example
 * toggleItem([1, 2, 3], 2); // [1, 3]
 * toggleItem([1, 3], 2); // [1, 3, 2]
 */
function toggleItem(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1) {
    return removeAt(arr, index);
  }
  return [...arr, item];
}

/**
 * Replace item trong array immutably
 * 
 * @param {Array} arr - Array gốc
 * @param {*} oldItem - Item cần replace
 * @param {*} newItem - Item mới
 * @returns {Array} Array mới sau khi replace
 * 
 * @example
 * replaceItem([1, 2, 3], 2, 10); // [1, 10, 3]
 */
function replaceItem(arr, oldItem, newItem) {
  const index = arr.indexOf(oldItem);
  if (index === -1) return [...arr];
  return updateAt(arr, index, newItem);
}

/**
 * Combine objects với default values
 * 
 * @param {Object} defaults - Default values
 * @param {Object} overrides - Override values
 * @returns {Object} Combined object
 * 
 * @example
 * combineWithDefaults({ a: 1, b: 2 }, { b: 3, c: 4 });
 * // { a: 1, b: 3, c: 4 }
 */
function combineWithDefaults(defaults, overrides) {
  return { ...defaults, ...overrides };
}

module.exports = {
  cloneDeep,
  mergeArraysUnique,
  updateNestedObject,
  arrayOperations,
  mergeDeep,
  cloneAndTransform,
  insertAt,
  removeAt,
  updateAt,
  reverseArray,
  sortArray,
  flattenArray,
  chunkArray,
  toggleItem,
  replaceItem,
  combineWithDefaults
};
