---
layout: getting-started
title: "What kind of assets are supported?"
order: 3
date: 2014-10-08 23:24:43
---

<div style='text-align:center;'>
<strong>EVERY ONE OF THEM.</strong>
<br/>
<img src="http://i.imgur.com/bzeiiDD.gif"/>
</div>

----

In all seriousness, every kind of assets can be supported and managed using Pecker framework.

In Pecker, any kind of asset can fall into at least one of the following Pecker-defined **asset types**:

* a physical file (i.e. a **file asset**), for eg: JavaScript scripts, CSS/Less/Sass stylesheets
* an entire folder and its content (including sub-folders) (i.e. a **folder asset**)
* a URL referring to an external file asset (i.e. a **URL asset** hosted in a CDN)
* a CommonJS module that can be browserified (i.e.  a **browserify** asset, a special asset type)
* an ordered set of assets (i.e. an asset **package**); can also include another asset package (**nested package**)