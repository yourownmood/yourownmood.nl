module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {   
            dist: {
                src: [
                    'public/_assets/javascript/libs/jquery.min.js',
                    'public/_assets/javascript/libs/jquery.lazyload.min.js',
                    'public/_assets/javascript/libs/wow.js',
                    'public/_assets/javascript/main.js'
                ],
                dest: 'public/_assets/javascript/build/production.js',
            }
        },

        uglify: {
            build: {
                src: 'public/_assets/javascript/build/production.js',
                dest: 'public/_assets/javascript/build/production.min.js'
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed' //expanded
                },
                files: [{
                    expand: true,
                    cwd: 'public/_assets/sass',
                    dest: 'public/_assets/css',
                    src: ['*.scss', '!_*.scss'],
                    ext: '.css'
                }]
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: ['public/_assets/sass/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            },
            scripts: {
                files: 'public/_assets/javascript/**/*.js',
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default', ['concat', 'uglify', 'sass']);

};