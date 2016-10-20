// required modules
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// task
gulp.task('lint:scss', function() {
  return gulp.src(['/app/scss/**/*.scss', '!/app/scss/_sprites.scss'])
    .pipe($.scssLint({
      config: '.scss-lint.yml'
  }));
});
