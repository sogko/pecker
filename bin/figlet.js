'use strict';

var figlet = require('figlet'),
  async = require('async');


var printPecker = function (font) {
  figlet('PECKER', {
    font: font,
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function (err, data) {

    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data);
  });
};

figlet.fonts(function (err, fonts) {
  if (err) {
    console.log('something went wrong...');
    console.dir(err);
    return;
  }


  async.timesSeries(fonts.length, function (n, next) {
    console.log(fonts[n]);
    figlet('PECKER', {
      font: fonts[n],
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }, function (err, data) {

      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);

      next(null, true);
    });
  }, function () {
    console.log('done');
  });

  //for (var i = 0; i < fonts.length; i++) {
  //  printPecker(fonts[i]);
  //}
});