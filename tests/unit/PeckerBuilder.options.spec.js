/* jshint expr: true */

'use strict';

var path = require('path');
var expect = require('chai').expect;
var PeckerBuilder = require('./../../index').Builder;

var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectPeckerFieldValue = peckerExpect.expectPeckerFieldValue;
var expectDefaultPeckerFieldValues = peckerExpect.expectDefaultPeckerFieldValues;
var cleanBuildFiles = testUtils.cleanBuildFiles;
var peckerBuilder;

describe('Unit: PeckerBuilder.options', function () {
  describe('options = undefined', function () {
    it('should return default fields', function () {
      peckerBuilder = new PeckerBuilder();
      expectDefaultPeckerFieldValues(peckerBuilder.options, [
        'name',
        'env',
        'skip',
        'baseDir',
        'destDir',
        'baseUrl',
        'silent',
        'assets'
      ]);

    });
  });
  describe('Typical options', function () {
    it('should behaved as expected', function () {
      peckerBuilder = new PeckerBuilder({
        name: 'testPecker',
        env: 'production',
        skip: ['skip.js'],
        baseDir: __dirname,
        destDir: './build',
        silent: true,
        baseUrl: '/static-assets',
        assets: [
          {
            type: 'file',
            name: 'test.js'
          }
        ]
      });
      expectPeckerFieldValue(peckerBuilder.options, 'name', 'string', 'testPecker');
      expectPeckerFieldValue(peckerBuilder.options, 'env', 'string', 'production');
      expectPeckerFieldValue(peckerBuilder.options, 'skip', 'array', ['skip.js']);
      expectPeckerFieldValue(peckerBuilder.options, 'baseDir', 'string', __dirname);
      expectPeckerFieldValue(peckerBuilder.options, 'destDir', 'string', path.join(__dirname, '/build'));
      expectPeckerFieldValue(peckerBuilder.options, 'baseUrl', 'string', '/static-assets');
      expectPeckerFieldValue(peckerBuilder.options, 'silent', 'boolean', true);
      expectPeckerFieldValue(peckerBuilder.options, 'assets', 'array', [
        {
          type: 'file',
          name: 'test.js',
          files: [],
          transform: [],
          watch: [],
          skipHash: false
        }
      ]);


    });
  });

  describe('options.assets = [];', function () {
    it('should return empty assets array for assets = []', function () {
      peckerBuilder = new PeckerBuilder({
        assets: []
      });
      expectPeckerFieldValue(peckerBuilder.options, 'assets', 'array', []);
      expect(peckerBuilder.options.assets.length).to.equal(0);
    });
    it('should return empty assets array for undefined `type`', function () {
      peckerBuilder = new PeckerBuilder({
        assets: [
          { name: 'app.js' }
        ]
      });
      expectPeckerFieldValue(peckerBuilder.options, 'assets', 'array', []);
      expect(peckerBuilder.options.assets.length).to.equal(0);
    });
  });

  describe('options.assets names', function () {
    describe('non-system-reserved asset names', function () {
      it('should retained asset names that are non-system-reserved', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'file', name: 'app.js' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', 'app.js');
      });
      it('should retain different assets with the same name', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'file', name: 'app.js' },
            { type: 'browserify', name: 'app.js' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(2);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', 'app.js');
        expectPeckerFieldValue(peckerBuilder.options.assets[1], 'name', 'string', 'app.js');
      });
    });
    describe('system-reserved asset names', function () {
      it('should rename asset with `manifest.json` name to `_manifest.json`', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'file', name: 'manifest.json' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', '_manifest.json');
      });
      it('should rename asset with `pecker.js` name to `_pecker.js`', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'file', name: 'pecker.js' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', '_pecker.js');
      });
      it('should rename asset with `pecker-loader.js` name to `_pecker-loader.js`', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'file', name: 'pecker-loader.js' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', '_pecker-loader.js');
      });

      it('should rename asset with `Pecker` name to `_Pecker`', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'file', name: 'Pecker' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', '_Pecker');
      });
    });
  });

  describe('options.assets types', function () {
    describe('type: "file"', function () {
      it('should return empty assets array if missing required fields', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'file' }
          ]
        });
        expectPeckerFieldValue(peckerBuilder.options, 'assets', 'array', []);
        expect(peckerBuilder.options.assets.length).to.equal(0);
      });
      it('should return default fields if all required fields are present', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'file', name: 'app.js' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'type', 'string', 'file');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', 'app.js');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'files', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'transform', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'watch', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'skipHash', 'boolean', false);
      });
    });

    describe('type: "folder"', function () {
      it('should return empty assets array if missing required fields', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'folder' }
          ]
        });
        expectPeckerFieldValue(peckerBuilder.options, 'assets', 'array', []);
        expect(peckerBuilder.options.assets.length).to.equal(0);
      });
      it('should return default fields if all required fields are present', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'folder', name: 'app', folder: 'app' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'type', 'string', 'folder');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', 'app');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'folder', 'string', path.join(process.cwd(), 'app'));
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'watch', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'include', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'exclude', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'skipHash', 'boolean', false);
      });
    });

    describe('type: "browserify"', function () {
      it('should return empty assets array if missing required fields', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'browserify' }
          ]
        });
        expectPeckerFieldValue(peckerBuilder.options, 'assets', 'array', []);
        expect(peckerBuilder.options.assets.length).to.equal(0);
      });
      it('should return default fields if all required fields are present', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'browserify', name: 'app.min.js' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'type', 'string', 'browserify');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', 'app.min.js');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'entries', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'require', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'external', 'array', [
          {
            name: 'Pecker',
            type: 'module'
          }
        ]);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'transform', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'watch', 'array', []);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'skipHash', 'boolean', false);
      });
    });

    describe('type: "package"', function () {
      it('should return empty assets array if missing required fields', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'package' }
          ]
        });
        expectPeckerFieldValue(peckerBuilder.options, 'assets', 'array', []);
        expect(peckerBuilder.options.assets.length).to.equal(0);
      });
      it('should return default fields if all required fields are present', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'package', name: 'mainPackage' }
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'type', 'string', 'package');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', 'mainPackage');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'assetNames', 'array', []);
      });
    });

    describe('type: "url"', function () {
      it('should return empty assets array if missing required fields', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'url' }
          ]
        });
        expectPeckerFieldValue(peckerBuilder.options, 'assets', 'array', []);
        expect(peckerBuilder.options.assets.length).to.equal(0);
      });
      it('should return default fields if all required fields are present', function () {
        peckerBuilder = new PeckerBuilder({
          assets: [
            { type: 'url', name: 'bootstrap', url: 'linkurl'}
          ]
        });
        expect(peckerBuilder.options.assets.length).to.equal(1);
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'type', 'string', 'url');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'name', 'string', 'bootstrap');
        expectPeckerFieldValue(peckerBuilder.options.assets[0], 'url', 'string', 'linkurl');
      });
    });

    describe('Pecker.Builder._shouldSkipHash() *private method*', function () {
      it('should satisfy that if global skipHash is defined, it overrides asset skipHash. Else use asset skipHash value', function () {

        var testTable = [
          { expected: false },
          { a: false, expected: false },
          { a: true, expected: true },
          { g: false, expected: false },
          { g: false, a: false, expected: false },
          { g: false, a: true, expected: false },
          { g: true, expected: true },
          { g: true, a: false, expected: true },
          { g: true, a: true, expected: true }
        ];

        function test(i, g, a, expected) {
          var assetOptions = {
            type: 'file',
            name: 'test',
            files: [],
            skipHash: a
          };
          peckerBuilder = new PeckerBuilder({
            skipHash: g,
            assets: [
              assetOptions
            ]
          });
          if (expected === true) {
            expect(peckerBuilder._shouldSkipHash(assetOptions), 'Expected _shouldSkipHash() to return true, test: #' + i).to.be.true;
          } else if (expected === false) {
            expect(peckerBuilder._shouldSkipHash(assetOptions), 'Expected _shouldSkipHash() to return false, test: #' + i).to.be.false;
          } else {
            // should not reach here
            expect(true).to.not.be.true;
          }
        }

        for (var i = 0; i < testTable.length; i++) {
          test(i, testTable[i].g, testTable[i].a, testTable[i].expected);
        }

      });
    });
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});