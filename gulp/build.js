'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']});

var htmlminOptions = {
  removeComments: true,
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true
};


gulp.task('partials', ['markups'], function () {
  return gulp.src([
    paths.src + '/{modules,components}/**/*.html',
    paths.tmp + '/serve/{modules,components}/**/*.html'
  ])
    .pipe($.htmlmin(htmlminOptions))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {module: 'app'}))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['partials', 'inject'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', {restore: true, passthrough: false});
  var jsFilter = $.filter('**/**/*.js', {restore: true, passthrough: false});
  var cssFilter = $.filter('**/**/*.css', {restore: true, passthrough: false});
  var assets;


  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())

    .pipe(jsFilter)
    //.pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())

    .pipe($.uglify({
      mangle: true,
      preserveComments: 'license'
      //preserveComments: $.uglifySaveLicense
    })).on('error', gulp.myErrorHandler('Uglify'))

    //.pipe($.sourcemaps.write('.'))
    .pipe(jsFilter.restore)

    .pipe(cssFilter)
    //.pipe($.replace('../bootstrap-sass-official/assets/fonts/bootstrap', 'fonts'))
    .pipe($.replace('../font/weathericons', '../fonts/weathericons'))
    .pipe($.csso())
    .pipe(cssFilter.restore)

    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())

    .pipe(htmlFilter)
    .pipe($.htmlmin(htmlminOptions))
    .pipe(htmlFilter.restore)

    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

var fontFiles = $.mainBowerFiles();
fontFiles.push(paths.src + '/assets/fonts/**/*');

gulp.task('fonts', function () {
  return gulp.src(fontFiles)
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/assets/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc', 'config']);
