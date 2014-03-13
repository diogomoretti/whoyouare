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
                files: [
                    '<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}',
                    '<%= config.src %>/partials/**/*.{md,hbs,yml}'
                ],
                tasks: ['assemble']
            },
            css: {
                files: ['<%= config.src %>/<%= config.theme %>/stylus/**/*.styl'],
                tasks: ['stylus']
            },
            js: {
                files: ['<%= config.src %>/<%= config.theme %>/js/**/*.js'],
                tasks: ['concat']
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

        // TASK: Concat js files
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    '<%= config.src %>/<%= config.theme %>/js/vendor/pushy.min.js',
                    '<%= config.src %>/<%= config.theme %>/js/vendor/unslider.min.js',
                    '<%= config.src %>/<%= config.theme %>/js/app.js'
                ],
                dest: '<%= config.dist %>/assets/js/all.js',
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
            options: {
                flatten: true,
                helpers: ['<%= config.src %>/helpers/*.js'],
                assets: '<%= config.dist %>/assets',
                partials: '<%= config.src %>/templates/partials/**/*.hbs',
                plugins: ['assemble-contrib-permalinks'],
                data: '<%= config.src %>/data/*.{json,yml}',
                permalinks: {
                    preset: 'pretty'
                }
            },
            pages: {
                options: {
                    layout: '<%= config.src %>/templates/layouts/default.hbs',
                    plugins: ['assemble-contrib-sitemap']
                },
                files: {
                    '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
                }
            },
            internals: {
                options: {
                    layout: '<%= config.src %>/templates/layouts/internal.hbs',
                },
                files: {
                    '<%= config.dist %>/': ['<%= config.src %>/content/internal/*.{hbs,md,html}']
                }
            },
            artworks: {
                options: {
                    layout: '<%= config.src %>/templates/layouts/internal.hbs',
                    permalinks: {
                        structure: ':year/:basename',
                    },
                },
                files: {
                    '<%= config.dist %>/artworks/': ['<%= config.src %>/content/artworks/**/*.{hbs,md,html}']
                }
            }
        },

        // TASK: Clean 'dist' folder
        clean: {
            all: [
                '<%= config.dist %>/**/*.{html,xml}',
                '<%= config.dist %>/assets/js/all.js'
            ]
        }

    });
    
    // Load Grunt tasks
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('server', [
        'clean:all',
        'concat',
        'stylus',
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