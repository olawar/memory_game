var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var connect = require('gulp-connect');


gulp.task('lint', function() {
  return gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('scripts', function () {
    gulp.src('src/js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
    gulp.src('src/sass/styles.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));
});

gulp.task('connect', function() {
  connect.server();
});

gulp.task('default', ['lint', 'scripts', 'sass', 'connect'], function () {
    gulp.watch('src/js/**/*.js', ['lint', 'scripts']);
    gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
});
