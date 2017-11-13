'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.paths = {
  src: 'app',
  dist: 'public',
  tmp: '.tmp',
  e2e: 'test/e2e',
  unit: 'test/unit'
};

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('serve');
});

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
gulp.myErrorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
