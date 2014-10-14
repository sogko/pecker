---
layout: page
title: "Installation"
order: 2
date: 2014-10-08 23:24:43
---

You can choose to install Pecker through one of the following ways (or both, if you want):
 
* as a local NodeJS module within your project directory
* as a command-line interpreter (CLI) program, allowing you to run Pecker from any directory


----

#### To install the Pecker module locally within your project directory

Installing it as a local NodeJS module allows you to interact with Pecker APIs directly in your code.

{% highlight bash %}
$ cd /path/to/your/project
$ npm install pecker # optionally you can add `--save` or `--save-dev`
{% endhighlight %}

---

#### To install the Pecker CLI program

Installing Pecker CLI program allows you to run Pecker from any directory.
It also allows you to quickly initialize your project to start using Pecker easily.

Think of Pecker CLI as a butler, helping you do to perform the menial tasks.
You might not necessarily need him every time, but it might be just nice to have around. 


{% highlight bash %}
$ npm install pecker-cli -g
{% endhighlight %}

---

#### Related pages
* See [Usages]({{ site.baseurl }}/documentation/usages) for ways to use and interact with Pecker APIs.
* See the documentation on using the Pecker CLI.