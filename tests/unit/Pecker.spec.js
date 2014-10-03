/* jshint expr: true */

'use strict';
var expect = require('chai').expect;
var Pecker = require('./../../index');


describe('Unit: Pecker', function () {
  beforeEach(function (done) {
    done();
  });

  describe('Pecker', function () {
    it('should have exposed interface(s)', function () {
      console.log(Pecker);
      expect(Pecker).to.be.ok;
      expect(Pecker.Builder).to.be.ok;
      expect(Pecker.Assets).to.be.ok;
      expect(Pecker.Manifest).to.be.ok;
      expect(Pecker.version).to.be.ok;
    });

    it('should have expected version', function () {
      expect(Pecker.version).to.equal(require('./../../package.json').version);
    });
  });

  afterEach(function (done) {
    done();
  });

});