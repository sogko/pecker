/* jshint expr: true */

'use strict';
var PeckerBuilder = require('./../../index').Builder;

var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectManifestContainAsset = peckerExpect.expectManifestContainAsset;
var expectAssetExists = peckerExpect.expectAssetExists;
var cleanBuildFiles = testUtils.cleanBuildFiles;

var peckerBuilder;
var testOptions = {
  name: 'testPecker',
  env: 'production',
  silent: true,
  skip: ['skip.js'],
  baseDir: __dirname,
  destDir: './build',
  baseUrl: '/static-assets',
  assets: []
};

describe('Unit: PeckerBuilder.buildPeckerClientFiles', function () {
  beforeEach(function () {
    peckerBuilder = new PeckerBuilder(testOptions);
  });

  it('should successfully build Pecker client files', function (done) {
    this.timeout(5000);
    var assetOptions = {
      peckerPackage: { type: 'browserify', name: 'pecker.js' },
      peckerJs: { type: 'file', name: 'pecker-loader.js' },
      peckerLoaderJs: { type: 'package', name: 'Pecker', assetNames: ['pecker.js', 'pecker-loader.js'] }
    };
    peckerBuilder.buildPeckerClientFiles(function () {
      expectManifestContainAsset(peckerBuilder, assetOptions.peckerPackage);
      expectAssetExists(peckerBuilder, assetOptions.peckerPackage);

      expectManifestContainAsset(peckerBuilder, assetOptions.peckerJs);
      expectAssetExists(peckerBuilder, assetOptions.peckerJs);

      expectManifestContainAsset(peckerBuilder, assetOptions.peckerLoaderJs);
      expectAssetExists(peckerBuilder, assetOptions.peckerLoaderJs);
      done();
    });
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});