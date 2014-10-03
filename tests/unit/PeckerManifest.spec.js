/* jshint expr: true */

'use strict';
var expect = require('chai').expect;

var PeckerManifest = require('./../../index').Manifest;
var jf = require('jsonfile');
var path = require('path');
var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectManifestFileExists = peckerExpect.expectManifestFileExists;
var expectManifestFileDoesNotExist = peckerExpect.expectManifestFileDoesNotExist;
var cleanBuildFiles = testUtils.cleanBuildFiles;
var tk = require('timekeeper');
var peckerManifest;
var testOptions = {
  destDir: __dirname + '/build'
};
var time = new Date(123142223242);

function getDefaultContent() {
  return {
    name: null,
    baseUrl: '/static',
    assets: {}
  };
}

describe('Unit: PeckerManifest', function () {
  describe('PeckerManifest()', function () {
    beforeEach(function () {
      // freeze time so we can expect build timestamp
      tk.freeze(time);

      peckerManifest = new PeckerManifest(testOptions);
    });

    it('should create a manifest file if it does not already exists', function (done) {
      // clean build files
      cleanBuildFiles({ options: testOptions });
      // ensure it does not exists first
      expectManifestFileDoesNotExist({ options: testOptions });

      peckerManifest = new PeckerManifest(testOptions);
      expectManifestFileExists(peckerManifest);

      done();
    });

    it('should contain default object if manifest is newly created (does not exist before)', function (done) {

      // clean build files
      cleanBuildFiles({ options: testOptions });
      // ensure it does not exists first
      expectManifestFileDoesNotExist({ options: testOptions });


      peckerManifest = new PeckerManifest(testOptions);
      expectManifestFileExists(peckerManifest);

      // manually read the file without using PeckerManifest methods
      var content = jf.readFileSync(path.join(testOptions.destDir, 'manifest.json'));
      expect(content).to.deep.equal(getDefaultContent());

      done();
    });

    it('should re-create a manifest file if it already exists', function (done) {

      expectManifestFileExists(peckerManifest);

      peckerManifest = new PeckerManifest(testOptions);

      expectManifestFileExists(peckerManifest);

      done();
    });

    afterEach(function () {
      tk.reset();
      cleanBuildFiles(peckerManifest);
    });
  });
  describe('PeckerManifest.read()', function () {
    beforeEach(function () {
      // freeze time so we can expect build timestamp
      tk.freeze(time);

      peckerManifest = new PeckerManifest(testOptions);

    });

    it('should return default manifest content right after creating PeckerManifest instance', function (done) {
      var content = peckerManifest.read();

      expect(content).to.deep.equal(getDefaultContent());

      done();
    });

    it('should return default manifest content after it was deleted deliberately', function (done) {

      expectManifestFileExists(peckerManifest);

      // deliberately delete manifest
      cleanBuildFiles(peckerManifest);

      expectManifestFileDoesNotExist({ options: testOptions });

      var content = peckerManifest.read();

      expect(content).to.deep.equal(getDefaultContent());

      done();

    });

    it('should return modified content after this.write()', function (done) {

      var content = peckerManifest.read();
      expect(content).to.deep.equal(getDefaultContent());

      // this.setValue() calls this.write()
      expect(content).to.not.have.keys('testKey');
      peckerManifest.setValue('testKey', 'testValue');

      // read again
      var content2 = peckerManifest.read();
      expect(content2.testKey).to.equal('testValue');

      done();

    });

    it('should return content after it was written manually (outside of this.write())', function (done) {

      expectManifestFileExists(peckerManifest);

      // manually write content
      var manualContent = {
        replacedManifest: true
      };
      var filePath = peckerManifest.filePath;
      jf.writeFileSync(filePath, manualContent);

      var content = peckerManifest.read();

      expect(content).to.deep.equal(manualContent);

      done();

    });

    afterEach(function () {
      tk.reset();
      cleanBuildFiles(peckerManifest);
    });
  });

});