#!/usr/bin/env node

'use strict';

var PECKER_CONFIG_FILENAME = 'pecker.json';
var path = require('path');
var _ = require('lodash');
var chalk = require('chalk');
var inquirer = require('inquirer');
var gutil = require('gulp-util');
var fs = require('fs');
var jf = require('jsonfile');
var Pecker = require('../index');

var yargs = require('yargs')
  .options('c', {
    alias: 'config',
    describe: 'Path to Pecker config file',
    default: process.cwd()
  })
  .boolean('s')
  .options('s', {
    alias: 'silent',
    describe: 'Suppress all log messages (including error messages)',
    default: false
  });

var argv = yargs.argv;
var peckerBuilder;
var config;

// default action = 'build'
var action = argv._[0] || 'build';
if (argv.help) {
  action = 'help';
}

// resolve config path
argv.config = path.join(path.resolve(process.cwd(), argv.config), PECKER_CONFIG_FILENAME);

function showMessage(type) {
  if (argv.silent) {
    return;
  }
  var message = Array.prototype.slice.call(arguments, 1);
  var color;
  switch (type) {
    case 'error':
      color = chalk.yellow;
      break;
    case 'success':
      color = chalk.green;
      break;
    case 'info':
      color = chalk.cyan;
      break;
    default:
      color = function (a) {
        return a;
      };
  }
  gutil.log(color(message[0] || ''), message.slice(1).join(' '));
}

function loadConfigFile(configPath) {

  showMessage('info', 'Loading config file...', configPath);

  // check config file exists
  var config;
  if (!fs.existsSync(configPath)) {
    showMessage('error', 'Config file not found at ' + configPath);
    showMessage('error', 'Run `pecker init` to create pecker.json config file');
    process.exit(1);
  }

  // try to load config file
  try {
    config = jf.readFileSync(configPath);
  } catch (e) {
    showMessage('error', 'Failed to load config file ' + configPath, '(Expected config file to be valid JSON)');
    process.exit(1);
  }
  return config;
}

function promptWriteToFile(obj) {
  function write() {
    jf.writeFileSync(argv.config, obj);
    showMessage('success', 'Config written to', argv.config);
    showMessage('success', 'Run `pecker` to build your assets');
  }
  if (fs.existsSync(argv.config)) {
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Config file already exists, overwrite? (Warning: all existing configurations will be destroyed)',
        default: false
      }
    ], function (answers) {
      if (answers.overwrite === false) {
        showMessage('info', 'Aborted');
        process.exit(0);
      }
      write();
    });
  } else {
    write();
  }
}
function promptInitConfig() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      default: path.basename(process.cwd())
    },
    {
      type: 'input',
      name: 'baseDir',
      message: 'Specify the base directory for all relative paths in the configuration',
      default: process.cwd()
    },
    {
      type: 'input',
      name: 'baseUrl',
      message: 'Specify the base URL for assets',
      default: '/static'
    }
  ], function (answers) {

    inquirer.prompt([
      {
        type: 'input',
        name: 'destDir',
        message: 'Specify the destination directory for generated asset builds',
        default: path.join(answers.baseDir, 'dist')
      }
    ], function (answers2) {

      answers = _.assign({}, answers, answers2, {
        assets: []
      });

      console.log(JSON.stringify(answers, null, '  '));

      inquirer.prompt([
        {
          type: 'confirm',
          name: 'okay',
          message: 'Looks good to you?',
          default: true
        }
      ], function (answers2) {
        if (answers2.okay === false) {
          showMessage('info', 'Aborted');
          process.exit(0);
        }
        promptWriteToFile(answers);
      });
    });

  });
}

// perform action
switch (action) {
  case 'help':
    yargs.showHelp();
    process.exit(0);
    break;
  case 'init':
    promptInitConfig();
    break;
  case 'watch':
    config = loadConfigFile(argv.config);

    showMessage('info', 'Watching assets...');
    peckerBuilder = new Pecker.Builder(_.assign({}, config, {
      silent: argv.silent
    }));
    peckerBuilder.watchAssets(function (err, results) {
      if (err) {
        showMessage('error', 'Failed to watch assets', results.error);
      } else {
        showMessage('success', 'Started to watch assets');
      }
    });

    break;
  case 'build':
    config = loadConfigFile(argv.config);

    showMessage('info', 'Building assets...');
    peckerBuilder = new Pecker.Builder(_.assign({}, config, {
      silent: argv.silent
    }));
    peckerBuilder.buildAssets(function () {
      showMessage('info', 'Build completed');
    });
    break;
  default:
    showMessage('error', 'Unknown command: ' + action);
    break;
}
