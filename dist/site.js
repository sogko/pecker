require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"blocks/buttons/collapsible-menu-button/collapsible-menu-button":[function(require,module,exports){
'use strict';

var log = require('loglevel');

log.debug('collapsible-menu-button.js');

function Button(name, opts) {
  this.name = name;
  this.opts = opts;
}
Button.prototype.click = function () {
  log.debug('button', this.name, 'clicked!', this);
};

module.exports = Button;


},{"loglevel":"loglevel"}],"common/block":[function(require,module,exports){
'use strict';

var PATH_SEP = '/';
var log = require('loglevel');
var $ = require('jquery');

function Block($block) {
  if (!$block instanceof $) {
    $block = $($block);
  }
  this.$block = $block;
  this.name = $block.data('block-name') || '';
  this.type = $block.data('block-type') || '';
}

function executeRunnableBlock(ctx) {
  var runnable;

  // `require` strategy
  // - try to load [namespace/]name/index first
  // - if fails, try [namespace/]name/name
  // - else, fails
  try {
    log.trace('try 1', [ctx.name].join(PATH_SEP));
    runnable = require([ctx.name].join(PATH_SEP));
  } catch (e) {
    try {
      log.trace('try 2', [ctx.name, 'index'].join(PATH_SEP));
      runnable = require([ctx.name, 'index'].join(PATH_SEP));
    } catch (e) {
      try {
        var name =  ctx.name.split(PATH_SEP)[ctx.name.split(PATH_SEP).length - 1];
        log.trace('try 3', [ctx.name, name].join(PATH_SEP));
        runnable = require([ctx.name, name].join(PATH_SEP));
      } catch (e) {
        log.error('Unable to load script for block "' + ctx.name + '"');
      }
    }
  }

  // `this` would point to `window` in browser environment, else undefined
  // first arg would be $block context
  runnable.call(window, ctx.$block);
}

Block.prototype.init = function () {
  switch (this.type) {
    case 'runnable':
      // automatically execute export function with current block context
      executeRunnableBlock.call(this, this);
      break;
    case 'component':
      // do nothing. component will be required in a runnable block or another component
      break;
  }
};

module.exports = Block;

},{"jquery":"jquery","loglevel":"loglevel"}],"common/path":[function(require,module,exports){
'use strict';

var log = require('loglevel');

module.exports = function () {
  log.debug('path.js');
  return 'VALUE RETURNED FROM PATH';
};
},{"loglevel":"loglevel"}],"common/utils":[function(require,module,exports){
'use strict';

var log = require('loglevel');

module.exports = function () {
  log.debug('utils.js');
  return 'VALUE RETURNED FROM UTILSSSS';
};
},{"loglevel":"loglevel"}],"layouts/default/default":[function(require,module,exports){
'use strict';

var log = require('loglevel');

module.exports = function ($ctx) {
  log.debug('default.js');
};


},{"loglevel":"loglevel"}],"layouts/demo/demo":[function(require,module,exports){
'use strict';

var log = require('loglevel');

module.exports = function ($ctx) {
  log.debug('demo.js (layout)');
};


},{"loglevel":"loglevel"}],"layouts/documentation/documentation":[function(require,module,exports){
'use strict';

var log = require('loglevel');
var Pussshy = require('Pussshy');

module.exports = function ($ctx) {
  log.debug('documentation.js');

  // instantiate off-canvas menu
  $ctx.pussshy = new Pussshy({
    direction: 'left',
    canvasTarget: [
      '.documentation-layout .header',
      '.documentation-layout .content-column',
      '.documentation-layout__sticky-footer'
    ].join(', '),
    menuTarget: '.toc__menu',
    menuItemsTarget: '.toc__menu-items',
    menuButtonTarget: '.toc__menu-button'
  });
};


},{"Pussshy":"Pussshy","loglevel":"loglevel"}],"layouts/page/page":[function(require,module,exports){
'use strict';

var log = require('loglevel');
var Pussshy = require('Pussshy');

module.exports = function ($ctx) {
  log.debug('page.js');

  // instantiate off-canvas menu
  $ctx.pussshy = new Pussshy({
    direction: 'left',
    canvasTarget: [
      '.page-layout .landing-header__menu-button',
      '.page-layout .content',
      '.page-layout__sticky-footer'
    ].join(', '),
    menuTarget: '.nav__menu',
    menuItemsTarget: '.nav__menu-items',
    menuButtonTarget: '.nav__menu-button'
  });

};


},{"Pussshy":"Pussshy","loglevel":"loglevel"}],"pages/blocks/blocks":[function(require,module,exports){
'use strict';

var log = require('loglevel');
var utils = require('common/utils');

module.exports = function () {
  log.debug('block.js');
  log.debug('block.js utils()', utils());
  return 'VALUE RETURNED FROM blockblockblock';

};
},{"common/utils":"common/utils","loglevel":"loglevel"}],"pages/blocks/helper":[function(require,module,exports){
'use strict';

var log = require('loglevel');

module.exports = function () {
  log.debug('helper.js');
  return 'VALUE RETURNED FROM HELPER';
};
},{"loglevel":"loglevel"}],"pages/blocks/index":[function(require,module,exports){
'use strict';

var log = require('loglevel');
var helper = require('pages/blocks/helper');
var blocks = require('pages/blocks/blocks');

module.exports = function ($ctx) {
  log.debug('index.js');
  log.warn('index.js helper', helper());
  log.error('index.js blocks', blocks());

  // fix off-canvas menus
  var tocMenu = $ctx.find('.toc__menu');
  tocMenu.css('position', 'relative');

  var navMenu = $ctx.find('.nav__menu');
  navMenu.css('position', 'relative');
};
},{"loglevel":"loglevel","pages/blocks/blocks":"pages/blocks/blocks","pages/blocks/helper":"pages/blocks/helper"}],"site":[function(require,module,exports){
/**
 * Entry point for site browserified scripts
 */
'use strict';

/*jshint -W079 */
var $ = require('jquery');
var log = require('loglevel');
var Block = require('common/block');

function SiteEngine(options) {

  if (SiteEngine.prototype.__singletonInstance) {
    return SiteEngine.prototype.__singletonInstance;
  }
  SiteEngine.prototype.__singletonInstance = this;

  this.options = options || {};

  this.options.mode = 'development';
  if (this.options.mode === 'development') {
    log.setLevel('debug');
    log.warn('Site in development mode');
  }
}


SiteEngine.prototype.bootstrap = function () {

  // bootstrap jquery to window
  if (typeof window !== 'undefined') {
    window.$ = $;
  }
  log.debug('$', $);

  log.debug('document', document);
  log.debug('t4est');

  // document may not be around

  // initialize blocks when ready
  $(document).ready(function () {

    log.debug('ready! 33');


    // initialize all tagged blocks
    var blocks = $('*[data-block-name]');
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i]) {
        var $block = new Block($(blocks[i]));
        $block.init();
      }
    }

  }.bind(this));
};

