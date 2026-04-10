/**
 * Bài 8.2: ES6 Modules
 * 
 * Main entry point - Re-export all modules
 */

// Named exports from each module
export * from './mathUtils.js';
export * from './stringUtils.js';
export * from './arrayUtils.js';
export * from './constants.js';

// Default exports as namespace
import mathUtils from './mathUtils.js';
import stringUtils from './stringUtils.js';
import arrayUtils from './arrayUtils.js';
import constants from './constants.js';

export {
  mathUtils,
  stringUtils,
  arrayUtils,
  constants
};

// Combined default export
export default {
  math: mathUtils,
  string: stringUtils,
  array: arrayUtils,
  constants
};
