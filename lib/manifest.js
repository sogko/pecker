'use strict';

var fs = require('fs-extra');
var path = require('path');
var jf = require('jsonfile');
var _ = require('lodash');
var MANIFEST_FILENAME = 'manifest.json';

function getDefaultContent() {
  return {
    name: null,
    baseUrl: '/static',
    assets: {}
  };
}

/**
 * Pecker.Manifest class
 * @param options
 * @constructor
 */
function Manifest(options) {
  this.options = options;
  this.destDir = options.destDir || process.cwd();
  this.content = {};
  this.filePath = path.join(this.destDir, MANIFEST_FILENAME);

  // get or create manifest content
  this.content = this.read();
}

Manifest.prototype.read = function () {
  if (fs.existsSync(this.filePath)) {
    this.content = jf.readFileSync(this.filePath);
  } else {
    this.content = getDefaultContent();

    // create manifest if does not exists yet
    fs.mkdirsSync(path.dirname(this.filePath));
    this.write();
  }
  return this.content;
};

Manifest.prototype.write = function () {
  this.content = _.assign(getDefaultContent(), this.content, {});

  jf.writeFileSync(this.filePath, this.content);

};

Manifest.prototype.setValue = function (name, value) {
  this.content[name] = value;
  this.write();
};

Manifest.prototype.addAsset = function (type, name, value, path) {
  switch (type) {
    case 'file':
    case 'folder':
    case 'browserify':
      this.content.assets[name] = {
        type: type,
        url: value,
        path: path
      };
      break;
    case 'url':
      this.content.assets[name] = {
        type: type,
        url: value,
        path: value
      };
      break;
    case 'package':
      this.content.assets[name] = {
        type: type,
        names: value
      };
      break;
  }
  this.write();
};

Manifest.prototype.getAssetNames = function () {
  return _.keys(this.content.assets);
};

module.exports = Manifest;