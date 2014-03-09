'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({

        // Project settings
        config: {
            src:   'src',
            dist:  'dist',
            theme: 'theme'
        },

        // TASK: Watch
        watch: {
            assemble: {
                files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}'],
                tasks: ['assemble']
            },
            css: {
                files: ['<%= config.src %>/<%= config.theme %>/stylus/**/*.styl'],
                tasks: ['stylus']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.dist %>/{,*/}*.html',
                    '<%= config.dist %>/assets/css/*.css',
                    '<%= config.dist %>/assets/{,*/}*.js',
                    '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    '<%= config.dist %>/<%= config.theme %>/js/vendor/pushy.min.js',
                    '<%= config.dist %>/<%= config.theme %>/js/app.js'
                ],
                dest: '<%= config.dist %>/js/all.js',
            },
        },

        // TASK: Connect, Livereload, Server
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            }
        },

        // TASK: Stylus
        stylus: {
            compile: {
                options: {
                    paths: ['<%= config.src %>/<%= config.theme %>/stylus/'],
                    compress: false,
                    "include css": true
                },
                files: {
                    '<%= config.dist %>/assets/css/main.css': '<%= config.src %>/<%= config.theme %>/stylus/main.styl'
                }
            }
        },

        // TASK: Assemble
        assemble: {
            pages: {
                options: {
                    flatten: true,
                    assets: '<%= config.dist %>/assets',
                    layout: '<%= config.src %>/templates/layouts/default.hbs',
                    data: '<%= config.src %>/data/*.{json,yml}',
                    partials: '<%= config.src %>/templates/partials/*.hbs',
                    plugins: ['assemble-contrib-permalinks','assemble-contrib-sitemap'],
                },
                files: {
                    '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
                }
            }
        },

        // TASK: Clean 'dist' folder
        clean: ['<%= config.dist %>/**/*.{html,xml}']

    });
    
    // Load Grunt tasks
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('server', [
        'clean',
        'assemble',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'assemble'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

};