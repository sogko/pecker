'use strict';
var PeckerAssets = require('./assets');
if (typeof window !== 'undefined' &&
  typeof window.Pecker !== 'undefined' &&
  typeof window.Pecker.__data !== 'undefined') {
  window.Pecker.Assets = new PeckerAssets(window.Pecker.__data.manifest);
}
module.exports = window.Pecker.Assets;