// required modules
var gulp = require('gulp');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

// required custom modules
var customPlumber = require('../custom-modules/plumber');

// nunjucks task
gulp.task('nunjucks', function(){
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
    .pipe(customPlumber('Error running Nunjucks'))
    .pipe($.data(function(){
      return JSON.parse(fs.readFileSync('./app/data.json'))
    }))
    .pipe($.nunjucksRender({
      path: ['app/templates']
    }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
