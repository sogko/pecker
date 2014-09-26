'use strict';
var _ = require('lodash');
var map = require('vinyl-map');
module.exports = function (args) {
  var autoprefixer;
  try {
    autoprefixer = require('autoprefixer-core');
  } catch (e) {
    throw new Error(e.code + '. Please ensure that module is installed by running `npm install autoprefixer-core`');
  }
  args = _.assign({}, args);
  return map(function (content) {
    return autoprefixer(args).process(content.toString()).css;
  });
};