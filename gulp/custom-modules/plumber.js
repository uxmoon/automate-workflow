// required modules
var gutil   = require('gulp-util');
var notify  = require('gulp-notify');
var plumber = require('gulp-plumber');

// custom Plumber function for catching errors
function customPlumber(errTitle) {
  // Determining whether plumber is ran by Travis
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
        // Customizing error title
        title: errTitle || 'Error running Gulp',
        message: 'Error: <%= error.message %>',
      })
    });
  }
}

module.exports = customPlumber;
