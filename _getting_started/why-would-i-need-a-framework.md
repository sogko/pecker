---
layout: getting-started
title: "Why would I need a framework?"
order: 4
date: 2014-10-08 23:24:43
---


### Wrangle a variety of assets with complex dependencies easily

A web project typically may start with something as simple as the following set of assets:

* One HTML file
* One stylesheet (.css) file
* Maybe a couple of images

At this stage of development, it may seems trivial managing your assets.
But as your project gets bigger and complex, you might find yourself trying to juggle a huge number of assets.

Things might start to feel that its getting out of hand but with a little elbow grease, you probably might be able to devise the most ingenious folder structure.

But how about when those assets start to have complex dependencies among itselves? 

Here's a typical scenario for a medium-sized project:


> Your client-side JavaScript application file requires a **custom vendor** code, that depends on multiple **Bower**-managed component, along with several **external scripts** hosted on different **CDN networks**. Let's not get started on **stylesheets and images** that needed to be included.
> Oh, have we mentioned that the **dependency order** mattered too. Also, let's not forget about having to need to refer to the URL path to your **HTML templates**  within your application on the client-side.

Phew.

We both know that this could easily happen to 

you. Because it happened to you before.

**Pecker framework helps you keep your sanity levels in check with ways to organize your assets in a logical manner.**


### Pre- and post-processing transformation to assets
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
your assets as well.**


### Bridging a gap between server and client-side code, making assets available on both ends
A simple scenario for this would be HTML templates for your web application. Sometimes you find yourself needing to refer to a template file on both the front-end and the back-end code. Well, what's the problem?

The issue here is that depending on where you are and what you need, you might be looking for either 

* the **file path** to the asset on the server's file system, for eg: ```/opt/apps/server/static/templates/view.hbs```
* the **URL path** of the asset relative to the base root URL, for eg: ```/assets/templates/view.hbs```

**Pecker framework bridges the gap between server and client-side code by making available full-featured APIs for both side that you can use to work with your assets, not against it.**
