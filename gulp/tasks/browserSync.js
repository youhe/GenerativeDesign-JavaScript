var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../config').browserSync;

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: config.html
    }
  });
});

gulp.task('browserSync_y', function() {
  browserSync({
    proxy: config.proxy,
    ghostMode: {
      location: true
    }
  });
});
