module.exports = {
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/toolkit/**',
    '!packages/core/.kaitian/**',
    '!packages/core/extensions/**',
  ],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@codeblitzjs/ide-core-(?!browserfs)(.*?)$': '<rootDir>/packages/$1/src',
    '^@codeblitzjs/ide-core$': '<rootDir>/packages/core/src',
    '\\.(css|less)$': '<rootDir>/scripts/jest/mocks/styleMock.js',
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*@(test|spec).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./jest.setup.js'],
};
