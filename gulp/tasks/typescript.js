var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

var config = require('../config').typeScript;

gulp.task('typescript', function() {
  Object.keys(config.path).forEach(function(key) {
    var tsOptions = {
      out: key + '.js',
      target: 'es5',
      module: 'system',
      sourceMap: true,
      noImplicitAny: true,
      removeComments: true,
    };

    var val = this[key];
    gulp.src(val)
      .pipe(plumber({
          errorHandler: notify.onError("Error: &lt;%= error.message %&gt;")
      }))
      .pipe(typescript(tsOptions))
      .pipe(gulp.dest(config.js));
  }, config.path);
});
