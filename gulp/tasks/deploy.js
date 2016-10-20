// required modules
var gulp  = require('gulp');
var fs    = require('fs');
var rsync = require('rsyncwrapper').rsync;
var gutil = require('gulp-util');
var ftp   = require('vinyl-ftp');

if (!process.env.CI) {

  // Creds
  var creds = JSON.parse(fs.readFileSync('./secrets.json'));

  // rsync task
  gulp.task('rsync', function() {
    rsync({
      src: './dist/',
      // Keep dest in secrets.json
      dest: creds.dest,
      ssh: true,
      recursive: true,
      deleteAll: true
    },
    function(error, stdout, stderr, cmd) {
      if (error) {
        console.log(error.message);
        console.log(stdout);
        console.log(stderr);
      }
    });
  });

  // FTP task
  var conn = ftp.create({
    host: creds.server,
    user: creds.username,
    password: creds.password,
    parallel: 10,
    log: gutil.log
  });

  gulp.task('ftp-clean', function(cb){
    conn.rmdir(creds.remotePath, function(err) {
      if(err) {
        console.log(err);
      }
    });
  });

  gulp.task('ftp', function() {
    return gulp.src('dist/**/*')
      .pipe(conn.dest(creds.remotePath));
  });

}
