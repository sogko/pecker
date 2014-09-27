/* jshint expr: true */

'use strict';

var PeckerBuilder = require('./../../index').Builder;

var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectManifestContainAsset = peckerExpect.expectManifestContainAsset;
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

describe('Unit: PeckerBuilder.buildPackageAsset', function () {
  beforeEach(function () {
    peckerBuilder = new PeckerBuilder(baseOptions);
  });

  it('should successfully build an "package" asset', function (done) {
    var assetOptions = {
      type: 'package',
      name: 'mainPackage',
      assetNames: [
        'asset1',
        'asset2'
      ]
    };
    peckerBuilder.buildPackageAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      done();
    });
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});