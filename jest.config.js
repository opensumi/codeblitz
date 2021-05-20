module.exports = {
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/toolkit/**',
    '!packages/alex/.kaitian/**',
    '!packages/alex/extensions/**',
  ],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@alipay/alex-(?!browserfs)(.*?)$': '<rootDir>/packages/$1/src',
    '^@alipay/alex$': '<rootDir>/packages/alex/src',
    '\\.(css|less)$': '<rootDir>/mocks/styleMock.js',
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*@(test|spec).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./jest.setup.js'],
};
