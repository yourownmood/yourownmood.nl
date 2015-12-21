(function() {
  'use strict';

  var gulp = require('gulp'),
      runSequence = require('run-sequence'),
      browserSync = require('browser-sync').create(),
      del = require('del'),
      header = require('gulp-header'),
      rename = require('gulp-rename'),
      concat = require('gulp-concat'),

      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      minifyCSS = require('gulp-minify-css'),
      uglify = require('gulp-uglify'),

      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant');

  var config = {
      root_dir: './',
      src_dir: './public',
      build_dir: './build',
      node_dir: './node_modules',
      header: '/*! Build: ' + new Date().toString() + ' */\n'
  };


  // Build
  gulp.task('build', function(callback) {
    runSequence('clean', ['sass', 'js', 'copy-assets'], 'image-minify', callback);
  });

  // Serve
  gulp.task('serve', ['build'], function(callback) {

    browserSync.init({
      server: config.src_dir
    });

    gulp.watch("public/assets/sass/**/*.scss", ['sass']);
    gulp.watch("public/assets/javascript/**/*.js", ['js']).on('change', browserSync.reload);
    gulp.watch(config.src_dir + "/**/*.html").on('change', browserSync.reload);

  });


    // Clean build task:
    gulp.task('clean', function(callback) {
      return del([config.build_dir], callback);
    });

    // JS task:
    gulp.task('js', function(callback) {
      return gulp.src([
        config.src_dir  + '/assets/javascript/libs/jquery.min.js',
        config.node_dir + '/jquery-lazyload/jquery.lazyload.js',
        config.src_dir  + '/assets/javascript/libs/wow.js',

        config.node_dir + '/angular/angular.min.js',
        config.node_dir + '/angular-route/angular-route.min.js',
        config.node_dir + '/angular-animate/angular-animate.min.js',
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
    gulp.task('sass', function(callback) {
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
    gulp.task('copy-assets', function() {
      gulp.src(config.src_dir + '/assets/images/**/*')
          .pipe(gulp.dest(config.build_dir + '/images/'));

      gulp.src(config.src_dir + '/assets/fonts/**/*')
          .pipe(gulp.dest(config.build_dir + '/fonts/'));
    });

    // Image minify task:
    gulp.task('image-minify', function() {
      gulp.src(config.build_dir + '/images/')
          .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
          }));
    });

})();