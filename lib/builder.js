'use strict';

var _ = require('lodash');
var async = require('async');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var map = require('vinyl-map');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var fs = require('fs-extra');
var pkgInfo = require('./package');

var contentHash = require('./content-hash');
var optionsParser = require('./options-parser');
var Manifest = require('./manifest');

function __hookAddAsset(peckerObj, file, assetOptions) {
  var val = path.join(peckerObj.options.baseUrl, path.basename(file.path));
  peckerObj._manifest.addAsset(assetOptions.type, assetOptions.name, val, file.path);
}

/**
 * Built-in transforms
 */
var TRANSFORMS_MAP = {
  'concat': require('./transforms/concat'),
  'uglify': require('./transforms/uglify'),
  'node-sass': require('./transforms/node-sass'),
  'clean-css': require('./transforms/clean-css'),
  'autoprefixer': require('./transforms/autoprefixer')
};

/**
 * Pecker.Builder class
 * @param options
 * @constructor
 */
function Builder(options) {
  this.options = null;
  this._manifest = null;

  this.setOptions(options);
}

/**
 * Builder methods
 */

Builder.prototype.buildBrowserifyAsset = function (_assetOptions, done) {
  var assetOptions = optionsParser.parseAssetOptions(this.options.baseDir, this._manifest.getAssetNames(), _assetOptions);

  var called = false;
  var self = this;

  // skip bundles
  if (_.indexOf(this.options.skip, assetOptions.name) > -1) {
    return done();
  }

  var outputName = assetOptions.name;

  var doBundle = function doBundle(filename) {
    // Note: filename allowed to be `null`
    var b = browserify(filename, {
      debug: (this.options.env !== 'production')
    });

    assetOptions.transform.forEach(function (t) {
      b.transform(t.options, t.fn, t.args);
    });

    assetOptions.require.forEach(function (req) {
      b.require(req.location, { expose: req.expose });
    });

    // resolve externals
    var assetNames = _.map(this.options.assets, 'name');
    var external = [];
    assetOptions.external.forEach(function (ext) {
      if (ext.type === 'bundle' && assetNames.indexOf(ext.name) > -1) {
        _.forEach(this.options.assets[assetNames.indexOf(ext.name)].require, function (req) {
          external.push(req.expose);
        });
      } else if (ext.type === 'module') {
        external.push(ext.name);
      }
    }.bind(this));
    external.forEach(function (name) {
      b.external(name);
    });

    return b.bundle()
      .on('error', function (err, e, f) {
        self.log('error bundle', err, err.message, e, f);
        if (!called) {
          called = true;
          done();
        }
        // end this stream
        this.end();
      });
  }.bind(this);

  if (assetOptions.entries && assetOptions.entries.length > 0) {

    var browserified = transform(function (filename) {
      return doBundle(filename);
    });

    gulp.src(assetOptions.entries)
      .pipe(plumber())
      .pipe(browserified)
      .pipe(concat(outputName))
      .pipe(contentHash.vinylFileHash(this, __hookAddAsset, assetOptions))
      .pipe(gulp.dest(this.options.destDir))
      .on('end', function () {
        if (!called) {
          called = true;
          done();
        }
      });

  } else {

    doBundle(null)
      .pipe(plumber())
      .pipe(source(outputName))
      .pipe(buffer())
      .pipe(concat(outputName))
      .pipe(contentHash.vinylFileHash(this, __hookAddAsset, assetOptions))
      .pipe(gulp.dest(this.options.destDir))
      .on('end', function () {
        if (!called) {
          called = true;
          done();
        }
      });
  }
};

