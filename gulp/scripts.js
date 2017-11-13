'use strict';

var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

gulp.task('scripts-reload', function() {
  return buildScripts()
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return buildScripts();
});

function buildScripts() {
  return gulp.src(path.join(gulp.paths.src, '/{modules,components,services,config,models}/**/*.js'))
    // .pipe(uglify())
    // .pipe($.sourcemaps.init())
    // .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(gulp.paths.tmp, '/serve')))
    // .pipe($.size())
};
