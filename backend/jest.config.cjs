module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  transform: {},
  globals: {
    NODE_OPTIONS: '--experimental-vm-modules',
  },
};
