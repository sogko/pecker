/* global expect */
/* global Pecker */
/* jshint expr: true */

'use strict';
var expectedAssets = {
  'mainAssets': {
    'type': 'package',
    'names': [
      'vendor/bootstrap/css/bootstrap.css',
      'vendor/bootstrap/css/bootstrap-theme.css',
      'vendor/bootstrap/fonts/glyphicons-halflings-regular.eot',
      'site.css',
      'app.css',
      'bundle.js'
    ]
  },
  'site.css': {
    'type': 'file',
    'url': 'dist/site.738e739875b4de7b543ee43d149ec602.css',
    'path': '/Users/hafiz/dev/pecker/tests/e2e/dist/site.738e739875b4de7b543ee43d149ec602.css'
  },
  'app.css': {
    'type': 'file',
    'url': 'dist/app.ae7103a304dc454bd1d388fbdbc23869.css',
    'path': '/Users/hafiz/dev/pecker/tests/e2e/dist/app.ae7103a304dc454bd1d388fbdbc23869.css'
  },
  'bar.js': {
    'type': 'browserify',
    'url': 'dist/bar.32ee11a9a04b692b45cb331068616b57.js',
    'path': '/Users/hafiz/dev/pecker/tests/e2e/dist/bar.32ee11a9a04b692b45cb331068616b57.js'
  },
  'vendor': {
    'type': 'folder',
    'url': 'dist/vendor.36fb92c6d728f9d273727f9c0f3aebf0',
    'path': '/Users/hafiz/dev/pecker/tests/e2e/dist/vendor.36fb92c6d728f9d273727f9c0f3aebf0'
  },
  'pecker.js': {
    'type': 'browserify',
    'url': 'dist/pecker.34441db2759b83d7a0dba5eb2cef468e.js',
    'path': '/Users/hafiz/dev/pecker/tests/e2e/dist/pecker.34441db2759b83d7a0dba5eb2cef468e.js'
  },
  'bundle.js': {
    'type': 'browserify',
    'url': 'dist/bundle.2f86851745b13c1d03ac27a6957740f0.js',
    'path': '/Users/hafiz/dev/pecker/tests/e2e/dist/bundle.2f86851745b13c1d03ac27a6957740f0.js'
  },
  'foo.js': {
    'type': 'browserify',
    'url': 'dist/foo.92aaa59460269603d90ba6af59740668.js',
    'path': '/Users/hafiz/dev/pecker/tests/e2e/dist/foo.92aaa59460269603d90ba6af59740668.js'
  }
};

function expectPeckerObject(p) {
  expect(p).to.be.ok;
  expect(p.Assets).to.be.ok;
  expect(p.Manifest).to.be.ok;
  expect(p.version).to.be.ok;
  expect(p.__data).to.be.ok;
  expect(p.__data.manifest).to.be.ok;
  expect(p.__data.version).to.be.ok;
}

describe('Pecker', function () {
  it('should load Pecker object into `window`', function () {
    expect(window).to.be.ok;
    expect(window.Pecker).to.be.ok;
    expectPeckerObject(window.Pecker);
  });
  it('should load Pecker object into global', function () {
    expect(Pecker).to.be.ok;
    expectPeckerObject(Pecker);
  });
});

