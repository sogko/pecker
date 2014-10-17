'use strict';
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var crypto = require('crypto');

function createHash() {
  return crypto.createHash('md5');
}

function vinylFileHash(peckerObj, hook, assetOptions) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('vinylFileHash', 'Streaming not supported'));
      return cb();
    }

    file.revOrigPath = file.path;
    file.revOrigBase = file.base;
    file.revHash = null;
    if (!peckerObj._shouldSkipHash(assetOptions)) {
      var ext = path.extname(file.path);
      file.revHash = createHash().update(file.contents).digest('hex');
      var hashedFilename = [path.basename(file.path, ext), '.', file.revHash, ext].join('');
      file.path = path.join(path.dirname(file.path), hashedFilename);
    }
    this.push(file);
    hook(peckerObj, file, assetOptions);
    cb();
  });
}
module.exports = {
  vinylFileHash: vinylFileHash,
  createHash: createHash

};