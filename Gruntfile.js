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
          'build/swipe.min.js': 'swipe.js'
        }
      }
    },
    
    sass: {
      options: {
        style: 'expanded'
      },
      demo: {
        files: {
          './style.css': './sass/style.scss'
        }
      } 
    },
    
    watch: {
      sass: {
        files: ['./sass/{,/,**/}*.scss'],
        tasks: ['sass']
      }
    }

  });

  // build
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.registerTask('build', 'uglify');
  grunt.registerTask('default', 'build');
};
