'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {

  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src([
    paths.src + '/{modules,components}/**/*.scss',
    '!' + paths.src + '/assets/styles/index.scss',
    '!' + paths.src + '/assets/styles/vendor.scss'
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(paths.src + '/app/', '');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  var indexFilter = $.filter('index.scss', {restore: true, passthrough: false});

  return gulp.src([
    paths.src + '/assets/styles/index.scss',
    paths.src + '/assets/styles/vendor.scss'
  ])
    .pipe(indexFilter)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(indexFilter.restore)

    .pipe($.sass(sassOptions))
    //.pipe($.sourcemaps.init())
    .pipe($.cssnano())
    .on('error', gulp.myErrorHandler('CssNano'))
    //.pipe($.sourcemaps.write('.'))

    .pipe($.autoprefixer())
    .on('error', gulp.myErrorHandler('AutoPrefixer'))

    .pipe(gulp.dest(paths.tmp + '/serve/assets/styles/'));
});