Builder.prototype.buildFolderAsset = function (_assetOptions, done) {
  var assetOptions = optionsParser.parseAssetOptions(this.options.baseDir, this._manifest.getAssetNames(), _assetOptions);

  var tempDist = path.join(this.options.destDir, ['_temp_', assetOptions.name].join(''));
  if (!fs.existsSync(assetOptions.folder)) {
    done();
    return;
  }
  var hash = contentHash.createHash();
  var pattern = [];
  if (assetOptions.include.length > 0) {
    pattern.push(path.join(assetOptions.folder, '/**', ['+(', assetOptions.include.join('|'), ')'].join('')));
  } else {
    pattern.push(path.join(assetOptions.folder, '*.*'));
  }
  if (assetOptions.exclude.length > 0) {
    pattern.push('!' + path.join(assetOptions.folder, '/**', ['+(', assetOptions.exclude.join('|'), ')'].join('')));
  }
  gulp.src(pattern, {
    buffer: false,
    nosort: false // hash is dependent on file order, but sort is still not guaranteed 100%
  })
    .pipe(map(function (content) {
      hash.update(content);
      return content;
    }))
    .pipe(gulp.dest(tempDist))
    .on('end', function () {
      var h = hash.digest('hex');
      var hashedFolderPath = path.join(this.options.destDir, [assetOptions.name, '.', h].join(''));
      if (fs.existsSync(hashedFolderPath)) {
        fs.removeSync(hashedFolderPath);
      }
      if (fs.existsSync(tempDist)) {
        fs.renameSync(tempDist, hashedFolderPath);
      }
      var val = path.join(this.options.baseUrl, path.basename(hashedFolderPath));
      this._manifest.addAsset(assetOptions.type, assetOptions.name, val, hashedFolderPath);
      done();
    }.bind(this));
};

Builder.prototype.buildFileAsset = function (_assetOptions, done) {
  var assetOptions = optionsParser.parseAssetOptions(this.options.baseDir, this._manifest.getAssetNames(), _assetOptions);

  var stream = gulp.src(assetOptions.files);

  // apply transform instructions
  for (var i = 0; i < assetOptions.transform.length; i++) {
    var t = assetOptions.transform[i];
    if (_.isString(t)) {
      t = {
        options: {},
        fn: t,
        args: {}
      };
    }

    if (_.isFunction(t)) {
      stream = stream.pipe(map(t));
    } else if (_.isPlainObject(t)) {
      var fn = TRANSFORMS_MAP[t.fn];
      if (!_.isFunction(fn)) {
        continue;
      }

      // Note: `concat` is a special built-in transform
      var args = (t.fn === 'concat') ? assetOptions.name : t.args;

      stream = stream.pipe(fn(args));
    }
  }
  stream
    .pipe(concat(assetOptions.name))
    .pipe(contentHash.vinylFileHash(this, __hookAddAsset, assetOptions))
    .pipe(gulp.dest(path.join(this.options.destDir)))
    .on('end', done);
};

Builder.prototype.buildUrlAsset = function (_assetOptions, done) {
  var assetOptions = optionsParser.parseAssetOptions(this.options.baseDir, this._manifest.getAssetNames(), _assetOptions);
  this._manifest.addAsset(assetOptions.type, assetOptions.name, assetOptions.url);
  done();
};

Builder.prototype.buildPackageAsset = function (assetOptions, done) {
  this._manifest.addAsset(assetOptions.type, assetOptions.name, assetOptions.assetNames);
  done();
};

Builder.prototype.buildPeckerClientFiles = function (done) {
  var assetOptions = {
    peckerPackage: {
      skipParseFns: ['name'],
      type: 'package',
      name: 'Pecker',
      assetNames: ['pecker.js', 'pecker-loader.js']
    },
    peckerJs: {
      skipParseFns: ['name', 'external', 'entries', 'require'],
      skipHash: false,
      type: 'browserify',
      name: 'pecker.js',
      entries: [],
      transform: [
        {
          options: {
            global: true
          },
          fn: 'uglifyify',
          args: {}
        }
      ],
      require: [
        {
          type: 'module',
          name: 'Pecker',
          expose: 'Pecker',
          location: path.join(__dirname, '/_pecker.js')
        }
      ]
    },
    peckerLoaderJs: {
      skipParseFns: ['name', 'external', 'entries', 'require'],
      type: 'file',
      name: 'pecker-loader.js',
      files: [path.join(__dirname, '/_pecker-loader.js')],
      transform: [
        function (content) {
          // bootstrap Pecker.init() payload
          var manifestContent = _.cloneDeep(this._manifest.read());
          // exclude pecker-loader asset in client-side because chicken-egg
          delete manifestContent.assets['pecker-loader.js'];
          delete manifestContent.assets.Pecker;
          var payload = {
            version: pkgInfo.version,
            manifest: manifestContent
          };
          content = content.toString().replace('/*DataTemplate*/', JSON.stringify(payload));
          return content;
        }.bind(this),
        {
          options: {},
          fn: 'uglify',
          args: {}
        }
      ]
    }
  };
  async.series([
    function buildPeckerPackage(next) {
      this.buildPackageAsset(assetOptions.peckerPackage, function () {
        next();
      });
    }.bind(this),
    function buildPeckerJs(next) {
      this.buildBrowserifyAsset(assetOptions.peckerJs, function () {
        next();
      });
    }.bind(this),
    function buildPeckerLoaderJs(next) {
      this.buildFileAsset(assetOptions.peckerLoaderJs, function () {
        next();
      });
    }.bind(this)
  ], function () {
    if (typeof done === 'function') {
      done();
    }
  });
};
/**
 * Director methods
 */

