module.exports = {
  displayName: '@samatech/onflow-ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/lib/**/+(*.)+(spec).+(ts)', '**/test/**/+(*.)+(spec).+(ts)'],
}
