'use strict';
var path = require('path');

module.exports = {
  name: 'e2e-test',
  silent: true,
  baseDir: path.join(__dirname, '../support'),
  baseUrl: 'dist/',
  destDir: '../e2e/dist',
  skip: [],
  assets: [
    {
      type: 'package',
      name: 'mainAssets',
      assetNames: [
        'vendor/bootstrap/css/bootstrap.css',
        'vendor/bootstrap/css/bootstrap-theme.css',
        'vendor/bootstrap/fonts/glyphicons-halflings-regular.eot',
        'site.css',
        'app.css',
        'bundle.js'
      ]
    },
    {
      type: 'file',
      name: 'site.css',
      files: [
        'src/css/sass-site.scss'
      ],
      transform: [
        {
          fn: 'node-sass',
          args: {
            includePaths: [path.join(__dirname, '../support/src/css')]
          }
        },
        'autoprefixer',
        'clean-css'
      ]
    },
    {
      type: 'file',
      name: 'app.css',
      files: [
        'src/css/app.css'
      ],
      transform: [
        'autoprefixer',
        'clean-css'
      ]
    },
    {
      type: 'folder',
      name: 'vendor',
      folder: './src/vendor/',
      include: ['*.*'],
      exclude: [],
      transform: []
    },
    {
      type: 'browserify',
      name: 'bundle.js',
      require: [
        { type: 'bower', name: 'bootstrap' },
        { type: 'bower', name: 'angular', location: '../../bower_components/angular/angular.min.js'},
        { type: 'npm', name: 'lodash' },
        { type: 'npm', name: 'path' },
        { type: 'module', name: 'date', location: './src/js/simple-date.js' },
        { type: 'module', name: 'simple-log', expose: 'my-simple-logger', location: './src/js/simple-log.js' }
      ]
    },
    {
      type: 'browserify',
      name: 'bar.js',
      entries: ['src/js/bar.js'],
      watch: [],
      external: [
        'bundle.js'
      ],
      transform: []
    },
    {
      type: 'browserify',
      name: 'foo.js',
      entries: ['src/js/foo.js'],
      watch: [],
      external: [
        'bundle.js'
      ],
      transform: []
    }


  ]



};