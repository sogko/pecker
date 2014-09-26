'use strict';
var _ = require('lodash');
var map = require('vinyl-map');
module.exports = function (args) {
  var sass;
  try {
    sass = require('node-sass');
  } catch (e) {
    throw new Error(e.code + '. Please ensure that module is installed by running `npm install node-sass`');
  }
  return map(function (content) {
    args = _.assign({}, args, {
      data: content.toString()
    });
    return sass.renderSync(args);
  });
};