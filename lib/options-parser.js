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
  'pecker.json',
  'pecker.js',
  'pecker-loader.js',
  'pecker'
];

var parseFns = {
  parseEntries: function (value, baseDir) {
    var entries = [];
    _.forEach(value, function (e) {
      if (!e) {
        return;
      }
      entries.push(path.resolve(baseDir, e));
    });
    return entries;
  },
  parseWatch: function (value, baseDir) {
    var watch = [];
    _.forEach(value, function (w) {
      if (!w) {
        return;
      }
      watch.push(path.resolve(baseDir, w));
    });
    return watch;
  },
  parseFolderPath: function (value, baseDir) {
    return path.resolve(baseDir, value);
  },
  parseTransform: function (value) {
    var transform = [];
    _.forEach(value, function (t) {
      if (_.isFunction(t)) {
        transform.push(t);
      } else if (_.isString(t)) {
        transform.push({
          options: {},
          fn: t,
          args: {}
        });
      } else if (_.isPlainObject(t)) {
        if (!_.isString(t.fn)) {
          return;
        }
        t.options = t.options || {};
        t.args = t.args || {};
        transform.push({
          options: t.options,
          fn: t.fn,
          args: t.args
        });
      }
    });
    return transform;
  },
  parseBrowserifyExternal: function (value, baseDir, assetNames) {
    // we always add `Pecker` as an external
    var external = [
      {
        type: 'module',
        name: 'Pecker'
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
          location: path.resolve(baseDir, r)
        };
      }

      if (!r.name) {
        return;
      }

      var type = (r.type || 'module').toLowerCase();
      var name = r.name;
      var expose = r.expose || name;

      var resolvedLocation;
      if (r.location && r.location.split(path.sep).length > 1) {
        resolvedLocation = (r.location) ? path.resolve(baseDir, r.location) : null;
      }
      // else, the case of trying to resolve npm built-in modules multiple times (eg. path);
      if (!resolvedLocation) {
        // TODO: handle error if name points to non-existing bower/npm module
        switch (type) {
          case 'bower':
            try {
              resolvedLocation = bowerResolve.fastReadSync(name);
            } catch (e) {
              throw (new Error('Failed to resolve bower component: "' + name + '".\n' +
                'Please ensure bower component was installed by running `bower install --save ' + name + '`'));
            }
            break;
          case 'npm':
            try {
              resolvedLocation = npmResolve.sync(name);
            } catch (e) {
              throw (new Error('Failed to resolve npm module: "' + name + '".\n' +
                'Please ensure npm module was installed by running `npm install --save ' + name + '`'));
            }
            break;
          case 'module':
            resolvedLocation = require.resolve(path.resolve(baseDir, name));
            break;
          default:
            resolvedLocation = require.resolve(path.resolve(baseDir, name));
            break;
        }
      }
      if (resolvedLocation) {
        req.push({
          type: type,
          name: name,
          expose: expose,
          location: resolvedLocation,
          _origLocation: r._origLocation
        });
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
    },
    skipHash: {
      type: 'boolean',
      default: false
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
      default: []
    },
    exclude: {
      type: 'array',
      default: []
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
    },
    // internal option
    skipParseFns: {
      type: 'array',
      default: []
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

function parseAssetOptions(baseDir, assetsNames, options) {
  var parsed = {};

  // check accepted file type
  var schema = SCHEMA[options.type];
  if (!schema) {
    return;
  }

  for (var propName in schema) {
    if (!schema.hasOwnProperty(propName)) {
      continue;
    }

    var prop = schema[propName];
    var value = options[propName];

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
    if (!(options.skipParseFns && options.skipParseFns.indexOf(propName) >= 0)) {
      if (_.isFunction(prop.parseFn)) {
        value = prop.parseFn(value, baseDir, assetsNames);
      }
    }


    parsed[propName] = value;
  }

  return parsed;
}
function __parseAssets(baseDir, options) {
  var assetsRaw = options || [];
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
    var p = parseAssetOptions(baseDir, assetsNames, rawOpts);
    if (p) {
      assets.push(p);
    }
  }

  var newAssetsNames = _.map(assets, 'name');

  // TODO: can i do this inside buildPackageAssets?
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
function parsePeckerOptions(options) {
  options = options || {};
  var name = options.name || null;
  var env = options.env || 'development';
  var skip = options.skip || [];
  var baseDir = path.resolve(process.cwd(), options.baseDir || '.') || process.cwd();
  var destDir = path.resolve(baseDir, options.destDir || 'dist');
  var baseUrl = options.baseUrl || '/static';
  var silent = (options.silent === true);
  var skipHash = (typeof options.skipHash === 'undefined') ? null : options.skipHash; // tri-state: null, true, false;

  return {
    name: name,
    env: env,
    skip: skip,
    baseDir: baseDir,
    destDir: destDir,
    baseUrl: baseUrl,
    silent: silent,
    skipHash: skipHash,
    assets: __parseAssets(baseDir, options.assets)
//    assets: options.assets
  };
}
module.exports = {
  parsePeckerOptions: parsePeckerOptions,
  parseAssetOptions: parseAssetOptions
};