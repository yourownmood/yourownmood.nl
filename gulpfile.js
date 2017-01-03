(function() {
  'use strict';

  /* Config */

  // Load plugins
  var gulp = require('gulp-help')(require('gulp')),
      browserSync = require('browser-sync').create(),
      bump = require('gulp-bump'),
      concat = require('gulp-concat'),
      cred = require('./cred.json'),
      del = require('del'),
      filter = require('gulp-filter'),
      fs = require('fs'),
      ftp = require('vinyl-ftp'),
      git = require('gulp-git'),
      gutil = require('gulp-util'),
      header = require('gulp-header'),
      minifyCSS = require('gulp-minify-css'),
      ngAnnotate = require('gulp-ng-annotate'),
      rename = require('gulp-rename'),
      runSequence = require('run-sequence'),
      sass = require('gulp-sass'),
      scsslint = require('gulp-scss-lint'),
      sourcemaps = require('gulp-sourcemaps'),
      tag_version = require('gulp-tag-version'),
      uglify = require('gulp-uglify');

  // Config variables
  var config = {
      root_dir: './',
      src_dir: './src',
      dist_dir: './src/dist',
      build_dir: './build',
      node_dir: './node_modules',
      bower_dir: './bower_components'
  };

  // Set the banner var
  var packJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  var banner = '/*! Build: ' + packJson.version + ' - ' + new Date().toString() + ' */\n';


  /* Main tasks */

  // Build
  gulp.task('build', 'Standard build task', function(callback) {
    runSequence('clean', ['sass', 'js:build', 'copy-assets', 'app-html', 'app-json'], callback);
  });

  // Serve
  gulp.task('serve', 'Serves the application', ['sass', 'js'], function(callback) {
    browserSync.init({
      server: config.src_dir
    });

    gulp.watch("src/assets/sass/**/*.scss", ['sass']);
    gulp.watch("src/assets/javascript/**/*.js", ['js']).on('change', browserSync.reload);
    gulp.watch(config.src_dir + "/**/*.html").on('change', browserSync.reload);
  });

  // SCSS-lint watch task:
  gulp.task('scss-lint:watch', 'Watches the .scss files and starts linting', function() {
    gulp.watch("src/assets/sass/**/*.scss", ['scss-lint']);
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
      config.src_dir  + '/assets/javascript/libs/wow.js',
      config.node_dir + '/angular/angular.min.js',
      config.node_dir + '/angular-route/angular-route.min.js',
      config.node_dir + '/angular-animate/angular-animate.min.js',
      config.node_dir + '/angular-lazy-image/release/lazy-image.js',
      config.src_dir  + '/assets/javascript/main.js'
    ])
    .pipe(ngAnnotate())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(config.src_dir + '/assets/javascript/'))
    .pipe(browserSync.stream());
  });

  // JS build task:
  gulp.task('js:build', 'Concats and minify js files', function(callback) {
    // Update the banner var
    var packJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    var banner = '/*! Build: ' + packJson.version + ' - ' + new Date().toString() + ' */\n';

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
    .pipe(ngAnnotate())
    .pipe(concat('bundle.min.js'))
    .pipe(uglify())
    .pipe(header(banner))
    .pipe(gulp.dest(config.build_dir + '/javascript/'));
  });

  // Sass task:
  gulp.task('sass', 'Concats and minify scss files', function(callback) {
    // Update the banner var
    var packJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    var banner = '/*! Build: ' + packJson.version + ' - ' + new Date().toString() + ' */\n';

    return gulp.src(config.src_dir + '/assets/sass/*.scss')
          .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest(config.src_dir + '/assets/css/'))

          //Minified CSS
          .pipe(rename('main.min.css'))
          .pipe(minifyCSS())
          .pipe(header(banner))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(config.build_dir + '/assets/css/'))

          .pipe(browserSync.stream());
  });

  // Copy assets task:
  gulp.task('copy-assets', 'Copys assets files to the build folder', function() {
    return gulp.src(config.src_dir + '/assets/images/**/*')
           .pipe(gulp.dest(config.build_dir + '/assets/images/'));
  });

  // app HTML task:
  gulp.task('app-html', ['move-partials', 'move-templates'], function() {
    return gulp.src([
            config.dist_dir + '/index.html',
            config.dist_dir + '/.htaccess',
           ])
           .pipe(gulp.dest(config.build_dir));
  });

  // Move partials dir task:
  gulp.task('move-partials', function() {
    return gulp.src(config.src_dir + '/partials/*.html')
           .pipe(gulp.dest(config.build_dir + '/partials/'));
  });

  // Move templates dir task:
  gulp.task('move-templates', function() {
    return gulp.src(config.src_dir + '/templates/*.html')
           .pipe(gulp.dest(config.build_dir + '/templates/'));
  });

  // app JSON task:
  gulp.task('app-json', 'Copy app .json files to the build folder', function() {
    return gulp.src(config.src_dir + '/*.json')
           .pipe(gulp.dest(config.build_dir));
  });


  /* Versioning and publishing */

  // Publish-patch
  gulp.task('create-patch', 'Create patch release', function(callback) {
    runSequence('patch', 'build', 'commit', callback);
  });

  // Publish-minor
  gulp.task('create-minor', 'Create minor release', function(callback) {
    runSequence('minor', 'build', 'commit', callback);
  });

  // Publish-major
  gulp.task('create-major', 'Create major release', function(callback) {
    runSequence('major', 'build', 'commit', callback);
  });

  // gulp patch # makes v0.1.0 → v0.1.1
  gulp.task('patch', function() { return inc('patch'); })

  // gulp minor # makes v0.1.1 → v0.2.0
  gulp.task('minor', function() { return inc('minor'); })

  // gulp major # makes v0.2.1 → v1.0.0
  gulp.task('major', function() { return inc('major'); })

  function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json'])
      // bump the version number in those files
      .pipe(bump({type: importance}))
      // save it back to filesystem
      .pipe(gulp.dest('./'));
  }

  // Commit task
  gulp.task('commit', function() {
    return gulp.src(['./package.json'])
      .pipe(git.commit('bumps package version'))
      // read only one file to get the version number
      .pipe(filter('package.json'))
      // tag it in the repository
      .pipe(tag_version());
  });

  // Pubish test task
  gulp.task( 'publish-test', ['build'], function () {
    var conn = ftp.create( {
        host:     cred.host,
        user:     cred.user,
        password: cred.pass,
        parallel: 10,
        log:      gutil.log
    } );

    var globs = [
        config.build_dir + '/**/*'
    ];

    return gulp.src( globs, { base: 'build', buffer: false } )
        .pipe( conn.newer( cred.test) ) // only upload newer files
        .pipe( conn.dest( cred.test ) );
  });

  // Pubish prod task
  gulp.task( 'publish-prod', ['build'], function () {
    var conn = ftp.create( {
        host:     cred.host,
        user:     cred.user,
        password: cred.pass,
        parallel: 10,
        log:      gutil.log
    } );

    var globs = [
        config.build_dir + '/**/*',
        config.build_dir + '/.htaccess'
    ];

    return gulp.src( globs, { base: 'build', buffer: false } )
        .pipe( conn.newer( cred.prod) ) // only upload newer files
        .pipe( conn.dest( cred.prod ) );
  });

})();
