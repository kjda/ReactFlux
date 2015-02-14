var gulp = require('gulp');
var browserify = require('gulp-browserify');
var react = require('gulp-react');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');

gulp.task('default', function(cb){
	return gulp.src([
		'./index.jsx'
	])
	.pipe(plumber())
	.pipe(react({ addPragma: false }))
	.pipe(browserify({
		insertGlobals: true,
		debug: false
	}))
	.pipe(concat('index.js'))
	.pipe(gulp.dest('./'));
});
