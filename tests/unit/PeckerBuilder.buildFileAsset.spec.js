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

  it('should successfully build but not concatenate if asset name has a file extension in skipConcat list (only one file will be referenced in manifest.json) ', function (done) {

    var assetOptions = {
      type: 'file',
      name: 'h6k3jaH.jpg',
      files: [
        '../support/src/images/*.jpg'
      ],
      transform: [
        {
          fn: 'imagemin',
          args: {
            progressive: true
          }
        }
      ]
    };
    peckerBuilder.buildFileAsset(assetOptions, function () {
      expectManifestContainAsset(peckerBuilder, assetOptions);
      expectAssetExists(peckerBuilder, assetOptions);
      done();
    });
  });

  describe('Built-in transforms', function () {

    it('should successfully perform built-in transforms (node-sass, autoprefixer, clean-css, concat) on a simple SASS "file" asset', function (done) {

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
    it('should successfully perform built-in transforms (node-sass, autoprefixer, clean-css, concat) on an SASS "file" asset with `@import` directive', function (done) {

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
    it('should successfully perform built-in transforms (uglify) on a JavaScript "file" asset', function (done) {

      var assetOptions = {
        type: 'file',
        name: 'simple-log.min.js',
        files: [
          '../support/src/js/simple-log.js'
        ],
        transform: [
          'uglify'
        ]
      };
      peckerBuilder.buildFileAsset(assetOptions, function () {
        expectManifestContainAsset(peckerBuilder, assetOptions);
        expectAssetExists(peckerBuilder, assetOptions);
        done();
      });
    });
    it('should successfully perform built-in transforms (imagemin) on a JPG/JPEG "file" asset', function (done) {

      var assetOptions = {
        type: 'file',
        name: 'h6k3jaH.jpg',
        files: [
          '../support/src/images/h6k3jaH.jpg'
        ],
        transform: [
          'imagemin'
        ]
      };
      peckerBuilder.buildFileAsset(assetOptions, function () {
        expectManifestContainAsset(peckerBuilder, assetOptions);
        expectAssetExists(peckerBuilder, assetOptions);
        done();
      });
    });
    it('should successfully perform built-in transforms (imagemin) on a JPG/JPEG "file" asset with options', function (done) {

      var assetOptions = {
        type: 'file',
        name: 'h6k3jaH.jpg',
        files: [
          '../support/src/images/h6k3jaH.jpg'
        ],
        transform: [
          {
            fn: 'imagemin',
            args: {
              progressive: true
            }
          }
        ]
      };
      peckerBuilder.buildFileAsset(assetOptions, function () {
        expectManifestContainAsset(peckerBuilder, assetOptions);
        expectAssetExists(peckerBuilder, assetOptions);
        done();
      });
    });
  });

  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});


