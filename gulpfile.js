var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var browserSync  = require('browser-sync');




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
  var fs             = require('fs');

  return gulp.src('app/pages/**/*.+(html|nunjucks)')
    .pipe(customPlumber('Error running Nunjucks'))
    .pipe(data(function(){
      return JSON.parse(fs.readFileSync('./app/data.json'))
    }))
    .pipe(nunjucksRender({
      path: ['app/templates']
    }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Sprites
gulp.task('sprites', function() {

  // Dependencies
  var spritesmith  = require('gulp.spritesmith');
  var gulpIf       = require('gulp-if');

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
  browserSync({
    server: {
      baseDir: 'app'
    },
    browser: "firefox"
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
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Clean task
gulp.task('clean:dev', function(){
  var del          = require('del');

  return del.sync([
    'app/css',
    'app/*.html'
  ]);
});

// Watch Tasks

gulp.task('watch-js', ['lint:js'], browserSync.reload);

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', ['sass', 'lint:scss']);
  gulp.watch('app/js/**/*.js', ['watch-js']);
  gulp.watch('app/*.html', browserSync.reload);
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
})
