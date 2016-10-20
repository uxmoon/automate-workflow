// required modules
var gulp = require('gulp');
var browserSync = require('browser-sync');

// BrowserSync task
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './app'
    },
    browser: "google chrome"
  });
});
