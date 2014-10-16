'use strict';
var _ = require('lodash');
var path = require('path');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
module.exports = function (args, peckerOptions) {

  args = _.assign({
    includePaths: [peckerOptions.baseDir],
    onError: function (err) {
      gutil.log('Error:', err);
    }
  }, args, {});

  // resolve paths
  args.includePaths = _.map(args.includePaths, function (p) {
    return path.resolve(peckerOptions.baseDir, p);
  });

  if (args.imagePath) {
    args.imagePath = path.resolve(peckerOptions.baseDir, args.imagePath);
  }
  return sass(args);
};