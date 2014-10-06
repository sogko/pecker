# PECKER
Pecker is a modern assets management framework for your web application development.

**Pecker, while functionally working, is currently still under heavy development. APIs may change / break before v.1.0.0 release**

*In the meantime, contributions are greatly welcomed*

## Features
* Assets watcher
* Fine-grained control for triggering per-file builds
* Cache-buster
* Versioning through content-hashing
* Automatically resolve URL and absolute file path to latest version of asset
* Helpers to include assets (stylesheets, scripts) in views
* Full-featured APIs for both server-side and client-side scripts

## Quickstart
The easiest and quickest way to start using Pecker is through the CLI by installing it as a global module

```
npm install pecker -g 	// install globally for CLI
cd path/to/your/project	// navigate to your project
pecker init 				// initialize configuration file
pecker					// run build
```

### Congratulations! You have just configured your project and build your assets!
Continue reading the documentation to explore more ways to leverage Pecker to your advantage in your web application development.


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
* This project uses Gulp for its build workflow
* Ensure that the project pass the following before submitting a PR:
	* JSHint: ```gulp jshint```
	* Tests: ```npm test```


