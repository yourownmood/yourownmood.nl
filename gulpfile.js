(function() {
    'use strict';

    // TODO:
    // - 
    
    var gulp = require('gulp'),
        del = require('del'),
        rename = require('gulp-rename'),
        path = require('path'),
        header = require('gulp-header'),
        runSequence = require('run-sequence'),
        concat = require('gulp-concat'),
        
        sass = require('gulp-sass'),
        minifyCSS = require('gulp-minify-css'),
        sourcemaps = require('gulp-sourcemaps'),
        parker = require('gulp-parker'),

        uglify = require('gulp-uglify'),

        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),

        iconfont = require('gulp-iconfont'),
        iconfontCss = require('gulp-iconfont-css'),

        livereload = require('gulp-livereload'),
        styledocco = require('gulp-styledocco');


    // Configuration:
    var config = {
        src_dir: './public',
        build_dir: './public/build',
        logs_dir: './logs',
        node_dir: './node_modules',
        banner: '/*! Build: ' + new Date().toString() + ' */\n',
        font_name: 'myfont'
    };
 
    // Build Process:
    gulp.task('build', function(callback) {
        runSequence('pre-clean', ['compress', 'sass', 'copy-assets'], 'parker', callback);
    });

    // Watch Process:
    gulp.task('watch', function() {
        gulp.watch([config.src_dir + '/assets/sass/**/*.scss'], ['sass']);
        gulp.watch([config.src_dir + '/assets/javascript/**/*.js'], ['compress']);

        livereload.listen();
    });

    // Default task:
    gulp.task('default', ['build', 'watch']);

    // SASS task:
    gulp.task('sass', function() {
        return gulp.src(config.src_dir + '/assets/sass/*.scss')
            .on('data', processWinPath)
            .pipe(sourcemaps.init())
            .pipe(sass({
                errLogToConsole: true,
                sourceComments: 'map',
                sourceMap: 'sass'
            }))

            // Vanilla CSS
            .pipe(header(config.banner))
            .pipe(rename('build.prod.css'))
            .pipe(gulp.dest(config.build_dir + '/css/'))

            // Minify
            .pipe(rename('build.min.css'))
            .pipe(minifyCSS())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.build_dir + '/css/'))
            .pipe(livereload());
    });

    // Move node_modules
    // gulp.task('move-node', function() {
    //     return gulp.src([
    //         config.node_dir + '/angular/angular.min.js',
    //         config.node_dir + '/angular/angular.min.js.map',
    //         config.node_dir + '/angular-animate/angular-animate.min.js',
    //         config.node_dir + '/angular-animate/angular-animate.min.js.map',
    //     ])
    //     .pipe(header(config.banner))
    //     .pipe(gulp.dest(config.build_dir + '/javascript/'));
    // });

    // Javascript compile task
    gulp.task('compress', function() {
        // return gulp.src([
        //     config.src_dir + '/assets/javascript/libs/jquery.min.js',
        //     config.src_dir + '/assets/javascript/libs/jquery.lazyload.min.js',
        //     config.src_dir + '/assets/javascript/libs/wow.js',
        //     //config.src_dir + '/assets/javascript/main.js',
        // ])
        // .pipe(concat('production.js'))
        // .pipe(header(config.banner))
        // .pipe(gulp.dest(config.src_dir + '/assets/javascript/'))

        // .pipe(rename('production.min.js'))
        // //.pipe(uglify())
        // .pipe(gulp.dest(config.build_dir + '/javascript/'))


        return gulp.src([
            config.src_dir + '/assets/javascript/libs/jquery.min.js',
            config.src_dir + '/assets/javascript/libs/jquery.lazyload.min.js',
            config.src_dir + '/assets/javascript/libs/wow.js',

            config.node_dir + '/angular/angular.min.js',
            config.node_dir + '/angular-route/angular-route.min.js',
            config.node_dir + '/angular-animate/angular-animate.min.js',
            config.src_dir  + '/assets/javascript/main.js',
        ])
        .pipe(concat('bundle.js'))
        .pipe(header(config.banner))
        .pipe(gulp.dest(config.src_dir + '/assets/javascript/'))

        .pipe(rename('bundle.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(config.build_dir + '/javascript/'))

        .pipe(livereload());
    });

    // Parker CSS reporting:
    gulp.task('parker', function() {
        return gulp.src(config.build_dir + '/css/*.min.css')
            .pipe(parker({
                file: (config.build_dir + '/css/report.md'),
                title: 'CSS Stats report',
                metrics: [
                    /*
                       Optional metric options
                    */
                    //"TopSelectorSpecificitySelector",
                    //"TopSelectorSpecificity",
                    //"SpecificityPerSelector",
                    //"IdentifiersPerSelector",
                    "SelectorsPerRule",
                    "TotalDeclarations",
                    "UniqueColours",
                    "TotalUniqueColours",
                    "TotalImportantKeywords",
                    "TotalIdSelectors",
                    "TotalSelectors",
                    "TotalRules",
                    "TotalStylesheetSize",
                    "TotalStylesheets",
                    "TotalMediaQueries",
                    "MediaQueries",
                    "TotalIdentifiers"
                ]
            }));
    });

    // Pre-clean task:
    gulp.task('pre-clean', function(callback) {
        del([
            config.build_dir,
        ], callback);
    });

    // Copy assets taks:
    gulp.task('copy-assets', function() {
        gulp.src(config.src_dir + '/assets/images/**/*')
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(config.build_dir + '/images/'));

        gulp.src(config.src_dir + '/assets/fonts/**/*')
            .pipe(gulp.dest(config.build_dir + '/fonts/'));
    });

    // EXPERIMENTAL :
    // Style documentation:
    gulp.task('styledocco', function () {
      gulp.src(config.build_dir + '/css/*min.css')
        .pipe(styledocco({
          out: config.src_dir + '/docs',
          name: 'My Project',
          'no-minify': true
        }));
    });

    // Icon font generator
    gulp.task('iconfont', function(){
        gulp.src([config.src_dir + '/assets/icons/*.svg'])
            .pipe(iconfontCss({
                fontName: config.font_name,
                path: './src/assets/sass/template/_settings.font.scss',
                targetPath: '../sass/_settings/_settings.font.scss',
                fontPath: './src/assets/fonts/'
            }))
            .pipe(iconfont({
                fontName: config.font_name, // required 
                appendCodepoints: true // recommended option 
            }))
            .on('codepoints', function(codepoints, options) {
            // CSS templating, e.g. 
            console.log(codepoints, options);
        })
        .pipe(gulp.dest(config.src_dir + '/assets/fonts/'));
    });

    // Functions:
    // Path mapping on windows.
    function processWinPath(file) {
        var path = require('path');
        if (process.platform === 'win32') {
            file.path = path.relative('.', file.path);
            file.path = file.path.replace(/\\/g, '/');
        }
    }

})();