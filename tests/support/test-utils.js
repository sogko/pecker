/* jshint expr: true */

'use strict';

var fs = require('fs-extra');

function cleanBuildFiles(obj) {
  fs.removeSync(obj.options.destDir);
}

module.exports = {
  cleanBuildFiles: cleanBuildFiles
};