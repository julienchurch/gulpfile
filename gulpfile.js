require('es6-promise').polyfill();
var gulp         = require('gulp')
  , concat       = require('gulp-concat')
  , jshint       = require('jshint')
  , stylish      = require('jshint-stylish')
  , uglify       = require('gulp-uglify')
  , sass         = require('gulp-sass')
  , rename       = require('gulp-rename')
  , cssmin       = require('gulp-cssmin')
  , postcss      = require('gulp-postcss')
  , autoprefixer = require('autoprefixer');

var rawjs   = 'assets/js/'
  , rawsass = 'assets/sass/'
  , cjs     = 'static/js/'
  , css     = 'static/css/';

var postCSSProcessors = [autoprefixer({browsers: ['last 10 version']})];

gulp.task('js-hint', function() {
  gulp.src(rawjs + '*.js')
      .pipe(jshint({laxcomma: true}))
      .pipe(jshint.reporter(stylish));
});

gulp.task('compile_js-pro', function() {
  gulp.src(rawjs + '*.js')
      .pipe(uglify())
      .pipe(gulp.dest(cjs))
});

gulp.task('compile_js-dev', function() {
  gulp.src(rawjs + '*.js')
      .pipe(rename(function(path) {
        path.extname = ".dev.js"
        return path;
      }))
      .pipe(gulp.dest(cjs))
});

function compileCSS(type) {
    if (type === 'dev') {
        return gulp.src(rawsass + 'main.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss(postCSSProcessors))
            .pipe(rename('main.dev.css'))
            .pipe(gulp.dest(css));
    } else {
        return gulp.src(rawsass + 'main.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss(postCSSProcessors))
            .pipe(cssmin())
            .pipe(rename('main.css'))
            .pipe(gulp.dest(css));
    }
}

gulp.task('compile_css-dev', function() { return compileCSS('dev') });
gulp.task('compile_css-pro', function() { return compileCSS('pro') });
gulp.task('watchSASS', function() {
    gulp.watch(rawsass + '/**/*.scss', [
                               // wow this is ug
                                         'compile_css-dev'
                                       , 'compile_css-pro'
                                       ]);
});

gulp.task('watchJS', function() {
    gulp.watch(rawjs + '**/*.js', [
                                    'compile_js-dev'
                                  , 'compile_js-pro'
                                  ]);
});

gulp.task('default', ['watchSASS', 'watchJS']);
