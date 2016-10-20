// required modules
var gulp = require('gulp');

// require config
var config = require('../config');

// task
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});
