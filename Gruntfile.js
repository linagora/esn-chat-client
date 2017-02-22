const loadGrunt = require('load-grunt-tasks');
const timeGrunt = require('time-grunt');

module.exports = grunt => {
  timeGrunt(grunt);

  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc.json'
      },
      target: [
        'Gruntfile.js',
        'test/**/*.js',
        'lib/**/*.js'
      ]
    },
    mochacli: {
      options: {
        require: ['chai', 'mockery'],
        reporter: 'spec',
        timeout: process.env.TEST_TIMEOUT || 5000
      },
      unit: {
        options: {
          files: ['test/all.js', 'lib/**/*.spec.js']
        }
      }
    }
  });

  loadGrunt(grunt);

  grunt.registerTask('unit', 'Unit tests', ['mochacli:unit']);
  grunt.registerTask('lint', 'eslint');
  grunt.registerTask('test', ['lint', 'unit']);
  grunt.registerTask('default', ['test']);
};
