'use strict';
var _ = require('lodash');
var path = require('path');
var bowerResolve = require('bower-resolve');
var npmResolve = require('resolve');

/**
 * List of reserved names that should not be used for an asset name
 */
var SYSTEM_NAMES = [
  'manifest.json',
  'helper.js'
];

var parseFns = {
  parseEntries: function (value, baseDir) {
    var entries = [];
    _.forEach(value, function (e) {
      if (!e) {
        return;
      }
      entries.push(path.join(baseDir, e));
    });
    return entries;
  },
  parseWatch: function (value, baseDir) {
    var watch = [];
    _.forEach(value, function (w) {
      if (!w) {
        return;
      }
      watch.push(path.join(baseDir, w));
    });
    return watch;
  },
  parseFolderPath: function (value, baseDir) {
    return path.join(baseDir, value, '/**');
  },
  parseFolderIncludeExtensions: function (value) {
    if (!value || value.length === 0) {
      return ['*.*'];
    }
    return value;
  },
  parseTransform: function (value) {
    var transform = [];
    _.forEach(value, function (t) {
      if (_.isFunction(t)) {
        transform.push(t);
      } else if (_.isString(t)) {
        transform.push({
          opts: {},
          fn: t,
          args: {}
        });
      } else if (_.isPlainObject(t)) {
        if (!_.isString(t.fn)) {
          return;
        }
        t.opts = t.opts || {};
        t.args = t.args || {};
        transform.push({
          opts: t.opts,
          fn: t.fn,
          args: t.args
        });
      }
    });
    return transform;
  },
  parseBrowserifyExternal: function (value, baseDir, assetNames) {
    // we always add `helper.js` as an external
    var external = [
      {
        type: 'module',
        name: 'helper'
      }
    ];
    _.forEach(value, function (ext) {
      if (_.isString(ext) && _.indexOf(assetNames, ext) > -1) {
        ext = { type: 'bundle', name: ext };
      } else if (_.isString(ext) && _.indexOf(assetNames, ext) <= -1) {
        ext = { type: 'module', name: ext };
      }
      if (!ext.name) {
        return;
      }
      external.push({ type: ext.type || 'module', name: ext.name });
    });
    return external;
  },
  parseBrowserifyRequire: function (value, baseDir) {

    var req = [];
    _.forEach(value, function (r) {

      if (r && _.isString(r)) {
        r = {
          type: 'module',
          name: r,
          location: path.join(baseDir, r)
        };
      }

      if (!r.name) {
        return;
      }

      var type = (r.type || 'module').toLowerCase();
      var name = r.name;
      var expose = r.expose || name;
      var location = (r.location) ? path.join(baseDir, r.location) : null;
      if (!location) {
        // TODO: handle error if name points to non-existing bower/npm module
        switch (type) {
          case 'bower':
            try {
              location = bowerResolve.fastReadSync(name);
            } catch (e) {
              throw (new Error('Failed to resolve bower component: "' + name + '".\n' +
                'Please ensure bower component was installed by running `bower install --save ' + name + '`'));
            }
            break;
          case 'npm':
            try {
              location = npmResolve.sync(name);
            } catch (e) {
              throw (new Error('Failed to resolve npm module: "' + name + '".\n' +
                'Please ensure npm module was installed by running `npm install --save ' + name + '`'));
            }
            break;
          case 'module':
            location = require.resolve(path.join(baseDir, name));
            break;
          default:
            location = require.resolve(path.join(baseDir, name));
            break;
        }
      }
      if (location) {
        req.push({ type: type, name: name, expose: expose, location: location });
      }
    });
    return req;
  },
  parsePackageAssetNames: function (value, baseDir, assetNames) {
    var res = [];
    _.forEach(value, function (ext) {
      var base = path.normalize(ext).split('/')[0];
      if (_.isString(base) && _.indexOf(assetNames, base) > -1 && _.indexOf(res, ext) <= -1) {
        res.push(ext);
      }
    });
    return res;
  },
  parseAssetName: function (value) {

    // ensure that asset names does not conflict with system asset names
    if (SYSTEM_NAMES.indexOf(value.toLowerCase()) >= 0) {
      return '_' + value;
    }
    return value;
  }
};

