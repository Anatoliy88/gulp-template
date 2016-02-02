'use strict';

var gulp = require('gulp'),
    notify = require("gulp-notify"),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    stylus = require('gulp-stylus'),
    minifyCss = require('gulp-minify-css');


// connect-livereload

gulp.task('connect', function() {
  connect.server({
    port: 8888,
    root: 'app',
    livereload: true
  });
});

// html

gulp.task('html', function () {
  gulp.src('app/*.html')
    .pipe(connect.reload());
});

// css
gulp.task('css', function () {
  return gulp.src('stylus/main.styl')
    // .pipe(sass().on('error', sass.logError))
    .pipe(stylus({
      compress: true
    }))
    .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('app/css'))
    .pipe(connect.reload())
    .pipe(notify('Nice!'));
});


gulp.task('watch', function () {
    gulp.watch('stylus/*.styl', ['css'])
    gulp.watch('app/*.html', ['html'])
});

// default
gulp.task('default', ['connect', 'html', 'css', 'watch']);
