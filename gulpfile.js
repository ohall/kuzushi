var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cp = require('child_process');

/**
 * Compile and minify sass
 */
function styles() {
  return gulp
    .src([ '_sass/*.scss' ])
    .pipe(
      sass({
        includePaths: [ 'scss' ]
      })
    )
    .pipe(prefix([ 'last 3 versions', '> 1%', 'ie 8' ], { cascade: true }))
    .pipe(rename('main.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(gulp.dest('assets/css'));
}

function stylesVendors() {
  return gulp
    .src([ '_sass/vendors/*.css' ])
    .pipe(concat('vendors.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(gulp.dest('assets/css'));
}

/**
 * Compile and minify js
 */
function scripts() {
  return gulp
    .src([ '_js/app.js' ])
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(gulp.dest('assets/js'));
}

function scriptsVendors() {
  return gulp
    .src([ '_js/vendors/*.js' ])
    .pipe(concat('vendors.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(gulp.dest('assets/js'));
}


/**
 * Build Jekyll site
 */
function jekyll(done) {
  return cp
    .spawn(
      'bundle',
      [
        'exec',
        'jekyll',
        'build',
        '--incremental',
        '--config=_config.yml,_config_dev.yml'
      ],
      {
        stdio: 'inherit'
      }
    )
    .on('close', done);
}


var compile = gulp.parallel(styles, stylesVendors, scripts, scriptsVendors);
var serve = gulp.series(compile, jekyll);

/**
 * Default task, running just `gulp` will compile the sass,
 */
gulp.task('default', gulp.parallel(serve));
