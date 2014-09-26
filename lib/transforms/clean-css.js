'use strict';
var _ = require('lodash');
var map = require('vinyl-map');
module.exports = function (args) {
  var CleanCSS;
  try {
    CleanCSS = require('clean-css');
  } catch (e) {
    throw new Error(e.code + '. Please ensure that module is installed by running `npm install clean-css`');
  }
  args = _.assign({}, {
    keepSpecialComments: 0,
    keepBreaks: false
  }, args);
  return map(function (content) {
    return new CleanCSS(args).minify(content.toString());
  });
};