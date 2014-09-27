/* jshint expr: true */

'use strict';

var PeckerBuilder = require('./../../index').Builder;
var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectManifestContainAsset = peckerExpect.expectManifestContainAsset;
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

describe('Unit: PeckerBuilder.buildBrowserifyAsset', function () {
  beforeEach(function () {
    peckerBuilder = new PeckerBuilder(baseOptions);
  });

  it('should successfully build a simple "browserify" asset (simple JavaScript, no requires)', function (done) {
    var assetOptions = {
      type: 'browserify',
      name: 'simple-log.js',
      entries: [
        '../support/src/js/simple-log.js'
      ]
    };
    peckerBuilder.buildBrowserifyAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });

  it('should successfully build and concatenate "browserify" asset with multiple entries (simple JavaScript, no requires)', function (done) {
    var assetOptions = {
      type: 'browserify',
      name: 'concat-simple.js',
      entries: [
        '../support/src/js/simple-log.js',
        '../support/src/js/simple-date.js'
      ]
    };
    peckerBuilder.buildBrowserifyAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });


  it('should successfully build a "browserify" asset, that internally require another file', function (done) {
    var assetOptions = {
      type: 'browserify',
      name: 'foo.js',
      entries: [
        '../support/src/js/foo.js'
      ]
    };
    peckerBuilder.buildBrowserifyAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });

  it('should successfully build a "browserify" asset, that internally require another script file with a custom expose name', function (done) {
    var assetOptions = {
      type: 'browserify',
      name: 'bar.js',
      entries: [
        '../support/src/js/bar.js'
      ],
      require: [
        { type: 'module', name: 'simple-log', expose: 'my-simple-logger', location: '../support/src/js/simple-log.js' }
      ]

    };
    peckerBuilder.buildBrowserifyAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });

  it('should successfully build a "browserify" asset, that mark requires as an external require, so that we have a lighter build', function (done) {
    var assetOptions = {
      type: 'browserify',
      name: 'bar-light.js',
      entries: [
        '../support/src/js/bar.js'
      ],
      external: [
        { type: 'module', name: 'path' },
        { type: 'module', name: 'my-simple-logger' }
      ]

    };
    peckerBuilder.buildBrowserifyAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });

  it('should successfully build a "browserify" asset, which externally require NPM modules, Bower components and non-managed JavaScript modules to create a bundle JS asset', function (done) {
    var assetOptions = {
      type: 'browserify',
      name: 'bundle.js',
      require: [
        { type: 'bower', name: 'bootstrap' },
        { type: 'bower', name: 'angular', location: '../../bower_components/angular/angular.min.js'},
        { type: 'npm', name: 'lodash' },
        { type: 'npm', name: 'path' },
        { type: 'module', name: 'date', location: '../support/src/js/simple-date.js' }
      ]

    };
    peckerBuilder.buildBrowserifyAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});