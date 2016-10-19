var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    notify       = require('gulp-notify'),
    browserSync  = require('browser-sync').create(),
    gulpIf       = require('gulp-if'),
    del          = require('del'),
    fs           = require('fs');



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Development Phase
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Display a visual notification when an error occurs
// Error preventing for multiple plugins
// Preventing Sass errors from breaking gulp watch
function customPlumber(errTitle) {
  if(process.env.CI){
    return plumber({
      errorHandler: notify.onError({
        title: errTitle || "Error running Gulp",
        message: "Error: <%= error.message %>",
        sound: "Glass"
      })
    });
  } else {
    return plumber({
      errorHandler: notify.onError({
        title: errTitle || 'Error running Gulp',
        message: 'Error: <%= error.message %>',
      })
    });
  }

}

gulp.task('nunjucks', function(){

  // Dependencies
  var nunjucksRender = require('gulp-nunjucks-render');
  var data           = require('gulp-data');

  return gulp.src('app/pages/**/*.+(html|nunjucks)')
    .pipe(customPlumber('Error running Nunjucks'))
    .pipe(data(function(){
      return JSON.parse(fs.readFileSync('./app/data.json'))
    }))
    .pipe(nunjucksRender({
      path: ['app/templates']
    }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream())
});

// Sprites
gulp.task('sprites', function() {

  // Dependencies
  var spritesmith  = require('gulp.spritesmith');

  gulp.src('app/images/sprites/**/*')
  .pipe(spritesmith({
    cssName: '_sprites.scss',
    imgName: 'sprites.png',
    imgPath: '../images/sprites.png',
    retinaSrcFilter: 'app/images/sprites/*@2x.png',
    retinaImgName: 'sprites@2x.png',
    retinaImgPath: '../images/sprites@2x.png'
  }))
  .pipe(gulpIf('*.png', gulp.dest('app/images')))
  .pipe(gulpIf('*.scss', gulp.dest('app/scss')));
});

// BrowserSync
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './app'
    },
    browser: ["google chrome", "firefox"]
  })
});

// Sass
gulp.task('sass', function(){

  var sass         = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  var sourcemaps   = require('gulp-sourcemaps');

  return gulp.src('app/scss/**/*.scss')
    .pipe(customPlumber('Error running Sass'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['app/bower_components']
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
});

// Clean task
gulp.task('clean:dev', function(){
  return del.sync([
    'app/css',
    'app/*.html'
  ]);
});

// Watch Tasks

// gulp.task('watch-js', ['lint:js'], browserSync.reload);
gulp.task('watch-js', ['lint:js']).on('change', browserSync.reload);

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

var runSequence  = require('run-sequence')

// Default task. Development Phase
gulp.task('default', function(callback){
  runSequence(
    'clean:dev',
    ['sprites', 'lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    ['serve', 'watch'],
    callback
  )
})

// Travis specific task without watch and browserSync
gulp.task('dev-ci', function(callback){
  runSequence(
    'clean:dev',
    ['sprites', 'lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    callback
  )
})





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Testing Phase
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


gulp.task('lint:js', function(){

  // Dependencies
  var jshint  = require('gulp-jshint');
  var stylish = require('jshint-stylish');
  var jscs    = require('gulp-jscs');

  return gulp.src('app/js/**/*.js')
    .pipe(customPlumber('JsHint Error'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs({
      fix: true,
      configPath: '.jscsrc'
    }))
    .pipe(gulp.dest('app/js'))
})

// Sass Lint
gulp.task('lint:scss', function() {

  // Depencencies
  var scssLint = require('gulp-scss-lint');

  return gulp.src(['/app/scss/**/*.scss', '!/app/scss/_sprites.scss'])
    .pipe(scssLint({
      config: '.scss-lint.yml'
  }));
});


// Js Unit Testing with Karma and Jasmine
var Server = require('karma').Server;

gulp.task('test', function(done) {
  new Server({
    configFile: process.cwd() + '/karma.conf.js',
    singleRun: true
  }, done).start();
});





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Optimization Phase
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// CSS: uncss and cssnano, JS: concat with useref and uglify
gulp.task('useref', function() {

  var useref = require('gulp-useref');
  var uglify = require('gulp-uglify');
  var debug = require('gulp-debug');
  var cached = require('gulp-cached');
  var uncss = require('gulp-uncss');
  var cssnano = require('gulp-cssnano');
  var rev = require('gulp-rev');
  var revReplace = require('gulp-rev-replace');

  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(cached('useref'))
    .pipe(debug())
    .pipe(gulpIf( '*.js', uglify() ))
    .pipe(gulpIf( '*.css', uncss({
      html: ['app/*.html'],
      ignore: [
        '.susy',
        /.is-/,
        /.has-/
      ]
    })))
    .pipe(gulpIf( '*.css', cssnano() ))
    .pipe(gulpIf( '*.js', rev() ))
    .pipe(gulpIf( '*.css', rev() ))
    .pipe(revReplace())
    .pipe(gulp.dest('dist'))
});





// Images
gulp.task('images', function() {

  var imagemin = require('gulp-imagemin');
  var newer = require('gulp-newer');
  var cache = require('gulp-cache');

  // source
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Speeding opt process via Comparing timestamps
    // .pipe(newer('dist/images'))
    // Speeding opt process via cache
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevels: 5,
      multipass: true,
      SVGOPlugins: [
        {'removeTitle': true},
        {'removeUselessStrokeAndFill': false}
      ]
    })))
    // output
    .pipe(gulp.dest('dist/images'))
});





// Copy files
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});





// Cleaning the dist folder
gulp.task('clean:dist', function() {
  return del.sync([
    'dist/**/*',
    '!dist/images/sprites/**/*'
  ]);
});





// Chaining tasks
gulp.task('build', function(callback) {
  runSequence(
    ['clean:dev', 'clean:dist'],
    ['sprites', 'lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    ['useref', 'images', 'fonts', 'test'],
    callback
  );
});

// Deployment using ssh

if (!process.env.CI) {

  var rsync = require('rsyncwrapper');

  gulp.task('rsync', function() {
    rsync({
      src: './dist/',
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


  // Deployment using FTP
  var ftp = require('vinyl-ftp');
  var gutil = require( 'gulp-util' );
  var creds = JSON.parse(fs.readFileSync('./secrets.json'));

  var conn = ftp.create({
    host: creds.server,
    user: creds.username,
    password: creds.password,
    parallel: 10,
    log: gutil.log
  });

  gulp.task('ftp', function() {
    return gulp.src('dist/**/*')
      .pipe(conn.dest(creds.remotePath));
  });

  gulp.task('ftp-clean', function(cb){
    conn.rmdir(creds.remotePath, function(err) {
      if(err) {
        console.log(err);
      }
    });
  });

} // end process.env.CI
