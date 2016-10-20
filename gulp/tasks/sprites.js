// required modules
var gulp        = require('gulp');
var spritesmith = require('gulp.spritesmith');
var $ = require('gulp-load-plugins')();

// Sprites
gulp.task('sprites', function() {
  gulp.src('app/images/sprites/**/*')
  .pipe(spritesmith({
    cssName: '_sprites.scss',
    imgName: 'sprites.png',
    imgPath: '../images/sprites.png',
    retinaSrcFilter: 'app/images/sprites/*@2x.png',
    retinaImgName: 'sprites@2x.png',
    retinaImgPath: '../images/sprites@2x.png'
  }))
  .pipe($.if('*.png', gulp.dest('app/images')))
  .pipe($.if('*.scss', gulp.dest('app/scss')));
});
