(function() {
  'use strict';

  /* Config */

  // Load plugins
  var gulp = require('gulp-help')(require('gulp')),
      browserSync = require('browser-sync').create(),
      concat = require('gulp-concat'),
      del = require('del'),
      header = require('gulp-header'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      minifyCSS = require('gulp-minify-css'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      runSequence = require('run-sequence'),
      sass = require('gulp-sass'),
      scsslint = require('gulp-scss-lint'),
      sourcemaps = require('gulp-sourcemaps');

  // Config variables
  var config = {
      root_dir: './',
      src_dir: './public',
      dist_dir: './public/dist',
      build_dir: './build',
      node_dir: './node_modules',
      bower_dir: './bower_components',
      header: '/*! Build: ' + new Date().toString() + ' */\n'
  };


  /* Main tasks */

  // Build
  gulp.task('build', 'Standard build task', function(callback) {
    runSequence('clean', ['sass', 'js', 'copy-assets', 'app-html'], 'image-minify', callback);
  });

  // Serve
  gulp.task('serve', 'Serves the application', ['build'], function(callback) {
    browserSync.init({
      server: config.src_dir
    });

    gulp.watch("public/assets/sass/**/*.scss", ['sass']);
    gulp.watch("public/assets/javascript/**/*.js", ['js']).on('change', browserSync.reload);
    gulp.watch(config.src_dir + "/**/*.html").on('change', browserSync.reload);
  });

  // SCSS-lint watch task:
  gulp.task('scss-lint:watch', 'Watches the .scss files and starts linting', function() {
    gulp.watch("public/assets/sass/**/*.scss", ['scss-lint']);
  });

  // SCSS-lint task:
  gulp.task('scss-lint', 'Lints all the .scss files', function() {
    return gulp.src(config.src_dir + '/assets/sass/**/*.scss')
      .pipe(scsslint({
        'config': 'scss-lint.yml'
      }));
  });


  /* Sub tasks */

  // Clean build task:
  gulp.task('clean', 'Removes old build artifects', function(callback) {
    return del([config.build_dir], callback);
  });

  // JS task:
  gulp.task('js', 'Concats and minify js files', function(callback) {
    return gulp.src([
      config.src_dir  + '/assets/javascript/libs/jquery.min.js',
      config.src_dir  + '/assets/javascript/libs/wow.js',

      // Angular
      config.node_dir + '/angular/angular.min.js',
      config.node_dir + '/angular-route/angular-route.min.js',
      config.node_dir + '/angular-animate/angular-animate.min.js',
      config.node_dir + '/angular-lazy-image/release/lazy-image.js',
      config.src_dir  + '/assets/javascript/main.js',
    ])
    .pipe(concat('bundle.js'))
    .pipe(header(config.banner))
    .pipe(gulp.dest(config.src_dir + '/assets/javascript/'))

    // Minify
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.build_dir + '/javascript/'))

    .pipe(browserSync.stream());
  });

  // Sass task:
  gulp.task('sass', 'Concats and minify scss files', function(callback) {
    return gulp.src(config.src_dir + '/assets/sass/*.scss')
          .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest(config.src_dir + '/assets/css/'))

          //Minified CSS
          .pipe(rename('main.min.css'))
          .pipe(minifyCSS())
          .pipe(header(config.header))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(config.build_dir + '/css/'))

          .pipe(browserSync.stream());
  });

  // Copy assets task:
  gulp.task('copy-assets', 'Copys assets files to the build folder', function() {
    gulp.src(config.src_dir + '/assets/images/**/*')
        .pipe(gulp.dest(config.build_dir + '/images/'));

    gulp.src(config.src_dir + '/assets/fonts/**/*')
        .pipe(gulp.dest(config.build_dir + '/fonts/'));
  });

  // app HTML task:
  gulp.task('app-html', 'Copy app html files to the build folder', function() {
    gulp.src(config.dist_dir + '/index.html')
        .pipe(gulp.dest(config.build_dir));
  });

  // Image minify task:
  gulp.task('image-minify', 'Image minification', function() {
    gulp.src(config.build_dir + '/images/')
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
        }));
  });

})();
