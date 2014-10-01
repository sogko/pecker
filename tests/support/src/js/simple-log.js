'use strict';

module.exports = {
  log: function () {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log(args.join(' '));
  }
};