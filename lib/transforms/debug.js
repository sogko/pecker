'use strict';
var _ = require('lodash');
var debug = require('gulp-debug');
module.exports = function (args) {
  args = _.assign({}, args, {
    verbose: true
  });
  return debug(args);
};