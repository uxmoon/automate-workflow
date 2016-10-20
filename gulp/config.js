var config = {
  sass: {
    src: 'app/scss/**/*.scss',
    dest: 'app/css',
    options: {
      includePaths: [
        'app/bower_components',
        'node_modules'
      ]
    }
  },

  autoprefixer: {
    options: {
      browsers: [
        'last 2 versions'
      ]
    }
  },

  images: {
    src: 'app/images/**/*.+(png|jpg|jpeg|gif|svg)',
    dest: 'dist/images',
  },

  nunjucks: {
    src: 'app/pages/**/*.+(html|nunjucks)',
    dest: 'app',
    data: './app/data.json'
  },

  sprites: {
    src: 'app/images/sprites/**/*',
    destImg: 'app/images',
    destSCSS: 'app/scss',
    options: {
      cssName: '_sprites.scss',
      imgName: 'sprites.png',
      imgPath: '../images/sprites.png',
      retinaSrcFilter: 'app/images/sprites/*@2x.png',
      retinaImgName: 'sprites@2x.png',
      retinaImgPath: '../images/sprites@2x.png'
    }
  },

  useref: {
    src: 'app/*.html',
    dest: 'dist'
  },

  uncss: {
    options: {
      html: ['app/*.html'],
      ignore: [
        /.c-/,
        /.u-/,
        /.l-/,
        /.o-/,
        /.is-/,
        /.has-/
      ]
    }
  }

};

module.exports = config;
