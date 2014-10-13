/* jshint expr: true */

'use strict';

var PeckerBuilder = require('./../../index').Builder;
var PeckerAssets = require('./../../index').Assets;
var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectManifestContainAsset = peckerExpect.expectManifestContainAsset;
var expectAssetExists = peckerExpect.expectAssetExists;
var cleanBuildFiles = testUtils.cleanBuildFiles;
var fs = require('fs');
var Handlebars = require('handlebars');


var peckerBuilder;
var options = require('./pecker-config');

describe('E2E: buildAssets', function () {

  beforeEach(function () {
    cleanBuildFiles({
      options: options
    });
  });

  it('should successfully build and prepare assets for e2e test(s)', function (done) {

    this.timeout(5000);
    peckerBuilder = new PeckerBuilder(options);
    peckerBuilder.buildAssets(function () {
      for (var i = 0; i < options.assets.length; i++) {
        var assetOptions = options.assets[i];
        expectManifestContainAsset(peckerBuilder, assetOptions);
        expectAssetExists(peckerBuilder, assetOptions);
      }

      var peckerAssets = new PeckerAssets(peckerBuilder._manifest.read());

      Handlebars.registerHelper('PeckerPackage', function (options) {
        return new Handlebars.SafeString(peckerAssets.constructAssetHTML(options.hash.name, options.hash));
      });

      // create testRunner
      var source = fs.readFileSync(__dirname + '/testRunner.hbs', 'utf8').toString();
      var template = Handlebars.compile(source);
      var result = template({});
      fs.writeFileSync(__dirname + '/testRunner.html', result);

      done();
    });
  });
});