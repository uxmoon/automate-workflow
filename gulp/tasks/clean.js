// required modules
var gulp = require('gulp');
var del = require('del');

gulp.task('clean:dev', function(){
  return del.sync([
    'app/css',
    'app/*.html'
  ]);
});

gulp.task('clean:dist', function() {
  return del.sync(['dist']);
});
