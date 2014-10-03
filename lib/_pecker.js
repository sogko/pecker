'use strict';
var PeckerAssets = require('./assets');
var Pecker = {};
Pecker.__data = {};
Pecker.init = function (data) {
  Pecker.__data = data;
  Pecker.Assets = new PeckerAssets(Pecker.__data.manifest);
  Pecker.version = Pecker.__data.version;
  delete Pecker.init;
};
Pecker.Assets = null;
Pecker.Manifest = {
  read: function read() {
    return Pecker.__data.manifest;
  },
  getAssetNames: function getAssetNames() {
    if (typeof Pecker.__data.assetNames !== 'undefined' && Pecker.__data.assetNames) {
      return Pecker.__data.assetNames;
    }
    Pecker.__data.assetNames = [];
    var content = Pecker.Manifest.read() || {};
    for (var name in content.assets) {
      if (content.assets.hasOwnProperty(name)) {
        Pecker.__data.assetNames.push(name);
      }
    }
    return Pecker.__data.assetNames;
  }
};
if (typeof window !== 'undefined') {
  window.Pecker = Pecker;
}
module.exports = Pecker;