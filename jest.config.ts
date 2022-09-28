module.exports = {
  displayName: '@samatech/onflow-ts',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/lib/**/+(*.)+(spec).+(ts)', '**/test/**/+(*.)+(spec).+(ts)'],
}
