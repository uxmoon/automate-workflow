// required modules
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// task
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe($.cache($.imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevels: 5,
      multipass: true,
      SVGOPlugins: [
        {'removeTitle': true},
        {'removeUselessStrokeAndFill': false}
      ]
    })))
    .pipe(gulp.dest('dist/images'))
});