Builder.prototype.buildAssets = function (done) {

  var self = this;

  async.each(self.options.assets, function (assetOptions, callback) {
    switch (assetOptions.type) {
      case 'file':
        self.log('buildFileAsset start', assetOptions.name);
        self.buildFileAsset(assetOptions, function (err, results) {
          self.log('buildFileAsset done', assetOptions.name);
          callback(err, results);
        });
        break;
      case 'folder':
        self.log('buildFolderAsset start', assetOptions.name);
        self.buildFolderAsset(assetOptions, function (err, results) {
          self.log('buildFolderAsset done', assetOptions.name);
          callback(err, results);
        });
        break;
      case 'browserify':
        self.log('buildBrowserifyAsset start', assetOptions.name);
        self.buildBrowserifyAsset(assetOptions, function (err, results) {
          self.log('buildBrowserifyAsset done', assetOptions.name);
          callback(err, results);
        });
        break;
      // no build required for packages / urls
      case 'package':
        self.log('buildPackageAsset start', assetOptions.name);
        self.buildPackageAsset(assetOptions, function (err, results) {
          self.log('buildPackageAsset done', assetOptions.name);
          callback(err, results);
        });
        break;
      case 'url':
        self.log('buildUrlAsset start', assetOptions.name);
        self.buildUrlAsset(assetOptions, function (err, results) {
          self.log('buildUrlAsset done', assetOptions.name);
          callback(err, results);
        });
        break;
    }
  }, function (err) {
    if (err) {
      self.log('error', err);
      done(err, {
        config: self.options,
        manifest: self._manifest.read()
      });
      return;
    }
    self.buildPeckerClientFiles(function () {
      self.log('done');
      done(err, {
        config: self.options,
        manifest: self._manifest.read()
      });
    });
  });
};

Builder.prototype.watchAssets = function (done) {

  var self = this;

  async.each(this.options.assets, function (assetOptions, callback) {
    if (!assetOptions.watch || assetOptions.watch.length <= 0) {
      return callback();
    }

    switch (assetOptions.type) {
      case 'file':
        watch(assetOptions.watch, {
          name: assetOptions.name
        }, function () {
          self.buildFileAsset(assetOptions, function () {
            self.log('buildFileAsset done', assetOptions.name);
            self.buildPeckerClientFiles();
          });
        });
        callback();
        break;
      case 'folder':
        watch(assetOptions.watch, {
          name: assetOptions.name
        }, function () {
          self.buildFolderAsset(assetOptions, function () {
            self.log('buildFolderAsset done', assetOptions.name);
            self.buildPeckerClientFiles();
          });
        });
        callback();
        break;
      case 'browserify':
        watch(assetOptions.watch, {
          name: assetOptions.name
        }, function () {
          self.buildBrowserifyAsset(assetOptions, function () {
            self.log('buildBrowserifyAsset done', assetOptions.name);
            self.buildPeckerClientFiles();
          });
        });
        callback();
        break;
      // no build required for packages / urls
      case 'package':
      case 'url':
        callback();
        break;
    }
  }, function (err) {
    if (err) {
      self.log('error', err);
    }
    self.log('done');
    done();
  });
};

/**
 * Helper/Getter methods
 */

Builder.prototype.getManifestFilePath = function () {
  if (!this._manifest) {
    // shouldn't happen if you guys didn't mess around with my private parts
    return null;
  }
  return this._manifest.filePath;
};

Builder.prototype.log = function () {
  if (this.options.silent === true) {
    return;
  }
  var args = Array.prototype.slice.call(arguments, 0);
  gutil.log(args.join(' '));
};

/**
 * setOptions Sets the options for Builder object.
 * Use this member method to modify / update the options. This replace the
 * previous `this.options` completely.
 * Do not modify `this.options` directly (treat it as immutable)
 * @param options
 */
Builder.prototype.setOptions = function (options) {
  this.options = optionsParser.parsePeckerOptions(options);
  this._manifest = new Manifest({ destDir: this.options.destDir });
  this._manifest.setValue('name', this.options.name);
  this._manifest.setValue('baseUrl', this.options.baseUrl);
};

module.exports = Builder;