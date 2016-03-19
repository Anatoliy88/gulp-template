'use strict';

var gulp = require('gulp'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    stylus = require('gulp-stylus'),
    jade = require('gulp-jade'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    concat = require('gulp-concat'),
    uglifyjs = require('gulp-uglifyjs'),
    minifyCss = require('gulp-minify-css'),
    del = require("del"),
    rename = require("gulp-rename"),
    cache = require('gulp-cache');

// browser-sync server

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

//jade

gulp.task('jade', function() {
    gulp.src('app/jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('app/'))
    //.pipe(connect.reload())
    .pipe(notify('Nice!'));
});

// stylus

gulp.task('stylus', function () {
  return gulp.src('app/stylus/main.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(autoprefixer({
            browsers: ['last 15 versions','> 1%', 'ie 8', 'ie 7'],
            cascade: false
        }))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify('Nice!'));
});

// scripts

gulp.task('scripts', function(){
  return gulp.src([
    'app/assets/jquery/dist/jquery.min.js',
    'app/assets/owl-carousel/owl-carousel/owl.carousel.min.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglifyjs())
    .pipe(gulp.dest('app/js'));
});

// watch

gulp.task('watch',['browser-sync', 'stylus', 'scripts'], function () {
  gulp.watch('app/stylus/*.styl', ['stylus']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// clean

gulp.task('clean', function() {
  return del.sync('dist');
});

// imagemin

gulp.task('img', function() {
  return gulp.src('img/**/*')
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({})]
    })))
    .pipe(gulp.dest('dist/img'));
});

//build

gulp.task('build', ['clean', 'img', 'stylus', 'scripts'], function() {

  var buildCss = gulp.src([
      'app/css/main.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});

//clear cache

gulp.task('clear', function (callback) {
  return cache.clearAll();
});

// default

gulp.task('default', ['watch']);
