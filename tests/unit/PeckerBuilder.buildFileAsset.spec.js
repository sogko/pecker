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

describe('Unit: PeckerBuilder.buildFileAsset', function () {
  beforeEach(function () {
    peckerBuilder = new PeckerBuilder(baseOptions);
  });

  it('should successfully build a simple CSS "file" asset', function (done) {
    var assetOptions = {
      type: 'file',
      name: 'site.css',
      files: [
        '../support/src/css/site.css'
      ]
    };
    peckerBuilder.buildFileAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });
  it('should successfully build and concatenate two (2) CSS "file" assets into a single CSS file', function (done) {

    var assetOptions = {
      type: 'file',
      name: 'all.css',
      files: [
        '../support/src/css/site.css',
        '../support/src/css/app.css'
      ]
    };

    peckerBuilder.buildFileAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });
  it('should successfully build and perform built-in transforms on a simple SASS "file" asset', function (done) {

    var assetOptions = {
      type: 'file',
      name: 'transformed-site.css',
      files: [
        '../support/src/css/sass-simple.scss'
      ],
      transform: [
        'node-sass',
        'concat',
        'autoprefixer',
        'clean-css'
      ]
    };
    peckerBuilder.buildFileAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });
  it('should successfully build and perform built-in transforms on an SASS "file" asset with `@import` directive', function (done) {

    var assetOptions = {
      type: 'file',
      name: 'transformed-site.css',
      files: [
        '../support/src/css/sass-site.scss'
      ],
      transform: [
        {
          fn: 'node-sass',
          args: {
            includePaths: [ __dirname + '/../support/src/css']
          }
        },
        'concat',
        'autoprefixer',
        'clean-css'
      ]
    };
    peckerBuilder.buildFileAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });
  it('should fail to build a "file" asset that does not exists', function (done) {

    var assetOptions = {
      type: 'file',
      name: 'missing.css',
      files: [
        '../support/src/css/file-does-not-exists.css'
      ],
      transform: [
        'node-sass',
        'concat',
        'autoprefixer',
        'clean-css'
      ]
    };
    peckerBuilder.buildFileAsset(assetOptions, function () {
      expectManifestNotToContainAsset(peckerBuilder, assetOptions);
      done();
    });
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});