'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

//var es = require('event-stream');
//var series = require('stream-series');
var sortStream = require('sort-stream');

gulp.task('inject', ['scripts', 'styles'], function () {

  var injectStyles = gulp.src([
    paths.tmp + '/serve/{modules,components,assets}/**/**/*.css',
    '!' + paths.tmp + '/serve/assets/styles/vendor.css'
  ], { read: false });


  var scriptsOrder = [
    'modules/app/app.module.js',
    'modules/app/app.config.js',
    'modules/app/app.run.js',
    'config/main.conf.js'
  ];

  var injectScripts = gulp.src([
    // paths.src + '/{modules,components,services,config,models}/**/*.js',
    paths.tmp + '/serve/{modules,components,services,config,models}/**/*.js'
  ], {read: false})
      .pipe(sortStream(function(fileA, fileB) {
        var
          a = fileA.path,
          b = fileB.path,
          aInOrder = (scriptsOrder.indexOf(a) > -1),
          bInOrder = (scriptsOrder.indexOf(a) > -1),
          result = 0;

        scriptsOrder.some(function(item){
          if (a.indexOf(item) > -1) {
            aInOrder = true;
            return true;
          }
          else if (b.indexOf(item) > -1) {
            bInOrder = true;
            return true;
          }
        });

        if (aInOrder && bInOrder) result = scriptsOrder.indexOf(a) > scriptsOrder.indexOf(b) ? -1 : 1;
        else if (aInOrder) result = -1;
        else if (bInOrder) result = 1;
        else result = a > b ? -1 : 1;

        return result;
      }));

  //var injectScripts = gulp.src([
  //  paths.src + '/{modules,components,directives,filters,services,config,models}/**/**/*.js',
  //  //paths.tmp + '/serve/{modules,components,directives,filters,services,config,models}/**/**/*.js',
  //  //'!{' + paths.src + ',' + paths.tmp + '/serve}' + '/modules/app/**/*.js'
  //  '!' + paths.src + '/modules/app/**/*.js',
  //  //'!' + paths.tmp + '/serve/modules/app/**/*.js'//,
  //  //'!' + paths.src + '/modules/app/**/*.js',
  //  //'!' + paths.tmp + '/serve/modules/app/**/*.js'
  //], {read: false});//.pipe($.angularFilesort());
  //
  //var injectScriptsApp = gulp.src([
  //  paths.src + '/modules/app/**/*.js',
  //  //paths.tmp + '/serve/modules/app/**/*.js'//,
  //  //paths.src + '/modules/app/**/*.js',
  //  //paths.tmp + '/serve/modules/app/**/*.js'
  //], {read: false}); //.pipe($.angularFilesort());

  var injectOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };

  var wiredepOptions = {
    directory: 'bower_components'
  };

  return gulp.src(paths.src + '/index.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    //.pipe($.inject(series(injectScriptsApp, injectScripts)))
    //.pipe($.inject(injectScriptsApp, injectOptions))
    //.pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.tmp + '/serve'));

});
