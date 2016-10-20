// required modules
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// task
gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe($.useref())
    .pipe($.cached('useref'))
    .pipe($.debug())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.uncss({
      html: ['app/*.html'],
      ignore: [
        '.susy',
        /.is-/,
        /.has-/
      ]
    })))
    .pipe($.if( '*.css', $.cssnano()))
    .pipe($.if( '*.js', $.rev()))
    .pipe($.if( '*.css', $.rev()))
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
});
