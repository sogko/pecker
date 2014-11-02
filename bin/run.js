#!/usr/bin/env node

'use strict';

var PECKER_CONFIG_FILENAME = 'pecker.json';
var path = require('path');
var _ = require('lodash');
var figlet = require('figlet');
var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs');
var jf = require('jsonfile');
var Pecker = require('../index');
var Printer = require('./printer');

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
var printer = new Printer(argv);

// default action = 'build'
var action = argv._[0] || 'help';
if (argv.help) {
  action = 'help';
}

// resolve config path
argv.config = path.join(path.resolve(process.cwd(), argv.config), PECKER_CONFIG_FILENAME);

function loadConfigFile(configPath) {

  printer.showMessage('info', 'Loading config file...', configPath);

  // check config file exists
  var config;
  if (!fs.existsSync(configPath)) {
    printer.showMessage('error', 'Config file not found at ' + configPath);
    printer.showMessage('error', 'Run `pecker init` to create pecker.json config file');
    process.exit(1);
  }

  // try to load config file
  try {
    config = jf.readFileSync(configPath);
  } catch (e) {
    printer.showMessage('error', 'Failed to load config file ' + configPath, '(Expected config file to be valid JSON)');
    process.exit(1);
  }
  return config;
}

function promptWriteToFile(obj) {
  function write() {
    jf.writeFileSync(argv.config, obj);
    printer.showMessage('success', 'Config written to', argv.config);
    printer.showMessage('success', 'Run `pecker` to build your assets');
  }

  if (fs.existsSync(argv.config)) {
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Config file already exists, overwrite? (Warning: all existing configurations will be overwritten)',
        default: false
      }
    ], function (answers) {
      if (answers.overwrite === false) {
        printer.showMessage('info', 'Aborted');
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
        message: 'Specify the destination directory for generated asset builds (relative to ' + answers.baseDir + ')',
        default: './dist'
      }
    ], function (answers2) {

      answers = _.assign({}, answers, answers2, {
        assets: []
      });

      printer.showJSON(answers);

      inquirer.prompt([
        {
          type: 'confirm',
          name: 'okay',
          message: 'Looks good to you?',
          default: true
        }
      ], function (answers2) {
        if (answers2.okay === false) {
          printer.showMessage('info', 'Aborted');
          process.exit(0);
        }
        promptWriteToFile(answers);
      });
    });

  });
}

function confirmAssetOptionsAndPromptWrite(config, assetOptions) {

  printer.showJSON(assetOptions);

  inquirer.prompt([
    {
      type: 'confirm',
      name: 'okay',
      message: 'Looks good to you?',
      default: true
    }
  ], function (answers2) {
    if (answers2.okay === false) {
      printer.showMessage('info', 'Aborted');
      process.exit(0);
    }

    if (!_.isArray(config.assets)) {
      config.assets = [];
    }
    config.assets.push(assetOptions);
    promptWriteToFile(config);

  });


}

function repeatablePrompt(options) {

  options.promptOptions.push({
    type: 'confirm',
    name: 'again',
    message: options.repeatAgainMessage,
    default: true
  });

  function prompt() {
    inquirer.prompt(options.promptOptions, function (answers) {
      if (_.isFunction(options.processAnswer)) {
        options.processAnswer(answers);
      }
      if (answers.again) {
        return prompt();
      } else {
        if (_.isFunction(options.complete)) {
          return options.complete();
        }
      }
    });
  }

  function initialPrompt() {
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: options.proceedMessage,
        default: true
      }
    ], function (answers) {
      if (answers.proceed) {
        return prompt();
      } else {
        if (_.isFunction(options.complete)) {
          return options.complete();
        }
      }
    });
  }

  return initialPrompt();

}

