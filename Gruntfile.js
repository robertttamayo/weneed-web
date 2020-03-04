const webpackConfig = require('./webpack.config');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webpack: {
            options: {
                // stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
                stats: true
            },
            prod: webpackConfig,
            dev: Object.assign({ watch: true }, webpackConfig)
        },

        // compile sass
        sass: {
            dist: {
                options: {
                    lineNumbers: true,
                    style: 'expanded',
                    sourcemap: 'auto',
                },
                files: {
                    'assets/css/main.css': 'assets/css/core.scss'
                }
            }
        },

        // minify css
        cssmin: {
            options: {
                sourceMap: 'auto',
                rebase: true
            },
            dist: {
                files: {
                    'assets/min/styles.min.css': [
                        'assets/css/main.css'
                    ]
                }
            }
        },

        watch: {
            css: {
                files: [
                    'assets/css/*.scss',
                    'assets/css/*/*.scss',
                ],
                tasks: [
                    'sass',
                    'cssmin'
                ]
            },
            all: {
                files: [
                    'Gruntfile.js'
                ],
                tasks: [
                    'webpack',
                    'sass',
                    'cssmin'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('web', ['webpack']);
    grunt.registerTask('default', ['sass', 'cssmin', 'watch']);
};