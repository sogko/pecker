/* jshint expr: true */

'use strict';
var expect = require('chai').expect;
var path = require('path');
var PeckerAssets = require('./../../index').Assets;
var testManifest = {
  name: 'testPecker',
  baseUrl: '/static-assets',
  assets: {
    'helper.js': {
      type: 'browserify',
      url: '/static-assets/helper.js',
      path: '/Users/hafiz/dev/pecker/tests/unit/build/helper.js'
    },
    'site.css': {
      type: 'file',
      url: '/static-assets/site.css',
      path: '/Users/hafiz/dev/pecker/tests/unit/build/site.css'

    },
    'vendor': {
      type: 'folder',
      url: '/static-assets/vendor.7e860a84f7f30952bb8bc1b676facc42',
      path: '/Users/hafiz/dev/pecker/tests/unit/build/vendor.7e860a84f7f30952bb8bc1b676facc42'
    },
    'bootstrap.min.css': {
      type: 'url',
      url: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css',
      path: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'
    },
    'mainPackage': {
      type: 'package',
      names: [
        'helper.js',
        'site.css',
        'bootstrap.min.css',
        'vendor',
        'vendor/bootstrap/fonts/glyphicons-halflings-regular.eot'
      ]
    }
  }
};

var expectedHTMLStrings = {
  'site.css': '<link rel="stylesheet" href="/static-assets/site.css"/>',
  'helper.js': '<script src="/static-assets/helper.js"></script>',
  'mainPackage': '' +
    '<link rel="stylesheet" href="/static-assets/site.css"/>\n' +
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"/>\n' +
    '<script src="/static-assets/helper.js"></script>',
  'mainPackage-link': '' +
    '<link rel="stylesheet" href="/static-assets/site.css"/>\n' +
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"/>',
  'mainPackage-script': '<script src="/static-assets/helper.js"></script>'
};
var peckerAssets;

