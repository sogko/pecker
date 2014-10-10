# PECKER
Pecker is a modern assets management framework for your web application development.

**Pecker, while functionally working, is currently still under heavy development.**

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

## What is an asset?
Assets include all types of content that you want to make available on your web page, such as images, audio, scripts, stylesheets, icons and more.

## Why would I need a framework to manage assets in my web application?

### Easily organize and wrangle a huge collection of a variety of assets with complex dependencies

A web project typically may start with something as simple as the following set of assets:
One HTML file, one stylesheet (.css) file and maybe a couple of images

At this stage of development, it may seems trivial managing your assets.
But as your project gets bigger and complex, you might find yourself trying to juggle a huge number of assets.

Things might start to feel that its getting out of hand but with a little elbow grease, you probably might be able to devise the most ingenious folder structure. But how about when those assets starts to have complex dependencies among itselves? 

Here's a typical scenario for a medium-sized project:

Your client-side JavaScript application file requires a **custom vendor** code, that depends on multiple **Bower**-managed component, along with several **external scripts** hosted on different **CDN networks**. Let's not get started on **stylesheets and images** that needed to be included.
Oh, have we mentioned that the **dependency order** mattered too. Also, let's not forget about having to need to refer to the URL path to your **HTML templates**  within your application on the client-side.

Phew.

We both know that this could easily happen to you. Because it happened to you before.

**Pecker framework helps you keep your sanity levels in check with ways to organize your assets in a logical manner.**


### Ability to easily apply pre- and post-processing transformation to assets
There's a high chance that you are already dealing with an automated build workflow for your project using Grunt, Gulp or [insert latest and kewlest build tool here]. 

A typical web development scenario would involve the following:
* Pre-process dynamic stylesheet files (LessCSS, SASS etc) into CSS stylesheets files.
* Auto-prefix vendor-specific prefixes to CSS rules.
* Optimize your CSS stylesheet for improved performance through minification.
* Optimize your JavaScript files for improved performances through minification and name-mangling.
* Bundling your Javascript files for use in browsers using Browserify
* And much more!

In short, there is no shortage of use-cases for processing your assets before serving them up in your web applications.

**Pecker framework provides various mechanisms to handle pre- and post-processing for different types of assets to fit your project.**

### Overcoming hurdles with browser-caching and versioning issues
Have you been in a similar situation where you make modifications to, for example a CSS stylesheet, for a web application you're developing, but no matter how many times you refresh the browser, the changes refuse to show up? 

Out of desperation, you manually clear your browser cache and re-launch it. Well, after one too many times, you can see how frustrating it is and how it hinders your productivity.

Browser caching are godsend for visitors using your web application (faster response time and all that), but as a developer, you'd probably had yourself convinced at one point of time that it was forged by the Devil himself just to make your application development a living hell.

Try googling [cache busting](https://www.google.com.sg/#q=cache+busting), and it will show you a plethora of ways to deal with aggressive browser cache.

**Pecker framework has built-in mechanisms for cache-busting with added advantage of versioning 
your assets as well**


### Bridging a gap between server and client-side code, making assets available on both ends
A simple scenario for this would be HTML templates for your web application. Sometimes you find yourself needing to refer to a template file on both the front-end and the back-end code. Well, what's the problem?

The issue here is that depending on where you are and what you need, you might be looking for either 

* the **file path** to the asset on the server's file system, for eg: ```/opt/apps/server/static/templates/view.hbs```
* the **URL path** of the asset relative to the base root URL, for eg: ```/assets/templates/view.hbs```

**Pecker framework bridges the gap between server and client-side code by making available full-featured APIs for both side that you can use to work with your assets, not against it.**


## What kind of assets are supported?
<div style='text-align:center;'>
<strong>EVERY ONE OF THEM.</strong>
<br/>
<img src="http://i.imgur.com/bzeiiDD.gif"/>
</div>

In all seriousness, every kind of assets are supported and can be managed using Pecker framework.

In Pecker, any kind of asset can fall into at least one of the following Pecker-defined **asset types**:

* any kind of physical file (i.e. a **file asset**), for eg: JavaScript scripts, CSS/Less/Sass stylesheets
* an entire folder and its content (including sub-folders) (i.e. a **folder asset**)
* a URL referring to an external file asset (i.e. a **URL asset** hosted in a CDN)
* a CommonJS module that can be browserified (i.e.  a **browserify** asset, a special asset type)
* an ordered set of assets (i.e. an asset **package**); can also include another asset package (**nested package**)

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

## Contributing to Pecker development
### Issues, enhancement and pull requests are welcome!
We welcome contributions of any kind to the project =) (Just be kind)

### Workflow
* We strongly encourage TDD/BDD workflows and would be happy if PRs (pull requests) come with accompanying tests.
* This project uses Gulp for its build workflow.
* To start developing,
	* Fork and close project.
	* ```npm install```
	* ```bower install```
	* ```npm test```
	* Work on something
	* ???
	* Profit!	
* Ensure that the project pass the following before submitting a PR:
	* JSHint: ```gulp jshint```
	* Tests: ```npm test```

----
## Known Issues
### `node-sass` transform fails if file contains `@import` directives
Since the transform works on buffered content of files, ```node-sass``` needs to know of the path(s) of the imported files.
Solution: simply specify the ``importPaths``` option to ```node-sass```.

Example:

```
// your-pecker-config-file.js
var options = module.exports = {
  ...
  assets: [
    {
      type: 'file',
      name: 'style.css',
      files: [ 'src/css/style.css' ],
      transform: [
        {
          fn: 'node-sass',
          args: {
            includePaths: ['/path/to/src/css/']            
          }
        }
      ]
    },
}
```

----


## TODO
* Built-in transforms
	* image minifier
* Additional asset types
	* images (? should we simply stick with having a generic `file` type) 
	* textual content (?)
	* internationalization / localization (?)
* In-line assets
	* Create an inline content for existing asset.
	* For eg: inlined images, inlined scripts, inlined stylesheets
	* Why would you want to inline? Reduce number of HTTP requests.
* Pre-fetch assets using ```<link rel="prefetch" ... />``` supported in HTML5
* Show an example of using Pecker.Assets and a static file server to always serve the latest version of an asset. (For eg: accessing ```/static/style.css``` will serve ```/static/style.9d29jd.css```)

