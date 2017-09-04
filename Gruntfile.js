/*global module */
module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({

    uglify: {
      options: {
        mangle: {
          except: ['Swipe']
        },
        preserveComments: 'some'
      },
      dist: {
        files: {
          'build/swipe.min.js': 'build/swipe.js',
          'react/index.js': 'react/index.js'
        }
      }
    },

    sass: {
      options: {
        style: 'expanded'
      },
      demo: {
        files: {
          './dist/style.css': './sass/style.scss'
        }
      }
    },

    watch: {
      sass: {
        files: ['./sass/{,/,**/}*.scss'],
        tasks: ['sass']
      }
    },

    babel: {
      options: {
        sourceMap: false,
        presets: ['env', 'react']
      },
      dist: {
        files: {
          'react/index.js': 'react/swipe.jsx',
          'build/swipe.js': 'swipe.js'
        }
      }
    }

  });

  // build
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('build', ['babel', 'sass', 'uglify']);
  grunt.registerTask('default', 'build');
};
