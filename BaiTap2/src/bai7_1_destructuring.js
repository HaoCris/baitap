/**
 * Bài 7.1: Destructuring
 * 
 * Các bài tập về destructuring trong JavaScript ES6+
 */

/**
 * Destructure nested object và trả về thông tin user
 * 
 * @param {Object} user - User object có thể chứa nested data
 * @returns {Object} Object chứa các thông tin đã extract
 * 
 * @example
 * const user = {
 *   id: 1,
 *   name: 'John Doe',
 *   contact: {
 *     email: 'john@example.com',
 *     phone: '123-456-7890',
 *     address: {
 *       street: '123 Main St',
 *       city: 'New York',
 *       country: 'USA'
 *     }
 *   }
 * };
 * extractUserInfo(user);
 * // { id: 1, name: 'John Doe', email: 'john@example.com', city: 'New York' }
 */
function extractUserInfo(user) {
  const {
    id,
    name,
    contact: {
      email,
      address: {
        city
      } = {}
    } = {}
  } = user || {};
  
  return {
    id,
    name,
    email,
    city
  };
}

/**
 * Hoán đổi giá trị sử dụng destructuring
 * 
 * @param {*} a - Giá trị đầu tiên
 * @param {*} b - Giá trị thứ hai
 * @returns {Array} Array chứa [b, a]
 * 
 * @example
 * swapValues(1, 2); // [2, 1]
 * swapValues('hello', 'world'); // ['world', 'hello']
 */
function swapValues(a, b) {
  return [b, a];
}

/**
 * Lấy phần tử đầu và rest của array
 * 
 * @param {Array} array - Array cần xử lý
 * @returns {Object} Object chứa first và rest
 * 
 * @example
 * getFirstAndRest([1, 2, 3, 4]); // { first: 1, rest: [2, 3, 4] }
 * getFirstAndRest([5]); // { first: 5, rest: [] }
 * getFirstAndRest([]); // { first: undefined, rest: [] }
 */
function getFirstAndRest(array) {
  const [first, ...rest] = array || [];
  return { first, rest };
}

/**
 * Merge nhiều objects thành một object mới
 * Sử dụng spread operator để merge
 * Properties của objects sau sẽ override properties trước
 * 
 * @param {...Object} objects - Các objects cần merge
 * @returns {Object} Object đã merge
 * 
 * @example
 * mergeObjects({ a: 1 }, { b: 2 }, { c: 3 }); 
 * // { a: 1, b: 2, c: 3 }
 * 
 * mergeObjects({ a: 1, b: 2 }, { b: 3, c: 4 }); 
 * // { a: 1, b: 3, c: 4 }
 */
function mergeObjects(...objects) {
  return objects.reduce((merged, obj) => ({ ...merged, ...obj }), {});
}

/**
 * Xóa property và trả về object mới (immutable)
 * Sử dụng destructuring để tạo object mới không có property
 * 
 * @param {Object} obj - Object gốc
 * @param {string} prop - Property cần xóa
 * @returns {Object} Object mới không có property đã xóa
 * 
 * @example
 * removeProperty({ a: 1, b: 2, c: 3 }, 'b'); 
 * // { a: 1, c: 3 }
 * 
 * const original = { x: 10, y: 20 };
 * const result = removeProperty(original, 'x');
 * // original vẫn giữ nguyên { x: 10, y: 20 }
 * // result là { y: 20 }
 */
function removeProperty(obj, prop) {
  const { [prop]: removed, ...rest } = obj || {};
  return rest;
}

/**
 * Extract multiple properties từ object
 * 
 * @param {Object} obj - Object gốc
 * @param {Array<string>} props - Array of property names to extract
 * @returns {Object} Object chỉ chứa các properties được chỉ định
 * 
 * @example
 * extractProperties({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'c']);
 * // { a: 1, c: 3 }
 */
function extractProperties(obj, props) {
  return props.reduce((result, prop) => {
    if (prop in obj) {
      result[prop] = obj[prop];
    }
    return result;
  }, {});
}

/**
 * Rename object properties using destructuring
 * 
 * @param {Object} obj - Object gốc
 * @param {Object} mapping - Object mapping old names to new names
 * @returns {Object} Object mới với properties đã rename
 * 
 * @example
 * renameProperties(
 *   { firstName: 'John', lastName: 'Doe' },
 *   { firstName: 'first', lastName: 'last' }
 * );
 * // { first: 'John', last: 'Doe' }
 */
