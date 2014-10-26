'use strict';

var gutil = require('gulp-util');
var chalk = require('chalk');

function Printer(options) {
  this.options = options;
}

Printer.prototype.showMessage = function showMessage(type) {
  if (this.options.silent) {
    return;
  }
  var message = Array.prototype.slice.call(arguments, 1);
  var color;
  switch (type) {
    case 'error':
      color = chalk.yellow;
      break;
    case 'success':
      color = chalk.green;
      break;
    case 'info':
      color = chalk.cyan;
      break;
    default:
      color = function (a) {
        return a;
      };
  }
  gutil.log(color(message[0] || ''), message.slice(1).join(' '));
};

Printer.prototype.showJSON = function showJSON(object) {
  console.log(JSON.stringify(object, null, '  '));
};

module.exports = Printer;