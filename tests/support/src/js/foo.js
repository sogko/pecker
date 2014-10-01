'use strict';

var log = require('./simple-log');

module.export = {
  bar: function (message) {
    log(message);
  }
};