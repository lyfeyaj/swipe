var sass = require('node-sass');

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    uglify: {
      options: {
        mangle: {
          reserved: ['Swipe']
        },
        preserveComments: 'some'
      },
      dist: {
        files: {
          'build/swipe.min.js': 'swipe.js',
          'react/index.js': 'react/index.js'
        }
      }
    },

    sass: {
      options: {
        implementation: sass,
        style: 'expanded'
      },
      demo: {
        files: {
          './doc/style.css': './doc/sass/style.scss'
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
        presets: ['babel-preset-es2015', 'babel-preset-react']
      },
      dist: {
        files: {
          'react/index.js': 'react/swipe.jsx'
        }
      }
    }

  });

  // build
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('build', ['babel', 'sass', 'uglify']);
  grunt.registerTask('default', 'build');
};
