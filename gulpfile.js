'use strict';

var gulp = require('gulp'),
    notify = require("gulp-notify"),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    stylus = require('gulp-stylus'),
    jade = require('gulp-jade'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    minifyCss = require('gulp-minify-css');


// connect-livereload

gulp.task('connect', function() {
  connect.server({
    port: 8888,
    root: './dist/',
    livereload: true
  });
});

//jade

gulp.task('jade', function() {
    gulp.src('jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
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
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload())
    .pipe(notify('Nice!'));
});

// imagemin

gulp.task('img', () => {
  return gulp.src('img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({quality: '60-70', speed: 4})]
    }))
    .pipe(gulp.dest('dist/assets/img'));
});

// watch

gulp.task('watch', function () {
  gulp.watch('stylus/*.styl', ['css'])
  gulp.watch('jade/*.jade', ['jade'])
});

// default
gulp.task('default', ['connect', 'css', 'jade', 'img', 'watch']);
