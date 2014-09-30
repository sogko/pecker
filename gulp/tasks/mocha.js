'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var config = require('../config');
/**
 * Build and run unit tests
 */
gulp.task('mocha', function () {
  return gulp.src(config.mocha.src, { read: false })
    .pipe(plumber())
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('mocha-watch', function () {

  watch(config.mocha.src, {
    name: 'mocha-changed',
    emitOnGlob: true,
    emit: 'all'
  }, function (files) {
    return files
      .pipe(plumber())
      .pipe(mocha({ reporter: 'spec' }));
  });
  watch(config.mocha.watch, {
    read: false,
    name: 'mocha-all-test-changed'
  }, function () {
    gulp.start('mocha');
  });

});