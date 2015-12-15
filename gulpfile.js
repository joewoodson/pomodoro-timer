require('es6-promise').polyfill();

// include gulp
var gulp = require('gulp'); 

// include plug-ins
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var image = require('gulp-image');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var livereload = require('gulp-livereload');

// JS hint task
gulp.task('jshint', function() {
  gulp.src('./src/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
var imgDst = './build/assets/images';

gulp.task('images', function () {
  gulp.src('./src/assets/images/**/*')
    .pipe(changed('./build/images'))
    .pipe(image())
    .pipe(gulp.dest(imgDst));
});

// minify HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './build';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging, and minify
gulp.task('scripts', function() {
  gulp.src('./src/scripts/*.js')
    .pipe(concat('script.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./build/scripts/'));  
});

// prefix, compile, and compress SASS
gulp.task('sass', function () {
  gulp.src(['./src/styles/*.scss','./src/styles/*.sass'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/styles'))
    .pipe(livereload());
});


// default gulp task
gulp.task('default', ['jshint','htmlpage','scripts','sass'],function() {
  livereload.listen();
  // watch for HTML changes
  gulp.watch('./src/*.html', function() {
    gulp.run('htmlpage');
  });

  // watch for JS changes
  gulp.watch('./src/scripts/*.js', function() {
    gulp.run('jshint', 'scripts');
  });

  // watch for Sass/css changes
  gulp.watch(['./src/styles/*.scss','./src/styles/*.sass'], function() {
    gulp.run('sass');
  });

});