describe('Unit: PeckerAssets', function () {
  beforeEach(function (done) {
    peckerAssets = new PeckerAssets(testManifest);
    done();
  });

  describe('PeckerAssets(manifest)', function () {
    it('should create an instance of PeckerAssets', function () {
      expect(peckerAssets).to.be.an.instanceof(PeckerAssets);
      expect(peckerAssets.content).to.be.deep.equal(testManifest);
    });
  });

  describe('PeckerAssets.getAsset(name)', function () {
    it('should return metadata to an existing asset', function () {
      var asset = peckerAssets.getAsset('helper.js');
      expect(asset).to.deep.equal(testManifest.assets['helper.js']);
    });
    it('should return metadata to an existing asset given the asset path', function () {
      var asset = peckerAssets.getAsset('vendor/bootstrap/fonts/glyphicons-halflings-regular.eot');
      expect(asset).to.deep.equal(testManifest.assets.vendor);
    });

    it('should return null if asset does not exist', function () {
      var asset = peckerAssets.getAsset('nonExistentAsset');
      expect(asset).to.be.null;

      asset = peckerAssets.getAsset('nonExistentAsset/withpath/stillnothing.js');
      expect(asset).to.be.null;
    });
  });

  describe('PeckerAssets.getUrl(name)', function () {
    it('should return a url for the asset (type = `browserify`)', function () {
      var url = peckerAssets.getUrl('helper.js');
      expect(url).to.equal(testManifest.assets['helper.js'].url);
    });
    it('should return a url for the asset (type = `file`)', function () {
      var url = peckerAssets.getUrl('site.css');
      expect(url).to.equal(testManifest.assets['site.css'].url);
    });
    it('should return a url for the asset (type = `folder`)', function () {
      var url = peckerAssets.getUrl('vendor');
      expect(url).to.equal(testManifest.assets.vendor.url);
    });
    it('should return a url for the asset (type = `url`)', function () {
      var url = peckerAssets.getUrl('bootstrap.min.css');
      expect(url).to.equal(testManifest.assets['bootstrap.min.css'].url);
    });
    it('should return the first url for the asset (type = `package`) if it has multiple urls', function () {
      var url = peckerAssets.getUrl('mainPackage');
      expect(url).to.equal(testManifest.assets['helper.js'].url);
    });
    it('should return a full url for a folder asset given a full path', function () {
      var url = peckerAssets.getUrl('vendor/bootstrap/fonts/glyphicons-halflings-regular.eot');
      expect(url).to.equal(path.join(testManifest.assets.vendor.url, 'bootstrap/fonts/glyphicons-halflings-regular.eot'));
    });
    it('should return a base url for a non-folder asset given a full path', function () {
      var url = peckerAssets.getUrl('site.css/this/is-a-nonsense.example/path.js');
      expect(url).to.equal(testManifest.assets['site.css'].url);
    });

    it('should return null if asset does not exist', function () {
      var url = peckerAssets.getUrl('assetDoesNotExists');
      expect(url).to.be.null;
    });
  });

  describe('PeckerAssets.getUrls(name)', function () {
    it('should return an array of urls for the asset (type = `browserify`)', function () {
      var urls = peckerAssets.getUrls('helper.js');
      expect(urls).to.have.length(1);
      expect(urls[0]).to.equal(testManifest.assets['helper.js'].url);
    });
    it('should return an array of urls for the asset (type = `file`)', function () {
      var urls = peckerAssets.getUrls('site.css');
      expect(urls).to.have.length(1);
      expect(urls[0]).to.equal(testManifest.assets['site.css'].url);
    });
    it('should return an array of urls for the asset (type = `folder`)', function () {
      var urls = peckerAssets.getUrls('vendor');
      expect(urls).to.have.length(1);
      expect(urls[0]).to.equal(testManifest.assets.vendor.url);
    });
    it('should return an array of urls for the asset (type = `url`)', function () {
      var urls = peckerAssets.getUrls('bootstrap.min.css');
      expect(urls).to.have.length(1);
      expect(urls[0]).to.equal(testManifest.assets['bootstrap.min.css'].url);
    });
    it('should return an array of urls for the asset (type = `package`)', function () {
      var urls = peckerAssets.getUrls('mainPackage');
      expect(urls).to.have.length(5);
      expect(urls[0]).to.equal(testManifest.assets['helper.js'].url);
      expect(urls[1]).to.equal(testManifest.assets['site.css'].url);
      expect(urls[2]).to.equal(testManifest.assets['bootstrap.min.css'].url);
      expect(urls[3]).to.equal(testManifest.assets.vendor.url);
      expect(urls[4]).to.equal(path.join(testManifest.assets.vendor.url, 'bootstrap/fonts/glyphicons-halflings-regular.eot'));
    });
    it('should return an array of full url for a folder asset given a full path', function () {
      var urls = peckerAssets.getUrls('vendor/bootstrap/fonts/glyphicons-halflings-regular.eot');
      expect(urls).to.have.length(1);
      expect(urls[0]).to.equal(path.join(testManifest.assets.vendor.url, 'bootstrap/fonts/glyphicons-halflings-regular.eot'));
    });
    it('should return an array of base url for a non-folder asset given a full path', function () {
      var urls = peckerAssets.getUrls('site.css/this/is-a-nonsense.example/path.js');
      expect(urls).to.have.length(1);
      expect(urls[0]).to.equal(testManifest.assets['site.css'].url);
    });

    it('should return an empty array if asset does not exist', function () {
      var urls = peckerAssets.getUrls('assetDoesNotExists');
      expect(urls).to.be.an('array');
      expect(urls).to.have.length(0);
    });
  });

  describe('PeckerAssets.getGroupedUrls(name, [options])', function () {

    var defaultGroupKeys = ['baseUrl', 'stylesheet', 'javascript', 'others'];

    describe('Default option.groups', function () {

      it('should return a map of urls for the asset (group type = `javascript`)', function () {
        var urls = peckerAssets.getGroupedUrls('helper.js');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: peckerAssets.content.baseUrl,
          stylesheet: [],
          javascript: [
            testManifest.assets['helper.js'].url
          ],
          others: []
        });

      });
      it('should return a map of urls for the asset (group type = `stylesheet`)', function () {
        var urls = peckerAssets.getGroupedUrls('site.css');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: peckerAssets.content.baseUrl,
          stylesheet: [
            testManifest.assets['site.css'].url
          ],
          javascript: [],
          others: []
        });
      });

      it('should return a map of urls for the asset (group type = `others`)', function () {
        var urls = peckerAssets.getGroupedUrls('vendor');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: peckerAssets.content.baseUrl,
          stylesheet: [],
          javascript: [],
          others: [
            testManifest.assets.vendor.url
          ]
        });
      });

      it('should return a map of urls for the asset (group type = `multiple`)', function () {
        var urls = peckerAssets.getGroupedUrls('mainPackage');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: peckerAssets.content.baseUrl,
          stylesheet: [
            testManifest.assets['site.css'].url,
            testManifest.assets['bootstrap.min.css'].url
          ],
          javascript: [
            testManifest.assets['helper.js'].url
          ],
          others: [
            testManifest.assets.vendor.url,
            path.join(testManifest.assets.vendor.url, 'bootstrap/fonts/glyphicons-halflings-regular.eot')
          ]
        });
      });

      it('should return a map if asset does not exist', function () {
        var urls = peckerAssets.getGroupedUrls('assetDoesNotExists');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: peckerAssets.content.baseUrl,
          stylesheet: [],
          javascript: [],
          others: []
        });
      });
    });
    describe('Custom option.groups', function () {
      it('should return a map of urls for the asset (custom group type = `font`)', function () {
        var urls = peckerAssets.getGroupedUrls('mainPackage', {
          groups: {
            font: ['.eot']
          }
        });

        expect(urls).to.have.keys(defaultGroupKeys.concat(['font']));
        expect(urls).to.have.deep.equal({
          baseUrl: peckerAssets.content.baseUrl,
          stylesheet: [
            testManifest.assets['site.css'].url,
            testManifest.assets['bootstrap.min.css'].url
          ],
          javascript: [
            testManifest.assets['helper.js'].url
          ],
          font: [
            path.join(testManifest.assets.vendor.url, 'bootstrap/fonts/glyphicons-halflings-regular.eot')
          ],
          others: [
            testManifest.assets.vendor.url
          ]
        });

      });
      it('should return a map of urls for the asset (custom group type = `font`) but asset does not have specified group', function () {
        var urls = peckerAssets.getGroupedUrls('helper.js', {
          groups: {
            font: ['.eot']
          }
        });

        expect(urls).to.have.keys(defaultGroupKeys.concat(['font']));
        expect(urls).to.have.deep.equal({
          baseUrl: peckerAssets.content.baseUrl,
          stylesheet: [],
          javascript: [
            testManifest.assets['helper.js'].url
          ],
          font: [],
          others: []
        });

      });

    });
  });

  describe('PeckerAssets.getFilePath(name)', function () {
    it('should return file path for the asset (type = `browserify`)', function () {
      var filePath = peckerAssets.getFilePath('helper.js');
      expect(filePath).to.equal(testManifest.assets['helper.js'].path);
    });
    it('should return file path for the asset (type = `file`)', function () {
      var filePath = peckerAssets.getFilePath('site.css');
      expect(filePath).to.equal(testManifest.assets['site.css'].path);
    });
    it('should return file path for the asset (type = `folder`)', function () {
      var filePath = peckerAssets.getFilePath('vendor');
      expect(filePath).to.equal(testManifest.assets.vendor.path);
    });
    it('should return file path for the asset (type = `url`)', function () {
      var filePath = peckerAssets.getFilePath('bootstrap.min.css');
      expect(filePath).to.equal(testManifest.assets['bootstrap.min.css'].path);
    });
    it('should return the first file path for the asset (type = `package`) if it has multiple urls', function () {
      var filePath = peckerAssets.getFilePath('mainPackage');
      expect(filePath).to.equal(testManifest.assets['helper.js'].path);
    });
    it('should return a full file path for a folder asset given a full path', function () {
      var filePath = peckerAssets.getFilePath('vendor/bootstrap/fonts/glyphicons-halflings-regular.eot');
      expect(filePath).to.equal(path.join(testManifest.assets.vendor.path, 'bootstrap/fonts/glyphicons-halflings-regular.eot'));
    });
    it('should return a base file path for a non-folder asset given a full path', function () {
      var filePath = peckerAssets.getFilePath('site.css/this/is-a-nonsense.example/path.js');
      expect(filePath).to.equal(testManifest.assets['site.css'].path);
    });

    it('should return null if asset does not exist', function () {
      var filePath = peckerAssets.getFilePath('assetDoesNotExists');
      expect(filePath).to.be.null;
    });
  });

  describe('PeckerAssets.getFilePaths(name)', function () {
    it('should return an array of file paths for the asset (type = `browserify`)', function () {
      var filePaths = peckerAssets.getFilePaths('helper.js');
      expect(filePaths).to.have.length(1);
      expect(filePaths[0]).to.equal(testManifest.assets['helper.js'].path);
    });
    it('should return an array of file paths for the asset (type = `file`)', function () {
      var filePaths = peckerAssets.getFilePaths('site.css');
      expect(filePaths).to.have.length(1);
      expect(filePaths[0]).to.equal(testManifest.assets['site.css'].path);
    });
    it('should return an array of file paths for the asset (type = `folder`)', function () {
      var filePaths = peckerAssets.getFilePaths('vendor');
      expect(filePaths).to.have.length(1);
      expect(filePaths[0]).to.equal(testManifest.assets.vendor.path);
    });
    it('should return an array of file paths for the asset (type = `url`)', function () {
      var filePaths = peckerAssets.getFilePaths('bootstrap.min.css');
      expect(filePaths).to.have.length(1);
      expect(filePaths[0]).to.equal(testManifest.assets['bootstrap.min.css'].path);
    });
    it('should return an array of file paths for the asset (type = `package`)', function () {
      var filePaths = peckerAssets.getFilePaths('mainPackage');
      expect(filePaths).to.have.length(5);
      expect(filePaths[0]).to.equal(testManifest.assets['helper.js'].path);
      expect(filePaths[1]).to.equal(testManifest.assets['site.css'].path);
      expect(filePaths[2]).to.equal(testManifest.assets['bootstrap.min.css'].path);
      expect(filePaths[3]).to.equal(testManifest.assets.vendor.path);
      expect(filePaths[4]).to.equal(path.join(testManifest.assets.vendor.path, 'bootstrap/fonts/glyphicons-halflings-regular.eot'));
    });
    it('should return an array of full file paths for a folder asset given a full path', function () {
      var filePaths = peckerAssets.getFilePaths('vendor/bootstrap/fonts/glyphicons-halflings-regular.eot');
      expect(filePaths).to.have.length(1);
      expect(filePaths[0]).to.equal(path.join(testManifest.assets.vendor.path, 'bootstrap/fonts/glyphicons-halflings-regular.eot'));
    });
    it('should return an array of base file paths for a non-folder asset given a full path', function () {
      var filePaths = peckerAssets.getFilePaths('site.css/this/is-a-nonsense.example/path.js');
      expect(filePaths).to.have.length(1);
      expect(filePaths[0]).to.equal(testManifest.assets['site.css'].path);
    });

    it('should return an empty array if asset does not exist', function () {
      var filePaths = peckerAssets.getFilePaths('assetDoesNotExists');
      expect(filePaths).to.be.an('array');
      expect(filePaths).to.have.length(0);
    });
  });

  describe('PeckerAssets.constructAssetHTML(name, option)', function () {
    describe('Default option.type = `default`', function () {
      it('should construct an HTML string for an asset that is a stylesheet (.css)', function () {
        var str = peckerAssets.constructAssetHTML('site.css');
        expect(str).to.equal(expectedHTMLStrings['site.css']);
      });

      it('should construct an HTML string for an asset that is a JavaScript (.js)', function () {
        var str = peckerAssets.constructAssetHTML('helper.js');
        expect(str).to.equal(expectedHTMLStrings['helper.js']);
      });

      it('should construct an HTML string for a package asset that has both stylesheets (.css) and JavaScripts (.js)', function () {
        var str = peckerAssets.constructAssetHTML('mainPackage');
        expect(str).to.equal(expectedHTMLStrings.mainPackage);
      });
    });

    describe(' option.type = `link`', function () {
      var optionsTypeLink = {
        type: 'link'
      };
      it('should construct an HTML string for an asset that is a stylesheet (.css)', function () {
        var str = peckerAssets.constructAssetHTML('site.css', optionsTypeLink);
        expect(str).to.equal(expectedHTMLStrings['site.css']);
      });

      it('should construct an empty HTML string for an asset that is a JavaScript (.js)', function () {
        var str = peckerAssets.constructAssetHTML('helper.js', optionsTypeLink);
        expect(str).to.equal('');
      });

      it('should construct an HTML string containing only `link` tags for a package asset that has both stylesheets (.css) and JavaScripts (.js)', function () {
        var str = peckerAssets.constructAssetHTML('mainPackage', optionsTypeLink);
        expect(str).to.equal(expectedHTMLStrings['mainPackage-link']);
      });
    });
    describe(' option.type = `script`', function () {
      var optionsTypeLink = {
        type: 'script'
      };
      it('should construct an empty HTML string for an asset that is a stylesheet (.css)', function () {
        var str = peckerAssets.constructAssetHTML('site.css', optionsTypeLink);
        expect(str).to.equal('');
      });

      it('should construct an HTML string for an asset that is a JavaScript (.js)', function () {
        var str = peckerAssets.constructAssetHTML('helper.js', optionsTypeLink);
        expect(str).to.equal(expectedHTMLStrings['helper.js']);
      });

      it('should construct an HTML string containing only `script` tags for a package asset that has both stylesheets (.css) and JavaScripts (.js)', function () {
        var str = peckerAssets.constructAssetHTML('mainPackage', optionsTypeLink);
        expect(str).to.equal(expectedHTMLStrings['mainPackage-script']);
      });
    });
  });

  afterEach(function (done) {
    peckerAssets = null;
    done();
  });

});