var SCHEMA = {
  file: {
    type: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true,
      parseFn: parseFns.parseAssetName
    },
    files: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseEntries
    },
    transform: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseTransform
    },
    watch: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseWatch
    }
  },
  folder: {
    type: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true,
      parseFn: parseFns.parseAssetName
    },
    folder: {
      type: 'string',
      required: true,
      parseFn: parseFns.parseFolderPath
    },
    include: {
      type: 'array',
      default: ['*.*'],
      parseFn: parseFns.parseFolderIncludeExtensions
    },
    exclude: {
      type: 'array',
      default: []
    },
    transform: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseTransform
    },
    watch: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseWatch
    }
  },
  browserify: {
    type: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true,
      parseFn: parseFns.parseAssetName
    },
    entries: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseEntries
    },
    require: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseBrowserifyRequire
    },
    external: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseBrowserifyExternal
    },
    transform: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseTransform
    },
    watch: {
      type: 'array',
      default: [],
      parseFn: parseFns.parseWatch
    },
    skipHash: {
      type: 'boolean',
      default: false
    }
  },
  package: {
    type: {
      type: 'string',
      required: true,
      parseFn: parseFns.parseAssetName
    },
    name: {
      type: 'string',
      required: true
    },
    assetNames: {
      type: 'array',
      default: [],
      parseFn: parseFns.parsePackageAssetNames
    }
  },
  url: {
    type: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true,
      parseFn: parseFns.parseAssetName
    },
    url: {
      type: 'string',
      required: true
    }
  }
};

function _parseAssetsOpts(baseDir, assetsNames, opts) {
  var parsed = {};

  // check accepted file type
  var schema = SCHEMA[opts.type];
  if (!schema) {
    return;
  }

  for (var propName in schema) {
    if (!schema.hasOwnProperty(propName)) {
      continue;
    }

    var prop = schema[propName];
    var value = opts[propName];

    // ensure required
    if (prop.required === true) {
      if (!value) {
        return;
      }
    }

    // default value
    if (typeof value === 'undefined' || value === null) {
      value = prop.default;
    }

    // type
    if (prop.type === 'array' && !_.isArray(value)) {
      value = [value];
    }
    if (prop.type === 'string') {
      value = value.toString();
    }
    // parse value
    if (_.isFunction(prop.parseFn)) {
      value = prop.parseFn(value, baseDir, assetsNames);
    }

    parsed[propName] = value;
  }

  return parsed;
}

function parseAssetsOpts(baseDir, opts) {
  var assetsRaw = opts || [];
  if (!_.isArray(assetsRaw)) {
    assetsRaw = [assetsRaw];
  }
  var assetsNames = _.map(assetsRaw, 'name');
  var assets = [];
  for (var i = 0; i < assetsRaw.length; i++) {
    var rawOpts = assetsRaw[i];
    if (!rawOpts) {
      continue;
    }
    var p = _parseAssetsOpts(baseDir, assetsNames, rawOpts);
    if (p) {
      assets.push(p);
    }
  }

  var newAssetsNames = _.map(assets, 'name');

  // resolve assets[].external
  _.forEach(assets, function (b) {
    var external = [];
    if (!b.external) {
      return;
    }
    _.forEach(b.external, function (ext) {
      if (ext.type === 'bundle' && newAssetsNames.indexOf(ext.name) > -1) {
        _.forEach(assets[newAssetsNames.indexOf(ext.name)].require, function (req) {
          external.push(req.expose);
        });
      } else if (ext.type === 'module') {
        external.push(ext.name);
      }
    });
    b.external = _.uniq(external);
  });

  // resolve nested packages
  function resolveNames(pkg, parentName) {
    var external = [];
    _.forEach(pkg.assetNames, function (name) {
      if (!_.isString(name)) {
        return;
      }
      var base = path.normalize(name).split('/')[0];
      if (_.indexOf(newAssetsNames, base) < 0) {
        return;
      }
      if (pkg.name === base) {
        return;
      }
      var a = assets[_.indexOf(newAssetsNames, base)];
      if (a.type === 'package') {
        if (parentName !== a.name) {
          external = external.concat(resolveNames(a, parentName));
        }
      } else if (a.type === 'folder') {
        if (name !== base) {
          external.push(name);
        }
      } else {
        external.push(a.name);
      }
    });
    return _.uniq(external);
  }

  _.forEach(assets, function (b) {
    if (b.type === 'package') {
      b.assetNames = resolveNames(b, b.name);
    }
  });

  return assets;
}

function parseOpts(opts) {
  opts = opts || {};
  var name = opts.name || null;
  var env = opts.env || 'development';
  var skip = opts.skip || [];
  var baseDir = opts.baseDir || process.cwd();
  var destDir = path.join(baseDir, opts.destDir || 'dist');
  var baseUrl = opts.baseUrl || '/static';

  return {
    name: name,
    env: env,
    skip: skip,
    baseDir: baseDir,
    destDir: destDir,
    baseUrl: baseUrl,
    assets: parseAssetsOpts(baseDir, opts.assets)
  };
}
module.exports = {
  parseOpts: parseOpts
};