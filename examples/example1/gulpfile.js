var gulp = require('gulp');
var browserify = require('gulp-browserify');
var react = require('gulp-react');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var runSequence = require('gulp-run-sequence');

gulp.task('default', function(cb){
	runSequence(
		'compile-jsx', 
		'browserify', 
		cb);
})

gulp.task('compile-jsx', function(){
	return gulp.src([
		'./react/**/*.jsx'
	])
	.pipe(plumber())
	.pipe(react({ addPragma: false }))
	.pipe(gulp.dest('./build/'));
});

gulp.task('browserify', function(){ 
  return gulp.src(['./build/index.js'])
    .pipe(plumber())
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./'));
});