module.exports = {
  // Môi trường test
  testEnvironment: 'node',

  // Thư mục chứa tests
  testMatch: ['**/tests/**/*.test.js'],

  // Thư mục bỏ qua
  testPathIgnorePatterns: ['/node_modules/'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/index.js'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset modules between tests
  resetModules: true
};
