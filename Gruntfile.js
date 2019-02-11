module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // compile sass
        sass: {
            dist: {
                options: {
                    lineNumbers: true,
                    style: 'expanded',
                    sourcemap: 'auto',
                },
                files: {
                    'css/main.css': 'css/core.scss'
                }
            }
        },

        // run tasks again on changes in js and css files
        watch: {
            css: {
                files: [
                    'css/*.scss',
                    'css/*/*.scss'
                ],
                tasks: [
                    'sass'
                ]
            },
            all: {
                files: [
                    'Gruntfile.js'
                ],
                tasks: [
                    'sass'
                ]
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['sass', 'watch']);
};