function renameProperties(obj, mapping) {
  const result = { ...obj };
  
  Object.entries(mapping).forEach(([oldKey, newKey]) => {
    if (oldKey in result) {
      result[newKey] = result[oldKey];
      delete result[oldKey];
    }
  });
  
  return result;
}

/**
 * Destructure array of objects và extract specific property
 * 
 * @param {Array<Object>} array - Array of objects
 * @param {string} prop - Property name to extract
 * @returns {Array} Array of extracted values
 * 
 * @example
 * const users = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' }
 * ];
 * pluckProperty(users, 'name'); // ['John', 'Jane']
 */
function pluckProperty(array, prop) {
  return array.map(obj => obj[prop]);
}

/**
 * Default values with destructuring
 * 
 * @param {Object} options - Options object
 * @returns {Object} Options với default values
 * 
 * @example
 * setDefaults({ name: 'John' });
 * // { name: 'John', age: 18, country: 'Vietnam' }
 */
function setDefaults(options = {}) {
  const {
    name = 'Anonymous',
    age = 18,
    country = 'Vietnam',
    ...rest
  } = options;
  
  return {
    name,
    age,
    country,
    ...rest
  };
}

/**
 * Destructure function parameters
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.host - Host name
 * @param {number} config.port - Port number
 * @param {string} config.protocol - Protocol (http/https)
 * @returns {string} Full URL
 * 
 * @example
 * buildUrl({ host: 'example.com', port: 8080, protocol: 'https' });
 * // 'https://example.com:8080'
 */
function buildUrl({ host = 'localhost', port = 80, protocol = 'http' } = {}) {
  return `${protocol}://${host}:${port}`;
}

/**
 * Nested destructuring với arrays
 * 
 * @param {Array} matrix - 2D array (matrix)
 * @returns {Object} Object chứa các giá trị extracted
 * 
 * @example
 * extractFromMatrix([
 *   [1, 2, 3],
 *   [4, 5, 6],
 *   [7, 8, 9]
 * ]);
 * // { firstRow: [1, 2, 3], firstOfSecondRow: 4, restOfMatrix: [[7, 8, 9]] }
 */
function extractFromMatrix(matrix) {
  const [firstRow = [], secondRow = [], ...restOfMatrix] = matrix || [];
  const [firstOfSecondRow] = secondRow;
  
  return {
    firstRow,
    firstOfSecondRow,
    restOfMatrix
  };
}

/**
 * Combine multiple destructuring patterns
 * 
 * @param {Object} data - Complex nested data structure
 * @returns {Object} Simplified extracted data
 * 
 * @example
 * const data = {
 *   user: {
 *     id: 1,
 *     profile: {
 *       name: 'John',
 *       contacts: ['email@test.com', '123-456']
 *     }
 *   },
 *   settings: {
 *     theme: 'dark'
 *   }
 * };
 * extractComplexData(data);
 * // { id: 1, name: 'John', email: 'email@test.com', theme: 'dark' }
 */
function extractComplexData(data) {
  const {
    user: {
      id,
      profile: {
        name,
        contacts: [email] = []
      } = {}
    } = {},
    settings: {
      theme = 'light'
    } = {}
  } = data || {};
  
  return { id, name, email, theme };
}

/**
 * Rest parameters để loại bỏ multiple properties
 * 
 * @param {Object} obj - Object gốc
 * @param {Array<string>} propsToRemove - Array of property names to remove
 * @returns {Object} Object mới không có các properties đã xóa
 * 
 * @example
 * removeProperties({ a: 1, b: 2, c: 3, d: 4 }, ['b', 'd']);
 * // { a: 1, c: 3 }
 */
function removeProperties(obj, propsToRemove) {
  const result = { ...obj };
  propsToRemove.forEach(prop => {
    delete result[prop];
  });
  return result;
}

module.exports = {
  extractUserInfo,
  swapValues,
  getFirstAndRest,
  mergeObjects,
  removeProperty,
  extractProperties,
  renameProperties,
  pluckProperty,
  setDefaults,
  buildUrl,
  extractFromMatrix,
  extractComplexData,
  removeProperties
};
