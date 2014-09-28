/* jshint expr: true */

'use strict';

var path = require('path');
var jf = require('jsonfile');
var fs = require('fs');
var expect = require('chai').expect;

function expectAssetExists(peckerObj, assetOptions) {

  // TODO: refactor
  var manifestPath = peckerObj.getManifestFilePath();
  expect(manifestPath, 'expected manifest file path').to.be.ok;

  var manifestObj = jf.readFileSync(manifestPath);
  expect(manifestObj).to.be.ok;
  expect(manifestObj.assets).to.not.be.empty;
  expect(manifestObj.assets).to.contain.keys(assetOptions.name);
  expect(manifestObj.assets[assetOptions.name]).to.contain.keys('type');
  expect(manifestObj.assets[assetOptions.name].type).to.equal(assetOptions.type);

  expect(peckerObj.options).to.be.ok;
  switch (assetOptions.type) {
    case 'file':
    case 'browserify':
    case 'folder':
      var filePath = manifestObj.assets[assetOptions.name].path;
      var fileExists = fs.existsSync(filePath);
      expect(fileExists).to.be.true;
      break;
    case 'package':
      for (var i = 0; i < assetOptions.assetNames.length; i++) {
        var assetName = assetOptions.assetNames[i];
        var tokens = assetName.split('/');
        var baseName = tokens[0];
        var namePath = (tokens.length > 1) ? tokens.slice(1).join('/') : '';
        expect(baseName).to.be.ok;
        var subAssetOptions = manifestObj.assets[baseName];
        var p = path.join(subAssetOptions.path, namePath);
        var subFileExists = fs.existsSync(p);
        expect(subFileExists).to.be.true;
      }
      break;
    default:
      expect(false, 'TODO').to.be.true;
  }
}

function expectManifestFileExists(obj) {
  // check manifest file exists
  var fileExists = fs.existsSync(path.join(obj.options.destDir, 'manifest.json'));
  expect(fileExists).to.be.true;
}
function expectManifestFileDoesNotExist(obj) {
  // check manifest file exists
  var fileExists = fs.existsSync(path.join(obj.options.destDir, 'manifest.json'));
  expect(fileExists).to.be.false;
}

function expectManifestContainAsset(peckerObj, assetOptions) {

  expectManifestFileExists(peckerObj);

  var manifestPath = peckerObj.getManifestFilePath();
  expect(manifestPath, 'expected manifest file path').to.be.ok;

  var manifestObj = jf.readFileSync(manifestPath);
  expect(manifestObj, 'expected manifest to not be empty').to.not.be.empty;
  expect(manifestObj.assets, 'expected manifest to have assets').to.not.be.empty;
  expect(manifestObj.assets, 'expected manifest to contain asset').to.contain.keys(assetOptions.name);
  expect(manifestObj.assets[assetOptions.name], 'expected asset to have a type').to.contain.keys('type');
  expect(manifestObj.assets[assetOptions.name].type, 'expected asset type to be').to.equal(assetOptions.type);

  switch (assetOptions.type) {
    case 'file':
    case 'folder':
    case 'browserify':
      expect(manifestObj.assets[assetOptions.name]).to.contain.keys('url');
      expect(manifestObj.assets[assetOptions.name].url).to.satisfy(function (url) {
        if (path.basename(url) === assetOptions.name) {
          return (url === path.join(peckerObj.options.baseUrl, assetOptions.name));
        } else {
          // TODO: hashed
          return true;
        }
      }, ' contains the expected url');
      break;
    case 'url':
      expect(manifestObj.assets[assetOptions.name]).to.contain.keys('url');
      expect(manifestObj.assets[assetOptions.name].url).to.equal(assetOptions.url);
      break;
    case 'package':
      expect(manifestObj.assets[assetOptions.name]).to.contain.keys('names');
      expect(manifestObj.assets[assetOptions.name].names).to.eql(assetOptions.assetNames);
      break;
  }
}

function expectManifestNotToContainAsset(peckerObj, assetOptions) {

  expectManifestFileExists(peckerObj);

  var manifestPath = peckerObj.getManifestFilePath();
  expect(manifestPath, 'Manifest file path').to.be.ok;

  var manifestObj = jf.readFileSync(manifestPath);
  expect(manifestObj).to.be.ok;
  expect(manifestObj.assets).to.be.ok;
  expect(manifestObj.assets).to.not.contain.keys(assetOptions.name);
}

function expectPeckerFieldValue(obj, fieldName, expectedType, expectedValue) {
  expect(obj[fieldName], 'check "' + fieldName + '" field').to.not.be.undefined;
  expect(obj[fieldName], 'check "' + fieldName + '" field type').to.be.an(expectedType);
  if (typeof expectedValue !== 'undefined') {
    expect(obj[fieldName], 'check "' + fieldName + '" field value').to.eql(expectedValue);
  }
}

function expectDefaultPeckerFieldValues(obj, fieldNames) {
  var defaultFieldValues = {
    name: {
      type: 'null',
      value: null
    },
    env: {
      type: 'string',
      value: 'development'
    },
    skip: {
      type: 'array',
      value: []
    },
    baseDir: {
      type: 'string',
      value: process.cwd()
    },
    destDir: {
      type: 'string',
      value: path.join(process.cwd(), '/dist')
    },
    baseUrl: {
      type: 'string',
      value: '/static'
    },
    silent: {
      type: 'boolean',
      value: false
    },
    assets: {
      type: 'array',
      value: []
    }
  };
  fieldNames.forEach(function (name) {
    expect(defaultFieldValues[name]).to.be.not.undefined;
    expectPeckerFieldValue(obj, name, defaultFieldValues[name].type, defaultFieldValues[name].value);
  });
}

module.exports = {
  expectPeckerFieldValue: expectPeckerFieldValue,
  expectAssetExists: expectAssetExists,
  expectManifestFileExists: expectManifestFileExists,
  expectManifestFileDoesNotExist: expectManifestFileDoesNotExist,
  expectManifestContainAsset: expectManifestContainAsset,
  expectManifestNotToContainAsset: expectManifestNotToContainAsset,
  expectDefaultPeckerFieldValues: expectDefaultPeckerFieldValues
};