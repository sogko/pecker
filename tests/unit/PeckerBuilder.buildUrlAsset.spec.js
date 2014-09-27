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

describe('Unit: PeckerBuilder.buildUrlAsset', function () {
  beforeEach(function () {
    peckerBuilder = new PeckerBuilder(baseOptions);
  });

  it('should successfully build an "url" asset', function (done) {
    var assetOptions = {
      type: 'url',
      name: 'bootstrap.min.css',
      url: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'
    };
    peckerBuilder.buildUrlAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      done();
    });
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});