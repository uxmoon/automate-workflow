// required modules
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', ['sass', 'lint:scss']);
  gulp.watch('app/js/**/*.js', ['watch-js']);
  // gulp.watch('app/*.html').on('change', browserSync.reload);
  gulp.watch([
    'app/templates/**/*',
    'app/pages/**/*.+(html|nunjucks)',
    'app/data.json'
    ], ['nunjucks']
  )
});

gulp.task('watch-js', ['lint:js'], browserSync.reload);
