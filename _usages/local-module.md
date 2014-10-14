---
layout: default
title: "Local Module"
order: 3
---

### Using Pecker as a local module

Simply install Pecker module and require it in your NodeJS script.

Here's an example on how to use ```Pecker.Builder``` directly

{% highlight javascript %}
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

{% endhighlight %}
Refer to API documentation to explore more in depth.