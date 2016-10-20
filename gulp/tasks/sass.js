// required modules
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

// required custom modules
var customPlumber = require('../custom-modules/plumber');

// sass task
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(customPlumber('Error running Sass'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: [
        'app/bower_components',
        'node_modules'
      ]
    }))
    .pipe($.autoprefixer({
      browsers: [
        'last 2 versions'
      ]
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