describe('Pecker.Assets', function () {
  describe('Pecker.Assets.getAsset()', function () {
    it('should be able to get all loaded assets', function () {
      for (var assetName in expectedAssets) {
        if (!expectedAssets.hasOwnProperty(assetName)) {
          continue;
        }
        expect(Pecker.Assets.getAsset(assetName)).to.deep.equal(expectedAssets[assetName]);
      }
    });
    it('should return null for asset that does not exists', function () {
      expect(Pecker.Assets.getAsset('assetDoesNotExists')).to.be.null;
    });
    it('should return null for Pecker and pecker-loader.js assets', function () {
      expect(Pecker.Assets.getAsset('Pecker')).to.be.null;
      expect(Pecker.Assets.getAsset('pecker-loader.js')).to.be.null;
    });
  });
  describe('Pecker.Assets.getUrl()', function () {
    describe('asset type is not a `folder`', function () {
      it('should be able to get url for existing asset using base asset name', function () {
        expect(Pecker.Assets.getUrl('site.css')).to.deep.equal(expectedAssets['site.css'].url);
      });
      it('should be able to get base url for existing asset using path within asset', function () {
        expect(Pecker.Assets.getUrl('site.css/bootstrap/bootstrap.min.css')).to.deep.equal(expectedAssets['site.css'].url);
      });
      it('should return the first url for assets (package) with multiple urls', function () {
        expect(Pecker.Assets.getUrl('mainAssets')).to.deep.equal(expectedAssets.vendor.url + '/bootstrap/css/bootstrap.css');
      });
    });
    describe('asset type is a `folder`', function () {
      it('should be able to get url for existing asset using base asset name', function () {
        expect(Pecker.Assets.getUrl('vendor')).to.deep.equal(expectedAssets.vendor.url);
      });
      it('should be able to get url for existing asset using path within asset', function () {
        expect(Pecker.Assets.getUrl('vendor/bootstrap/css/bootstrap.css')).to.deep.equal(expectedAssets.vendor.url + '/bootstrap/css/bootstrap.css');
      });
    });
    it('should return null for asset that does not exists', function () {
      expect(Pecker.Assets.getUrl('assetDoesNotExists')).to.be.null;
    });
  });
  describe('Pecker.Assets.getUrls()', function () {
    describe('asset type is not a `folder`', function () {
      it('should be able to get an array of url for existing asset using base asset name', function () {
        expect(Pecker.Assets.getUrls('site.css')).to.deep.equal([expectedAssets['site.css'].url]);
      });
      it('should be able to get an array of url for existing asset using path within asset', function () {
        expect(Pecker.Assets.getUrls('site.css/bootstrap/bootstrap.min.css')).to.deep.equal([expectedAssets['site.css'].url]);
      });
      it('should return an array of urls for assets (package) with multiple urls', function () {
        var expected = [
          expectedAssets.vendor.url + '/bootstrap/css/bootstrap.css',
          expectedAssets.vendor.url + '/bootstrap/css/bootstrap-theme.css',
          expectedAssets.vendor.url + '/bootstrap/fonts/glyphicons-halflings-regular.eot',
          expectedAssets['site.css'].url,
          expectedAssets['app.css'].url,
          expectedAssets['bundle.js'].url
        ];
        expect(Pecker.Assets.getUrls('mainAssets')).to.deep.equal(expected);
      });
    });
    describe('asset type is a `folder`', function () {
      it('should be able to get an array of url for existing asset using base asset name', function () {
        expect(Pecker.Assets.getUrls('vendor')).to.deep.equal([expectedAssets.vendor.url]);
      });
      it('should be able to get an array of url for existing asset using path within asset', function () {
        expect(Pecker.Assets.getUrls('vendor/bootstrap/css/bootstrap.css')).to.deep.equal([expectedAssets.vendor.url + '/bootstrap/css/bootstrap.css']);
      });
    });
    it('should return an empty array for asset that does not exists', function () {
      expect(Pecker.Assets.getUrls('assetDoesNotExists')).to.deep.equal([]);
    });
  });
  describe('Pecker.Assets.getGroupedUrls(name, [options])', function () {

    var defaultGroupKeys = ['baseUrl', 'others', 'stylesheet', 'javascript'];

    describe('Default option.groups', function () {

      it('should return a map of urls for the asset (group type = `javascript`)', function () {
        var urls = Pecker.Assets.getGroupedUrls('bar.js');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: Pecker.Assets.content.baseUrl,
          stylesheet: [],
          javascript: [
            expectedAssets['bar.js'].url
          ],
          others: []
        });

      });
      it('should return a map of urls for the asset (group type = `stylesheet`)', function () {
        var urls = Pecker.Assets.getGroupedUrls('site.css');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: Pecker.Assets.content.baseUrl,
          stylesheet: [
            expectedAssets['site.css'].url
          ],
          javascript: [],
          others: []
        });
      });

      it('should return a map of urls for the asset (group type = `others`)', function () {
        var urls = Pecker.Assets.getGroupedUrls('vendor');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: Pecker.Assets.content.baseUrl,
          stylesheet: [],
          javascript: [],
          others: [
            expectedAssets.vendor.url
          ]
        });
      });

      it('should return a map of urls for the asset (group type = `multiple`)', function () {
        var urls = Pecker.Assets.getGroupedUrls('mainAssets');
        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: Pecker.Assets.content.baseUrl,
          stylesheet: [
            expectedAssets.vendor.url + '/bootstrap/css/bootstrap.css',
            expectedAssets.vendor.url + '/bootstrap/css/bootstrap-theme.css',
            expectedAssets['site.css'].url,
            expectedAssets['app.css'].url
          ],
          javascript: [
            expectedAssets['bundle.js'].url
          ],
          others: [
            expectedAssets.vendor.url + '/bootstrap/fonts/glyphicons-halflings-regular.eot'
          ]
        });
      });

      it('should return a map if asset does not exist', function () {
        var urls = Pecker.Assets.getGroupedUrls('assetDoesNotExists');

        expect(urls).to.have.keys(defaultGroupKeys);
        expect(urls).to.have.deep.equal({
          baseUrl: Pecker.Assets.content.baseUrl,
          stylesheet: [],
          javascript: [],
          others: []
        });
      });
    });
    describe('Custom option.groups', function () {
      it('should return a map of urls for the asset (custom group type = `font`)', function () {
        var urls = Pecker.Assets.getGroupedUrls('mainAssets', {
          groups: {
            font: ['.eot']
          }
        });

        expect(urls).to.have.keys(defaultGroupKeys.concat(['font']));
        expect(urls).to.have.deep.equal({
          baseUrl: Pecker.Assets.content.baseUrl,
          stylesheet: [
            expectedAssets.vendor.url + '/bootstrap/css/bootstrap.css',
            expectedAssets.vendor.url + '/bootstrap/css/bootstrap-theme.css',
            expectedAssets['site.css'].url,
            expectedAssets['app.css'].url
          ],
          javascript: [
            expectedAssets['bundle.js'].url
          ],
          font: [
            expectedAssets.vendor.url + '/bootstrap/fonts/glyphicons-halflings-regular.eot'
          ],
          others: []
        });

      });
      it('should return a map of urls for the asset (custom group type = `font`) but asset does not have specified group', function () {
        var urls = Pecker.Assets.getGroupedUrls('pecker.js', {
          groups: {
            font: ['.eot']
          }
        });

        expect(urls).to.have.keys(defaultGroupKeys.concat(['font']));
        expect(urls).to.have.deep.equal({
          baseUrl: Pecker.Assets.content.baseUrl,
          stylesheet: [],
          javascript: [
            expectedAssets['pecker.js'].url
          ],
          font: [],
          others: []
        });

      });

    });
  });

  describe('Pecker.Assets.getFilePath()', function () {
    describe('asset type is not a `folder`', function () {
      it('should be able to get file path for existing asset using base asset name', function () {
        expect(Pecker.Assets.getFilePath('site.css')).to.deep.equal(expectedAssets['site.css'].path);
      });
      it('should be able to get base file path for existing asset using path within asset', function () {
        expect(Pecker.Assets.getFilePath('site.css/bootstrap/bootstrap.min.css')).to.deep.equal(expectedAssets['site.css'].path);
      });
      it('should return the first file path for assets (package) with multiple file paths', function () {
        expect(Pecker.Assets.getFilePath('mainAssets')).to.deep.equal(expectedAssets.vendor.path + '/bootstrap/css/bootstrap.css');
      });
    });
    describe('asset type is a `folder`', function () {
      it('should be able to get file path for existing asset using base asset name', function () {
        expect(Pecker.Assets.getFilePath('vendor')).to.deep.equal(expectedAssets.vendor.path);
      });
      it('should be able to get file path for existing asset using path within asset', function () {
        expect(Pecker.Assets.getFilePath('vendor/bootstrap/css/bootstrap.css')).to.deep.equal(expectedAssets.vendor.path + '/bootstrap/css/bootstrap.css');
      });
    });
    it('should return null for asset that does not exists', function () {
      expect(Pecker.Assets.getFilePath('assetDoesNotExists')).to.be.null;
    });
  });
  describe('Pecker.Assets.getFilePaths()', function () {
    describe('asset type is not a `folder`', function () {
      it('should be able to get an array of file path for existing asset using base asset name', function () {
        expect(Pecker.Assets.getFilePaths('site.css')).to.deep.equal([expectedAssets['site.css'].path]);
      });
      it('should be able to get an array of file path for existing asset using path within asset', function () {
        expect(Pecker.Assets.getFilePaths('site.css/bootstrap/bootstrap.min.css')).to.deep.equal([expectedAssets['site.css'].path]);
      });
      it('should return an array of file paths for assets (package) with multiple file paths', function () {
        var expected = [
          expectedAssets.vendor.path + '/bootstrap/css/bootstrap.css',
          expectedAssets.vendor.path + '/bootstrap/css/bootstrap-theme.css',
          expectedAssets.vendor.path + '/bootstrap/fonts/glyphicons-halflings-regular.eot',
          expectedAssets['site.css'].path,
          expectedAssets['app.css'].path,
          expectedAssets['bundle.js'].path
        ];
        expect(Pecker.Assets.getFilePaths('mainAssets')).to.deep.equal(expected);
      });
    });
    describe('asset type is a `folder`', function () {
      it('should be able to get an array of file path for existing asset using base asset name', function () {
        expect(Pecker.Assets.getFilePaths('vendor')).to.deep.equal([expectedAssets.vendor.path]);
      });
      it('should be able to get an array of file path for existing asset using path within asset', function () {
        expect(Pecker.Assets.getFilePaths('vendor/bootstrap/css/bootstrap.css')).to.deep.equal([expectedAssets.vendor.path + '/bootstrap/css/bootstrap.css']);
      });
    });
    it('should return an empty array for asset that does not exists', function () {
      expect(Pecker.Assets.getFilePaths('assetDoesNotExists')).to.deep.equal([]);
    });
  });
});

describe('Browserify', function () {
  it('should be able to require `Pecker`', function () {
    var p = require('Pecker');
    expect(p).to.be.ok;
    expectPeckerObject(p);

  });
  it('should be able to require other browserified exports', function () {

    var log = require('my-simple-logger');
    expect(log).to.be.ok;
    expect(log).to.be.an('object');
    expect(log.log).to.be.a('function');
    log.log('test');
  });
});