const webpackConfig = require('./webpack.config');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                    clearCacheFilter: (key) => true, // Optionally defines which files should keep in cache
                    noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
                },
                src: ['test/*.js']
            }
        },

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
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('web', ['webpack']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('default', ['sass', 'cssmin', 'watch']);
};