function promptAddPackageAsset(config, assetOptions) {

  assetOptions.assetNames = [];

  function complete() {
    confirmAssetOptionsAndPromptWrite(config, assetOptions);
  }

  function prompt() {
    repeatablePrompt({
      proceedMessage: 'Do you want to add an asset to this package?',
      repeatAgainMessage: 'Do you want to add more assets?',
      promptOptions: [
        {
          type: 'input',
          name: 'assetName',
          message: 'Add an asset name'
        }
      ],
      processAnswer: function (answers) {
        answers.assetName = (answers.assetName) ? answers.assetName.trim() : '';
        if (answers.assetName) {
          assetOptions.assetNames.push(answers.assetName);
        }
      },
      complete: function () {
        complete();
      }
    });
  }

  prompt();
}
function promptAddFolderAsset(config, assetOptions) {

  assetOptions.folder = '';
  assetOptions.include = [];
  assetOptions.exclude = [];
  assetOptions.watch = [];

  function complete() {
    confirmAssetOptionsAndPromptWrite(config, assetOptions);
  }

  function promptWatch() {
    repeatablePrompt({
      proceedMessage: 'Do you want to add a watched file path?',
      repeatAgainMessage: 'Do you want to add more watched file paths?',
      promptOptions: [
        {
          type: 'input',
          name: 'watch',
          message: 'Add a path or glob pattern to watched file(s)'
        }
      ],
      processAnswer: function (answers) {
        answers.watch = (answers.watch) ? answers.watch.trim() : '';
        if (answers.watch) {
          assetOptions.watch.push(answers.watch);
        }
      },
      complete: function () {
        complete();
      }
    });
  }

  function promptExclude() {
    repeatablePrompt({
      proceedMessage: 'Do you want to exclude specific file(s)?',
      repeatAgainMessage: 'Do you want to exclude specific more file(s)?',
      promptOptions: [
        {
          type: 'input',
          name: 'exclude',
          message: 'Specify a glob pattern to exclude file(s) (for eg: `**/*.less`)'
        }
      ],
      processAnswer: function (answers) {
        answers.exclude = (answers.exclude) ? answers.exclude.trim() : '';
        if (answers.exclude) {
          assetOptions.exclude.push(answers.exclude);
        }
      },
      complete: function () {
        promptWatch();
      }
    });
  }

  function promptInclude() {
    repeatablePrompt({
      proceedMessage: 'Do you want to include specific file(s)?',
      repeatAgainMessage: 'Do you want to include specific more file(s)?',
      promptOptions: [
        {
          type: 'input',
          name: 'include',
          message: 'Specify a glob pattern to include file(s) (for eg: `**/*.less`)'
        }
      ],
      processAnswer: function (answers) {
        answers.include = (answers.include) ? answers.include.trim() : '';
        if (answers.include) {
          assetOptions.include.push(answers.include);
        }
      },
      complete: function () {
        promptExclude();
      }
    });
  }

  function promptFolder() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'folder',
        message: 'Specify folder path (relative to ' + config.baseDir || process.cwd() + ')',
        validate: function (val) {
          val = (val) ? val.trim() : '';
          if (!val) {
            return 'Please enter a valid path';
          }
          return true;
        }
      }
    ], function (answers) {
      assetOptions.folder = answers.folder;
      promptInclude();
    });
  }
  return promptFolder();

}
function promptAddFileAsset(config, assetOptions) {

  assetOptions.files = [];
  assetOptions.transform = [];
  assetOptions.watch = [];

  function complete() {
    confirmAssetOptionsAndPromptWrite(config, assetOptions);
  }

  function promptWatch() {
    repeatablePrompt({
      proceedMessage: 'Do you want to add a watched file path?',
      repeatAgainMessage: 'Do you want to add more watched file paths?',
      promptOptions: [
        {
          type: 'input',
          name: 'watch',
          message: 'Add a path or glob pattern to watched file(s)'
        }
      ],
      processAnswer: function (answers) {
        answers.watch = (answers.watch) ? answers.watch.trim() : '';
        if (answers.watch) {
          assetOptions.watch.push(answers.watch);
        }
      },
      complete: function () {
        complete();
      }
    });
  }

  function promptTransform() {
    repeatablePrompt({
      proceedMessage: 'Do you want to add file transforms?',
      repeatAgainMessage: 'Do you want to add more file transforms?',
      promptOptions: [
        {
          type: 'list',
          name: 'transform',
          message: 'Choose and add a built-in file transform',
          choices: [
            'sass',
            'less',
            'autoprefixer',
            'clean-css',
            'uglify',
            'imagemin',
            'concat'
          ],
          default: 0
        }
      ],
      processAnswer: function (answers) {
        answers.transform = (answers.transform) ? answers.transform.trim() : '';
        if (answers.transform) {
          assetOptions.transform.push(answers.transform);
        }
      },
      complete: function () {
        promptWatch();
      }
    });
  }

  function promptFile() {
    repeatablePrompt({
      proceedMessage: 'Do you want to add files to this asset?',
      repeatAgainMessage: 'Do you want to add more files?',
      promptOptions: [
        {
          type: 'input',
          name: 'file',
          message: 'Add a path or glob pattern to source file(s) for this asset'
        }
      ],
      processAnswer: function (answers) {
        answers.file = (answers.file) ? answers.file.trim() : '';
        if (answers.file) {
          assetOptions.files.push(answers.file);
        }
      },
      complete: function () {
        promptTransform();
      }
    });
  }
  return promptFile();

}

