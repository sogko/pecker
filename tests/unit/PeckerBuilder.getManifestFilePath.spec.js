/* jshint expr: true */

'use strict';

var expect = require('chai').expect;

var PeckerBuilder = require('./../../index').Builder;

var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectManifestFileExists = peckerExpect.expectManifestFileExists;
var cleanBuildFiles = testUtils.cleanBuildFiles;

var peckerBuilder;

describe('Unit: PeckerBuilder.getManifestFilePath', function () {
  beforeEach(function () {
    peckerBuilder = new PeckerBuilder({});
  });

  it('should successfully return the manifest file path', function () {
    expectManifestFileExists(peckerBuilder);
    var filePath = peckerBuilder.getManifestFilePath();
    expect(filePath).to.be.ok;
  });

  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
});