var instance = new SiteEngine();
// export SiteEngine instance to window global
if (typeof window !== 'undefined') {
  window.SiteEngine = instance;
}
// export SiteEngine instance for nodejs / browserify
module.exports = instance;


},{"common/block":"common/block","jquery":"jquery","loglevel":"loglevel"}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9wZWNrZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9oYWZpei9kZXYvcGVja2VyLWRvY3Mvc3JjL3NpdGUvYmxvY2tzL2J1dHRvbnMvY29sbGFwc2libGUtbWVudS1idXR0b24vY29sbGFwc2libGUtbWVudS1idXR0b24uanMiLCIvVXNlcnMvaGFmaXovZGV2L3BlY2tlci1kb2NzL3NyYy9zaXRlL2NvbW1vbi9ibG9jay5qcyIsIi9Vc2Vycy9oYWZpei9kZXYvcGVja2VyLWRvY3Mvc3JjL3NpdGUvY29tbW9uL3BhdGguanMiLCIvVXNlcnMvaGFmaXovZGV2L3BlY2tlci1kb2NzL3NyYy9zaXRlL2NvbW1vbi91dGlscy5qcyIsIi9Vc2Vycy9oYWZpei9kZXYvcGVja2VyLWRvY3Mvc3JjL3NpdGUvbGF5b3V0cy9kZWZhdWx0L2RlZmF1bHQuanMiLCIvVXNlcnMvaGFmaXovZGV2L3BlY2tlci1kb2NzL3NyYy9zaXRlL2xheW91dHMvZGVtby9kZW1vLmpzIiwiL1VzZXJzL2hhZml6L2Rldi9wZWNrZXItZG9jcy9zcmMvc2l0ZS9sYXlvdXRzL2RvY3VtZW50YXRpb24vZG9jdW1lbnRhdGlvbi5qcyIsIi9Vc2Vycy9oYWZpei9kZXYvcGVja2VyLWRvY3Mvc3JjL3NpdGUvbGF5b3V0cy9wYWdlL3BhZ2UuanMiLCIvVXNlcnMvaGFmaXovZGV2L3BlY2tlci1kb2NzL3NyYy9zaXRlL3BhZ2VzL2Jsb2Nrcy9ibG9ja3MuanMiLCIvVXNlcnMvaGFmaXovZGV2L3BlY2tlci1kb2NzL3NyYy9zaXRlL3BhZ2VzL2Jsb2Nrcy9oZWxwZXIuanMiLCIvVXNlcnMvaGFmaXovZGV2L3BlY2tlci1kb2NzL3NyYy9zaXRlL3BhZ2VzL2Jsb2Nrcy9pbmRleC5qcyIsIi9Vc2Vycy9oYWZpei9kZXYvcGVja2VyLWRvY3Mvc3JjL3NpdGUvc2l0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbG9nID0gcmVxdWlyZSgnbG9nbGV2ZWwnKTtcblxubG9nLmRlYnVnKCdjb2xsYXBzaWJsZS1tZW51LWJ1dHRvbi5qcycpO1xuXG5mdW5jdGlvbiBCdXR0b24obmFtZSwgb3B0cykge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLm9wdHMgPSBvcHRzO1xufVxuQnV0dG9uLnByb3RvdHlwZS5jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgbG9nLmRlYnVnKCdidXR0b24nLCB0aGlzLm5hbWUsICdjbGlja2VkIScsIHRoaXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCdXR0b247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFBBVEhfU0VQID0gJy8nO1xudmFyIGxvZyA9IHJlcXVpcmUoJ2xvZ2xldmVsJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG5mdW5jdGlvbiBCbG9jaygkYmxvY2spIHtcbiAgaWYgKCEkYmxvY2sgaW5zdGFuY2VvZiAkKSB7XG4gICAgJGJsb2NrID0gJCgkYmxvY2spO1xuICB9XG4gIHRoaXMuJGJsb2NrID0gJGJsb2NrO1xuICB0aGlzLm5hbWUgPSAkYmxvY2suZGF0YSgnYmxvY2stbmFtZScpIHx8ICcnO1xuICB0aGlzLnR5cGUgPSAkYmxvY2suZGF0YSgnYmxvY2stdHlwZScpIHx8ICcnO1xufVxuXG5mdW5jdGlvbiBleGVjdXRlUnVubmFibGVCbG9jayhjdHgpIHtcbiAgdmFyIHJ1bm5hYmxlO1xuXG4gIC8vIGByZXF1aXJlYCBzdHJhdGVneVxuICAvLyAtIHRyeSB0byBsb2FkIFtuYW1lc3BhY2UvXW5hbWUvaW5kZXggZmlyc3RcbiAgLy8gLSBpZiBmYWlscywgdHJ5IFtuYW1lc3BhY2UvXW5hbWUvbmFtZVxuICAvLyAtIGVsc2UsIGZhaWxzXG4gIHRyeSB7XG4gICAgbG9nLnRyYWNlKCd0cnkgMScsIFtjdHgubmFtZV0uam9pbihQQVRIX1NFUCkpO1xuICAgIHJ1bm5hYmxlID0gcmVxdWlyZShbY3R4Lm5hbWVdLmpvaW4oUEFUSF9TRVApKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRyeSB7XG4gICAgICBsb2cudHJhY2UoJ3RyeSAyJywgW2N0eC5uYW1lLCAnaW5kZXgnXS5qb2luKFBBVEhfU0VQKSk7XG4gICAgICBydW5uYWJsZSA9IHJlcXVpcmUoW2N0eC5uYW1lLCAnaW5kZXgnXS5qb2luKFBBVEhfU0VQKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIG5hbWUgPSAgY3R4Lm5hbWUuc3BsaXQoUEFUSF9TRVApW2N0eC5uYW1lLnNwbGl0KFBBVEhfU0VQKS5sZW5ndGggLSAxXTtcbiAgICAgICAgbG9nLnRyYWNlKCd0cnkgMycsIFtjdHgubmFtZSwgbmFtZV0uam9pbihQQVRIX1NFUCkpO1xuICAgICAgICBydW5uYWJsZSA9IHJlcXVpcmUoW2N0eC5uYW1lLCBuYW1lXS5qb2luKFBBVEhfU0VQKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5lcnJvcignVW5hYmxlIHRvIGxvYWQgc2NyaXB0IGZvciBibG9jayBcIicgKyBjdHgubmFtZSArICdcIicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGB0aGlzYCB3b3VsZCBwb2ludCB0byBgd2luZG93YCBpbiBicm93c2VyIGVudmlyb25tZW50LCBlbHNlIHVuZGVmaW5lZFxuICAvLyBmaXJzdCBhcmcgd291bGQgYmUgJGJsb2NrIGNvbnRleHRcbiAgcnVubmFibGUuY2FsbCh3aW5kb3csIGN0eC4kYmxvY2spO1xufVxuXG5CbG9jay5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICBjYXNlICdydW5uYWJsZSc6XG4gICAgICAvLyBhdXRvbWF0aWNhbGx5IGV4ZWN1dGUgZXhwb3J0IGZ1bmN0aW9uIHdpdGggY3VycmVudCBibG9jayBjb250ZXh0XG4gICAgICBleGVjdXRlUnVubmFibGVCbG9jay5jYWxsKHRoaXMsIHRoaXMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29tcG9uZW50JzpcbiAgICAgIC8vIGRvIG5vdGhpbmcuIGNvbXBvbmVudCB3aWxsIGJlIHJlcXVpcmVkIGluIGEgcnVubmFibGUgYmxvY2sgb3IgYW5vdGhlciBjb21wb25lbnRcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbG9nID0gcmVxdWlyZSgnbG9nbGV2ZWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIGxvZy5kZWJ1ZygncGF0aC5qcycpO1xuICByZXR1cm4gJ1ZBTFVFIFJFVFVSTkVEIEZST00gUEFUSCc7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGxvZyA9IHJlcXVpcmUoJ2xvZ2xldmVsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBsb2cuZGVidWcoJ3V0aWxzLmpzJyk7XG4gIHJldHVybiAnVkFMVUUgUkVUVVJORUQgRlJPTSBVVElMU1NTUyc7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGxvZyA9IHJlcXVpcmUoJ2xvZ2xldmVsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRjdHgpIHtcbiAgbG9nLmRlYnVnKCdkZWZhdWx0LmpzJyk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBsb2cgPSByZXF1aXJlKCdsb2dsZXZlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkY3R4KSB7XG4gIGxvZy5kZWJ1ZygnZGVtby5qcyAobGF5b3V0KScpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbG9nID0gcmVxdWlyZSgnbG9nbGV2ZWwnKTtcbnZhciBQdXNzc2h5ID0gcmVxdWlyZSgnUHVzc3NoeScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkY3R4KSB7XG4gIGxvZy5kZWJ1ZygnZG9jdW1lbnRhdGlvbi5qcycpO1xuXG4gIC8vIGluc3RhbnRpYXRlIG9mZi1jYW52YXMgbWVudVxuICAkY3R4LnB1c3NzaHkgPSBuZXcgUHVzc3NoeSh7XG4gICAgZGlyZWN0aW9uOiAnbGVmdCcsXG4gICAgY2FudmFzVGFyZ2V0OiBbXG4gICAgICAnLmRvY3VtZW50YXRpb24tbGF5b3V0IC5oZWFkZXInLFxuICAgICAgJy5kb2N1bWVudGF0aW9uLWxheW91dCAuY29udGVudC1jb2x1bW4nLFxuICAgICAgJy5kb2N1bWVudGF0aW9uLWxheW91dF9fc3RpY2t5LWZvb3RlcidcbiAgICBdLmpvaW4oJywgJyksXG4gICAgbWVudVRhcmdldDogJy50b2NfX21lbnUnLFxuICAgIG1lbnVJdGVtc1RhcmdldDogJy50b2NfX21lbnUtaXRlbXMnLFxuICAgIG1lbnVCdXR0b25UYXJnZXQ6ICcudG9jX19tZW51LWJ1dHRvbidcbiAgfSk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBsb2cgPSByZXF1aXJlKCdsb2dsZXZlbCcpO1xudmFyIFB1c3NzaHkgPSByZXF1aXJlKCdQdXNzc2h5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRjdHgpIHtcbiAgbG9nLmRlYnVnKCdwYWdlLmpzJyk7XG5cbiAgLy8gaW5zdGFudGlhdGUgb2ZmLWNhbnZhcyBtZW51XG4gICRjdHgucHVzc3NoeSA9IG5ldyBQdXNzc2h5KHtcbiAgICBkaXJlY3Rpb246ICdsZWZ0JyxcbiAgICBjYW52YXNUYXJnZXQ6IFtcbiAgICAgICcucGFnZS1sYXlvdXQgLmxhbmRpbmctaGVhZGVyX19tZW51LWJ1dHRvbicsXG4gICAgICAnLnBhZ2UtbGF5b3V0IC5jb250ZW50JyxcbiAgICAgICcucGFnZS1sYXlvdXRfX3N0aWNreS1mb290ZXInXG4gICAgXS5qb2luKCcsICcpLFxuICAgIG1lbnVUYXJnZXQ6ICcubmF2X19tZW51JyxcbiAgICBtZW51SXRlbXNUYXJnZXQ6ICcubmF2X19tZW51LWl0ZW1zJyxcbiAgICBtZW51QnV0dG9uVGFyZ2V0OiAnLm5hdl9fbWVudS1idXR0b24nXG4gIH0pO1xuXG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBsb2cgPSByZXF1aXJlKCdsb2dsZXZlbCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnY29tbW9uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBsb2cuZGVidWcoJ2Jsb2NrLmpzJyk7XG4gIGxvZy5kZWJ1ZygnYmxvY2suanMgdXRpbHMoKScsIHV0aWxzKCkpO1xuICByZXR1cm4gJ1ZBTFVFIFJFVFVSTkVEIEZST00gYmxvY2tibG9ja2Jsb2NrJztcblxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBsb2cgPSByZXF1aXJlKCdsb2dsZXZlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgbG9nLmRlYnVnKCdoZWxwZXIuanMnKTtcbiAgcmV0dXJuICdWQUxVRSBSRVRVUk5FRCBGUk9NIEhFTFBFUic7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGxvZyA9IHJlcXVpcmUoJ2xvZ2xldmVsJyk7XG52YXIgaGVscGVyID0gcmVxdWlyZSgncGFnZXMvYmxvY2tzL2hlbHBlcicpO1xudmFyIGJsb2NrcyA9IHJlcXVpcmUoJ3BhZ2VzL2Jsb2Nrcy9ibG9ja3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJGN0eCkge1xuICBsb2cuZGVidWcoJ2luZGV4LmpzJyk7XG4gIGxvZy53YXJuKCdpbmRleC5qcyBoZWxwZXInLCBoZWxwZXIoKSk7XG4gIGxvZy5lcnJvcignaW5kZXguanMgYmxvY2tzJywgYmxvY2tzKCkpO1xuXG4gIC8vIGZpeCBvZmYtY2FudmFzIG1lbnVzXG4gIHZhciB0b2NNZW51ID0gJGN0eC5maW5kKCcudG9jX19tZW51Jyk7XG4gIHRvY01lbnUuY3NzKCdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuXG4gIHZhciBuYXZNZW51ID0gJGN0eC5maW5kKCcubmF2X19tZW51Jyk7XG4gIG5hdk1lbnUuY3NzKCdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xufTsiLCIvKipcbiAqIEVudHJ5IHBvaW50IGZvciBzaXRlIGJyb3dzZXJpZmllZCBzY3JpcHRzXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLypqc2hpbnQgLVcwNzkgKi9cbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgbG9nID0gcmVxdWlyZSgnbG9nbGV2ZWwnKTtcbnZhciBCbG9jayA9IHJlcXVpcmUoJ2NvbW1vbi9ibG9jaycpO1xuXG5mdW5jdGlvbiBTaXRlRW5naW5lKG9wdGlvbnMpIHtcblxuICBpZiAoU2l0ZUVuZ2luZS5wcm90b3R5cGUuX19zaW5nbGV0b25JbnN0YW5jZSkge1xuICAgIHJldHVybiBTaXRlRW5naW5lLnByb3RvdHlwZS5fX3NpbmdsZXRvbkluc3RhbmNlO1xuICB9XG4gIFNpdGVFbmdpbmUucHJvdG90eXBlLl9fc2luZ2xldG9uSW5zdGFuY2UgPSB0aGlzO1xuXG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5vcHRpb25zLm1vZGUgPSAnZGV2ZWxvcG1lbnQnO1xuICBpZiAodGhpcy5vcHRpb25zLm1vZGUgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBsb2cuc2V0TGV2ZWwoJ2RlYnVnJyk7XG4gICAgbG9nLndhcm4oJ1NpdGUgaW4gZGV2ZWxvcG1lbnQgbW9kZScpO1xuICB9XG59XG5cblxuU2l0ZUVuZ2luZS5wcm90b3R5cGUuYm9vdHN0cmFwID0gZnVuY3Rpb24gKCkge1xuXG4gIC8vIGJvb3RzdHJhcCBqcXVlcnkgdG8gd2luZG93XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHdpbmRvdy4kID0gJDtcbiAgfVxuICBsb2cuZGVidWcoJyQnLCAkKTtcblxuICBsb2cuZGVidWcoJ2RvY3VtZW50JywgZG9jdW1lbnQpO1xuICBsb2cuZGVidWcoJ3Q0ZXN0Jyk7XG5cbiAgLy8gZG9jdW1lbnQgbWF5IG5vdCBiZSBhcm91bmRcblxuICAvLyBpbml0aWFsaXplIGJsb2NrcyB3aGVuIHJlYWR5XG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgIGxvZy5kZWJ1ZygncmVhZHkhIDMzJyk7XG5cblxuICAgIC8vIGluaXRpYWxpemUgYWxsIHRhZ2dlZCBibG9ja3NcbiAgICB2YXIgYmxvY2tzID0gJCgnKltkYXRhLWJsb2NrLW5hbWVdJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChibG9ja3NbaV0pIHtcbiAgICAgICAgdmFyICRibG9jayA9IG5ldyBCbG9jaygkKGJsb2Nrc1tpXSkpO1xuICAgICAgICAkYmxvY2suaW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICB9LmJpbmQodGhpcykpO1xufTtcblxudmFyIGluc3RhbmNlID0gbmV3IFNpdGVFbmdpbmUoKTtcbi8vIGV4cG9ydCBTaXRlRW5naW5lIGluc3RhbmNlIHRvIHdpbmRvdyBnbG9iYWxcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuU2l0ZUVuZ2luZSA9IGluc3RhbmNlO1xufVxuLy8gZXhwb3J0IFNpdGVFbmdpbmUgaW5zdGFuY2UgZm9yIG5vZGVqcyAvIGJyb3dzZXJpZnlcbm1vZHVsZS5leHBvcnRzID0gaW5zdGFuY2U7XG5cbiJdfQ==
