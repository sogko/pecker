'use strict';

var path = require('path');

function getAssetBaseName(name) {
  var tokens = path.normalize(name).split('/');
  if (!tokens || tokens.length === 0) {
    return '';
  }
  return tokens[0];
}
function getAssetPath(name) {
  var tokens = path.normalize(name).split('/');
  if (!tokens) {
    return '';
  }
  if (tokens.length > 1) {
    return tokens.slice(1).join('/');
  }
  return '';
}

/**
 * Pecker.Assets class
 * @constructor
 * @param {Object} manifest Pecker.Manifest content
 */
function Assets(manifest) {
  this.content = manifest;
}

/**
 * Returns asset metadata of the given name.
 * Returns null if asset does not exist.
 * @param name
 * @returns Object|null
 */
Assets.prototype.getAsset = function (name) {
  if (!name) {
    return null;
  }
  var baseName = getAssetBaseName(name);
  if (!this.content.assets || !baseName) {
    return null;
  }
  return this.content.assets[baseName] || null;
};

/**
 *
 * @param name
 * @returns {*|null}
 */
Assets.prototype.getFilePath = function (name) {
  return this.getFilePaths(name)[0] || null;
};

Assets.prototype.getFilePaths = function (name) {
  var filePaths = [];

  var asset = this.getAsset(name);
  if (!asset || !asset.type) {
    return filePaths;
  }

  switch (asset.type) {
    case 'file':
    case 'browserify':
    case 'url':
      if (asset.path) {
        filePaths.push(asset.path);
      }
      break;
    case 'folder':
      if (!asset.path) {
        break;
      }
      var assetPath = getAssetPath(name);
      if (assetPath) {
        filePaths.push(path.join(asset.path, assetPath));
      } else {
        filePaths.push(asset.path);
      }
      break;
    case 'package':
      if (!asset.names) {
        break;
      }
      // just a note: at this point, nested packages should already has been resolved in optionsParser.
      // that'll teach you to touch my privates.
      for (var i = 0; i < asset.names.length; i++) {
        var packageFilePaths = this.getFilePaths(asset.names[i]);
        for (var k = 0; k < packageFilePaths.length; k++) {
          filePaths.push(packageFilePaths[k]);
        }
      }
      break;
  }
  return filePaths;
};

Assets.prototype.getUrl = function (name) {
  return this.getUrls(name)[0] || null;
};

Assets.prototype.getUrls = function (name) {

  var urls = [];

  if (name === '' || name === '/') {
    urls.push(this.content.baseUrl);
    return urls;
  }

  var asset = this.getAsset(name);
  if (!asset || !asset.type) {
    return urls;
  }

  switch (asset.type) {
    case 'file':
    case 'browserify':
    case 'url':
      if (asset.url) {
        urls.push(asset.url);
      }
      break;
    case 'folder':
      if (!asset.url) {
        break;
      }
      var assetPath = getAssetPath(name);
      if (assetPath) {
        urls.push(path.join(asset.url, assetPath));
      } else {
        urls.push(asset.url);
      }
      break;
    case 'package':
      if (!asset.names) {
        break;
      }
      // just a note: at this point, nested packages should already has been resolved in optionsParser.
      // that'll teach you to touch my privates.
      for (var i = 0; i < asset.names.length; i++) {
        var packageUrls = this.getUrls(asset.names[i]);
        for (var k = 0; k < packageUrls.length; k++) {
          urls.push(packageUrls[k]);
        }
      }
      break;
  }
  return urls;
};

Assets.prototype.getGroupedUrls = function (name, _options) {

  var options = _options || {};
  options.groups = options.groups || {};

  var groups = {
    stylesheet: ['.css'],
    javascript: ['.js', '.json']
  };
  for (var groupName in options.groups) {
    if (!options.groups.hasOwnProperty(groupName)) {
      continue;
    }
    groups[groupName] = options.groups[groupName];
  }

  var urls = this.getUrls(name, options);
  var groupedUrls = {
    baseUrl: this.content.baseUrl,
    others: []
  };
  for (groupName in groups) {
    if (!groups.hasOwnProperty(groupName)) {
      continue;
    }
    groupedUrls[groupName] = [];
  }

  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    var ext = path.extname(url).toLowerCase();

    var hasMembership = false;
    for (groupName in groups) {
      if (!groups.hasOwnProperty(groupName)) {
        continue;
      }
      var exts = groups[groupName];
      if (!Array.isArray(exts)) {
        exts = [exts];
      }
      if (exts.indexOf(ext) >= 0) {
        if (!groupedUrls[groupName]) {
          groupedUrls[groupName] = [];
        }
        groupedUrls[groupName].push(url);
        hasMembership = true;
      }
    }
    if (!hasMembership) {
      groupedUrls.others.push(url);
    }
  }
  return groupedUrls;
};

Assets.prototype.constructPeckerLoaderHTML = function () {
  var Pecker = {
    __data: {
      manifest: this.content
    },
    Assets: null
  };
  return [
    '<script src="', this.getUrl('helper.js'), '"></script>\n',
    '<script>\n',
    'var Pecker = ', JSON.stringify(Pecker), '; \n',
    'require("Pecker.Assets");\n',
    '</script>\n'
  ].join('');
};

/**
 * Constructs a HTML string representation to include the given asset and its dependencies in an HTML page
 * @param {string} name Asset name
 * @param {Object|undefined}
 * @param {string} options.type Filter out the type of asset, accepted values 'link' | 'script'
 * @returns {string}
 */
Assets.prototype.constructAssetHTML = function (name, options) {
  options = options || {};

  var res = {
    links: [],
    scripts: []
  };

  var asset = this.getAsset(name);
  if (!asset) {
    return '';
  }

  var groupedUrls = this.getGroupedUrls(name, {
    groups: options.groups
  });
  for (var i = 0; i < groupedUrls.stylesheet.length; i++) {
    res.links.push(['<link rel="stylesheet" href="', groupedUrls.stylesheet[i], '"/>'].join(''));
  }
  for (i = 0; i < groupedUrls.javascript.length; i++) {
    res.scripts.push(['<script src="', groupedUrls.javascript[i], '"></script>'].join(''));
  }

  if (options.type === 'link') {
    return [res.links.join('\n')].join('\n');
  } else if (options.type === 'script') {
    return [res.scripts.join('\n')].join('\n');
  }
  if (res.links.length > 0 && res.scripts.length > 0) {
    return [res.links.join('\n'), res.scripts.join('\n')].join('\n');
  } else if (res.links.length > 0) {
    return res.links.join('\n');
  } else if (res.scripts.length > 0) {
    return res.scripts.join('\n');
  }
};

module.exports = Assets;