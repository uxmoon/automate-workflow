// required modules
var gulp = require('gulp');
var runSequence = require('run-sequence');

// task
gulp.task('build', function(callback) {
  runSequence(
    ['clean:dev', 'clean:dist'],
    ['sprites', 'lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    ['useref', 'images', 'fonts', 'test'],
    callback
  );
});
