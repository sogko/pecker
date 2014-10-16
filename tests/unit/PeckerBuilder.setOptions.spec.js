/* jshint expr: true */

'use strict';

var path = require('path');
//var expect = require('chai').expect;

var PeckerBuilder = require('./../../index').Builder;

var peckerExpect = require('./../support/expect');
var testUtils = require('./../support/test-utils');
var expectPeckerFieldValue = peckerExpect.expectPeckerFieldValue;
var expectDefaultPeckerFieldValues = peckerExpect.expectDefaultPeckerFieldValues;
var cleanBuildFiles = testUtils.cleanBuildFiles;

var peckerBuilder;
var initialOptions = {
  name: 'testPecker',
  env: 'production',
  skip: ['skip.js'],
  baseDir: __dirname,
  destDir: './build',
  baseUrl: '/static-assets',
  assets: [
    {
      type: 'file',
      name: 'test.js'
    }
  ]
};

describe('Unit: PeckerBuilder.setOptions', function () {
  beforeEach(function () {

    peckerBuilder = new PeckerBuilder(initialOptions);

    // Tests from `PeckerBuilder.options.spec.js`
    expectPeckerFieldValue(peckerBuilder.options, 'name', 'string', 'testPecker');
    expectPeckerFieldValue(peckerBuilder.options, 'env', 'string', 'production');
    expectPeckerFieldValue(peckerBuilder.options, 'skip', 'array', ['skip.js']);
    expectPeckerFieldValue(peckerBuilder.options, 'baseDir', 'string', __dirname);
    expectPeckerFieldValue(peckerBuilder.options, 'destDir', 'string', path.join(__dirname, '/build'));
    expectPeckerFieldValue(peckerBuilder.options, 'baseUrl', 'string', '/static-assets');
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

  it('should replace the previous `this.options` completely', function () {

    peckerBuilder.setOptions({
      name: 'secondPecker'
    });
    // peckerBuilder.options now have the new name
    // but now reset to its default values for other fields
    expectPeckerFieldValue(peckerBuilder.options, 'name', 'string', 'secondPecker');
    expectDefaultPeckerFieldValues(peckerBuilder.options, [
      'env',
      'skip',
      'baseDir',
      'destDir',
      'silent',
      'baseUrl',
      'assets'
    ]);
  });
  afterEach(function () {
    cleanBuildFiles(peckerBuilder);
  });
  after(function () {
    peckerBuilder = new PeckerBuilder(initialOptions);

    cleanBuildFiles(peckerBuilder);
  });
});