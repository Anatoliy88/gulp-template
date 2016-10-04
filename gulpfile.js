'use strict';

var gulp = require('gulp'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    stylus = require('gulp-stylus'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    concat = require('gulp-concat'),
    uglifyjs = require('gulp-uglifyjs'),
    minifyCss = require('gulp-minify-css'),
    del = require("del"),
    rename = require("gulp-rename"),
    plumber = require('gulp-plumber'),
    cache = require('gulp-cache');

// browser-sync server

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    }
  });
});

//pug

gulp.task('pug', function buildHTML() {
  return gulp.src('src/pug/**/*.pug')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('src/'))
});

// stylus

gulp.task('stylus', function () {
  return gulp.src('src/stylus/main.styl')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(stylus({
    compress: true
  }))
  .pipe(autoprefixer({
          browsers: ['last 15 versions','> 1%', 'ie 8', 'ie 7'],
          cascade: false
      }))
  .pipe(minifyCss({compatibility: 'ie8'}))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({stream: true}))
});

// scripts

gulp.task('libs', function(){
  return gulp.src([
    'src/assets/jquery/dist/jquery.min.js',
    'src/assets/owl-carousel/owl-carousel/owl.carousel.min.js'
  ])
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(concat('libs.min.js'))
  .pipe(uglifyjs())
  .pipe(gulp.dest('src/js'));
});

gulp.task('js', function(){
  return gulp.src([
    'src/js/main.js'
  ])
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(concat('main.min.js'))
  .pipe(uglifyjs())
  .pipe(gulp.dest('src/js'));
});

gulp.task('js-watch', ['js'], function (done) {
  browserSync.reload();
  done();
});
// watch

gulp.task('watch',['browser-sync', 'stylus', 'libs', 'pug', 'js'], function () {
  gulp.watch('src/stylus/**/*.styl', ['stylus']);
  gulp.watch('src/pug/**/*.pug', ['pug']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js',['js-watch']);
});

// clean

gulp.task('clean', function() {
  return del.sync('dist');
});

// imagemin

gulp.task('img', function() {
  return gulp.src('src/assets/images/**/*')
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({})]
    })))
    .pipe(gulp.dest('dist/assets/images'));
});

//build

gulp.task('build', ['clean', 'img', 'stylus', 'libs'], function() {

  var buildCss = gulp.src([
      'src/css/main.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('src/assetsfonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));

});

//clear cache

gulp.task('clear', function (callback) {
  return cache.clearAll();
});

// default

gulp.task('default', ['watch']);
