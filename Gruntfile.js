module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			'assets/everything.js': ['js/angular.js', 'js/autocomplete.js', 'js/filesaver.js', 'js/*.js' ],
		},
		cssmin: {
			'assets/everything.css': ['css/*.css'],
		},
		watch: {
			files: ['css/*', 'js/*'],
			tasks: ['default'],
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['uglify', 'cssmin']);

};