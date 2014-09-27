/* jshint expr: true */

'use strict';

var PeckerBuilder = require('./../../index').Builder;
var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectManifestContainAsset = peckerExpect.expectManifestContainAsset;
var expectManifestNotToContainAsset = peckerExpect.expectManifestNotToContainAsset;
var expectAssetExists = peckerExpect.expectAssetExists;
var cleanBuildFiles = testUtils.cleanBuildFiles;

var peckerBuilder;
var baseOptions = {
  name: 'testPecker',
  env: 'production',
  silent: true,
  skip: ['skip.js'],
  baseDir: __dirname,
  destDir: './build',
  baseUrl: '/static-assets',
  assets: []
};

describe('Unit: PeckerBuilder.buildFolderAsset', function () {
  beforeEach(function () {
    peckerBuilder = new PeckerBuilder(baseOptions);
  });

  it('should successfully build a "folder" asset', function (done) {
    var assetOptions = {
      type: 'folder',
      name: 'vendor',
      folder: '../support/src/vendor/'
    };
    peckerBuilder.buildFolderAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });
  it('should not build a "folder" asset that does not exists', function (done) {
    var assetOptions = {
      type: 'folder',
      name: 'missingFolder',
      folder: '../support/src/folderDoesNotExists/'
    };
    peckerBuilder.buildFolderAsset(assetOptions, function () {
      expectManifestNotToContainAsset(peckerBuilder, assetOptions);
      done();
    });
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});