'use strict';

var gulp = require('gulp');

// load tasks from ./gulp/tasks/*.js
[
  'jshint',
  'mocha'

].forEach(function (name) {
    require('./gulp/tasks/' + name);
  });

gulp.task('default', ['jshint']);

