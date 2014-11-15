var gulp = require('gulp'),
	livereload = require('gulp-livereload');

gulp.task('default', function() {
	gulp.watch([
		'**/*.html',
		'**/*.js',
	]).on('change', livereload.changed); 
});