// required modules
var gulp = require('gulp');
var stylish = require('jshint-stylish');
var $ = require('gulp-load-plugins')();

// required custom modules
var customPlumber = require('../custom-modules/plumber');

// JS Lint
gulp.task('lint:js', function(){
  return gulp.src('app/js/**/*.js')
    .pipe(customPlumber('JsHint Error'))
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs({
      fix: true,
      configPath: '.jscsrc'
    }))
    .pipe(gulp.dest('app/js'))
});
