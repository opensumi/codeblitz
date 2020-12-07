module.exports = {
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/toolkit/**',
    '!packages/spacex/.kaitian/**',
    '!packages/spacex/extensions/**',
  ],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@alipay/spacex-(.*?)$': '<rootDir>/packages/$1/src',
    '@alipay/spacex': '<rootDir>/packages/spacex/src',
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*@(test|spec).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
};
