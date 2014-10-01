'use strict';

// require a non-managed module with a custom expose name
var log = require('my-simple-logger');
var path = require('path');

module.export = {
  goo: function (message) {
    log(path.join('test', 'tis'), message);
  }
};