function promptAddAsset() {

  var config = loadConfigFile(argv.config);

  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Specify a unique asset name (for eg: `style.css`)',
      validate: function (val) {
        var assetNames = _.pluck(config.assets, 'name');
        if (!val) {
          return 'Please enter a non-empty name';
        }
        if (assetNames.indexOf(val) >= 0) {
          return 'Please enter a unique name (`' + val + '` already exists)';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'type',
      message: 'Choose asset type',
      choices: [
        'file',
        'folder',
//        'browserify',
        'package'
//        'url'
      ],
      default: 0
    }
  ], function (answers) {
    switch (answers.type) {
      case 'file':
        promptAddFileAsset(config, answers);
        break;
      case 'folder':
        promptAddFolderAsset(config, answers);
        break;
      case 'browserify':
        break;
      case 'package':
        promptAddPackageAsset(config, answers);
        break;
      case 'url':
        break;
    }

  });
}

// perform action
switch (action) {
  case 'help':
    console.log();
    console.log(figlet.textSync('PECKER', {
      font: 'Big',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }));

    console.log('Usage:');
    console.log('  ' + chalk.cyan('pecker') + ' <action> [<args>] [<options>]');
    console.log();

    console.log('Actions:');
    console.log('  add           Interactively add a new asset definition in `pecker.json`.');
    console.log('  build         Build all assets defined in `pecker.json`.');
    console.log('  help          Display help information about Pecker');
    console.log('  init          Interactively create a `pecker.json`.');
    console.log('  watch         Watch all assets defined in `pecker.json` and build on changes');
    console.log();

    yargs.showHelp();
    process.exit(0);
    break;
  case 'init':
    promptInitConfig();
    break;
  case 'watch':
    config = loadConfigFile(argv.config);

    printer.showMessage('info', 'Watching assets...');
    peckerBuilder = new Pecker.Builder(_.assign({}, config, {
      silent: argv.silent
    }));
    peckerBuilder.watchAssets(function (err, results) {
      if (err) {
        printer.showMessage('error', 'Failed to watch assets', results.error);
      } else {
        printer.showMessage('success', 'Started to watch assets');
      }
    });

    break;
  case 'build':
    config = loadConfigFile(argv.config);

    printer.showMessage('info', 'Building assets...');
    peckerBuilder = new Pecker.Builder(_.assign({}, config, {
      silent: argv.silent
    }));
    peckerBuilder.buildAssets(function () {
      printer.showMessage('info', 'Build completed');
    });
    break;
  case 'add':
    promptAddAsset();
    break;
  default:
    printer.showMessage('error', 'Unknown action: ' + action);
    break;
}
