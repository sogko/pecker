---
layout: landing
title: "A modern assets management framework for your web application development"

---

## PECKER
Pecker is a modern assets management framework for your web application development.

**Pecker, while functionally working, is currently still under heavy development.**

**APIs may change / break before v.1.0.0 release**

*In the meantime, contributions are greatly welcomed*

----

### Features
* Assets watcher
* Mechanisms to pre- and post-processed assets
* Fine-grained control for triggering per-file builds
* Cache-buster
* Versioning through content-hashing
* Automatically resolve URL and absolute file path to latest version of asset
* Helpers to include assets (stylesheets, scripts) in views
* Full-featured APIs for both server-side and client-side scripts
* And much more!

----

### Work well with latest web technologies
* Browserify for your CommonJS modules. (AMD too, with [a little help](https://github.com/jaredhanson/deamdify))
* NPM and Bower; modern package managers for both your server and client-side code respectively.
* Pick and choose your build tools: Grunt, Gulp, even Broccoli. Let Pecker handle assets management and be part of your build workflow.


----

### Quickstart
The easiest and quickest way to start using Pecker is through the CLI by installing it as a global module

```bash
$ npm install pecker-cli -g # install Pecker CLI
$ cd path/to/your/project	# navigate to your project
$ pecker init 			    # initialize configuration file using the interactive CLI
$ pecker					# run build
```

----

#### Congratulations! You have just configured your project and build your assets!
Continue reading the documentation to explore more ways to leverage Pecker in your web application development.
