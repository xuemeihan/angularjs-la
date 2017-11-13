'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

gulp.task('watch', ['scripts', 'markups', 'inject'], function () {
  gulp.watch(paths.src + '/{modules,components}/**/*.html', ['markups']);
  gulp.watch(paths.src + '/{modules,components,config,models}/**/*.js', ['scripts']);

  gulp.watch([
    paths.src + '/*.html',
    paths.src + '/{modules,components}/**/*.html',
    // paths.src + '/{modules,components}/**/*.jade',
    paths.src + '/{modules,components,assets}/**/*.css',
    paths.src + '/{modules,components,assets}/**/*.scss',
    paths.src + '/{modules,components,config,models}/**/*.js',
    // paths.src + '/{modules,components,config,models}/**/*.coffee',
    'bower.json'
  ], ['inject']);
});
