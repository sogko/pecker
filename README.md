# PECKER
Pecker is a modern assets management framework for your web application development.

**Pecker is currently still under heavy development.**

**APIs may change / break before v.1.0.0 release**


*In the meantime, contributions are greatly welcomed*

## Features
* Assets watcher
* Mechanisms to pre- and post-processed assets
* Fine-grained control for triggering per-file builds
* Cache-buster
* Versioning through content-hashing
* Automatically resolve URL and absolute file path to latest version of asset
* Helpers to include assets (stylesheets, scripts) in views
* Full-featured APIs for both server-side and client-side scripts

## Work well with latest web technologies
* Browserify for your CommonJS modules. (AMD too, with [a little help](https://github.com/jaredhanson/deamdify))
* NPM and Bower; modern package managers for both your server and client-side code respectively.
* Pick and choose your build tools: Grunt, Gulp, even Broccoli. Let Pecker handle assets management and be part of your build workflow.

## Quickstart
The easiest and quickest way to start using Pecker is through the CLI by installing it as a global module

```
npm install pecker -g 	// install globally for CLI
cd path/to/your/project	// navigate to your project
pecker init 			// initialize configuration file
pecker					// run build
```

### Congratulations! You have just configured your project and build your assets!
Continue reading the documentation to explore more ways to leverage Pecker in your web application development.

-----
## Installation
You can choose to install Pecker using ```npm``` as either a global or local NodeJS module, or both!

To install it globally

```
npm install pecker -g
```

To install it locally within your project directory:

```
cd /path/to/your/project
npm install pecker

```

## Usages
Besides using the Pecker CLI program, there are many ways to use Pecker for your project.

* as a CLI program
* as a local NodeJS module
* as a Gulp task for your build workflow
* as a client-side script

### Using Pecker as a command-line program
* need to install as a global module
* can run Pecker CLI as ```pecker```

### Using Pecker as a local module

Simply install Pecker module and require it in your NodeJS script.

Here's an example on how to use ```Pecker.Builder``` directly

```
var Pecker = require('pecker');

// define Pecker.Builder options
var opts = { /*...*/ };
// or require an external .js or .json file containing configured options
// for eg: var opts = require('./pecker.json');

// create Pecker.Builder instance
var builder = new Pecker.Builder(opts);

// run build
builder.buildAssets(function () {
	console.log('Build completed');
);

```
Refer to API documentation to explore more in depth.

### Using Pecker as a Gulp task
Using Pecker in your Gulp build workflow is as simple as using the Pecker module directly in your ```gulpfile.js``` and defining a gulp task.

```
// gulpfile.js

var gulp = require('gulp');
var Pecker = require('pecker');

// define gulp task using Pecker.Builder
gulp.task('build', function (done) {

	// define Pecker.Builder options
	var opts = { /*...*/ };
	// or require an external .js or .json file containing configured options
	// for eg: var opts = require('./pecker.json');

	// create Pecker.Builder instance
	var builder = new Pecker.Builder(opts);

	// build assets defined in `opts`
	builder.buildAssets(function () {
		console.log('Build completed');
		done();
	}); 
);
```

Refer to API documentation to explore more in depth.

### Using Pecker as client-side script in browser
When you run Pecker.Builder.buildAssets(), the following assets will be build automatically as well:

```
// manifest.json
{
	...
    Pecker": {
      "type": "package",
      "names": [
        "pecker.js",
        "pecker-loader.js"
      ]
    },
    "pecker.js": {
      "type": "browserify",
      "url": "<url_to_pecker.js>",
      "path": "<path_to_pecker.js>"
    },
    "pecker-loader.js": {
      "type": "file",
      "url": "<url_to_pecker-loader.js>",
      "path": "<path_to_pecker-loader.js>"
    }
}

```
* ```Pecker``` package asset 
* ```pecker.js``` file asset
* ```pecker-loader.js``` file asset

To load Pecker as a client-side script in browser, use the Pecker.Assets.constructAssetHTML() include Pecker script and its loader.

```

var fs = require('fs');
var Pecker = require('pecker');

// load generated manifest.json after building assets
var manifest = fs.readFileSync('.,/path/to/manifest.json');

var peckerAssets = new Pecker.Assets(manifest);
var scriptsHTML = peckerAssets.constructAssetHTML('Pecker');
// for eg:
// <script src="dist/pecker.34441db2759b83d7a0dba5eb2cef468e.js"></script>
// <script src="dist/pecker-loader.2b9d844c90c9fc3b4f2dcc4bdedd4714.js"></script>
// add `scriptsHTML` into your view / template
```

Refer to API documentation to explore more in depth.

## Tests
To run tests

```
git clone https://github.com/sogko/pecker.git
cd pecker
npm install
npm test
```

----
## Known Issues
### `node-sass` transform fails if file contains `@import` directives
Since the transform works on buffered content of files, ```node-sass``` needs to know of the path(s) of the imported files.
Solution: simply specify the ``includePaths``` option to ```node-sass```.

Example:

```
// your-pecker-config-file.js
var options = module.exports = {
  ...
  assets: [
    {
      type: 'file',
      name: 'style.css',
      files: [ './src/css/style.css' ],
      transform: [
        {
          fn: 'node-sass',
          args: {
            includePaths: [
            '/absolute/path/to/src/css/',
            './relative/path/to/baseDir/'
            ]            
          }
        }
      ]
    },
}
```

### `folder` asset sometimes generate a new hash even though no files has been changed in the folder
The content hash for a `folder` asset is calculated by hashing the content of all of the folder and its sub-folders files.
The order of the files being hashed matters. For example, hash for files (A, B, C) is different for files (B, A, C), even though the content may be the same.

The current mechanism behind traversing the folder and retrieving its files unfortunately can't guarantee the order of the files 100% of the time.

This issue causes Pecker to re-create a duplicate physical asset.

Nonetheless, not to worry since Pecker knows which latest `folder` asset to reference.

You can do `pecker prune` to clear out duplicate and old physical assets.

----


## TODO
* Pecker config
    * would it be useful to have a `description` field for each asset?
    * ~~`skipHash`~~
    * Change default to always skipHash: true? Not sure which is better.    
    * each asset may have a different destDir and url?
    * build dependencies: allow an asset to be build after building anotherr asset
    	* use-case: compile .scss files, compile .less files, concat and minify both
* Additional asset types
	* images (? should we simply stick with having a generic `file` type)
	    * we can do image resize or generate different dimensions from a single source image
	* textual content (?)
	* internationalization / localization (?)
	* a `bower` type?
	    * its an extension to `folder` and `package` type
	    * only copy files defined in `bower.json -> asset -> main`
	    * `main` can be overidden
	    * when asset name is referenced in a package, expand to its main
	* does it make sense to extend this to `npm`?
	    * if you want to include npm module, can use browserify.
	    * and usually npm modules that can work in browser, would have a bower registry entry anyway
	* how about `component`?
	* support `duo` (similar fashion to `browserify`)
* Pecker CLI
    * ~~default to `help`~~
    * Add new actions
        * `clean`
        * `prune`
        * ~~`add`~~
        * `remove`
    * ~~`destDir` is relative to `baseDir`~~
* Pecker.Builder
    * watchAssets(): use default if opt.watch is not defined
    * watchAssets to emit events or accept event hooks
* Pecker.Assets
    * How to expose asset data to SASS files? (These are non-JavaScript)
    	* For other .scss files, @import as usual, use `includePaths` to let `sass` find it .
    	* For urls (fonts/images), currently ew can hardcode it. but find a solution to get the right url?
    * Client-side: Make Pecker available in `window`, and maybe through angular
    * In-line assets
	* Create an inline content for existing asset.
	* For eg: inlined images, inlined scripts, inlined stylesheets
	* Why would you want to inline? Reduce number of HTTP requests
	* Pre-fetch assets using ```<link rel="prefetch" ... />``` supported in HTML5
* Built-in transforms
	* ~~image minifier (using gulp-imagemin)~~
	* sourcemaps (using gulp-sourcemaps)
	* ~~LESS-CSS~~
	* ~~pass in peckerOptions and assetOptions to built-in transform~~
	* ~~automatically resolve path-related arguments for built-in transforms~~
* Tutorials
    * Show an example of using Pecker.Assets and a static file server to always serve the latest version of an asset. (For eg: accessing ```/static/style.css``` will serve ```/static/style.9d29jd.css```)
    * Use Pecker.Assets in Jekyll
