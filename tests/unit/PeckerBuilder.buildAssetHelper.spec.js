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

describe('Unit: PeckerBuilder.buildAssetHelper', function () {
  beforeEach(function () {
    peckerBuilder = new PeckerBuilder(testOptions);
  });

  it('should successfully build assetHelper', function (done) {
    this.timeout(5000);
    var assetOptions =  { type: 'browserify', name: 'helper.js' };
    peckerBuilder.buildAssetHelper(function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});