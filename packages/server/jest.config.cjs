// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/jest/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/src/__tests__/__mocks__/',
    '<rootDir>/.vscode/',
    '<rootDir>/.yalc/',
  ],
  testTimeout: 30000,
  collectCoverage: true,
  verbose: true,
};
