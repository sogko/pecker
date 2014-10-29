'use strict';
var _ = require('lodash');
var path = require('path');
var less = require('gulp-less');
module.exports = function (args, peckerOptions) {

  args = _.assign({}, {
    paths: [peckerOptions.baseDir]
  }, args);

  // resolve paths
  args.paths = _.map(args.paths, function (p) {
    return path.resolve(peckerOptions.baseDir, p);
  });

  return less(args);
};