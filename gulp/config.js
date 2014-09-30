'use strict';

module.exports = {
  jshint: {
    glob: [
      '*.js',
      'lib/**/*.js',
      'tests/**/*.js',
      'gulp/**/*.js',
      '!tests/unit/build/**/*'
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