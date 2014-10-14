---
layout: default
title: "Gulp Task"
order: 4
---

### Using Pecker as a Gulp task
Using Pecker in your Gulp build workflow is as simple as using the Pecker module directly in your ```gulpfile.js``` and defining a gulp task.


{% highlight javascript %}
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
{% endhighlight %}

Refer to API documentation to explore more in depth.