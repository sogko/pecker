'use strict';

module.exports = {
  jshint: {
    glob: [
      '*.js',
      'bin/**/*.js',
      'lib/**/*.js',
      'tests/**/*.js',
      'gulp/**/*.js',
      '!tests/e2e/dist/**/*',
      '!tests/support/src/**/*'
    ]
  },
  mocha: {
    src: 'tests/**/*.spec.js',
    watch: [
      '*.js',
      'lib/**/*.js',
      'tests/**/*.js',
      'gulp/**/*.js',
      '!tests/unit/build/**/*'
    ]
  }
};