var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../config').watch;

gulp.task('watch',function() {
  gulp.watch(config.ejs + '**/*.ejs', ['ejs']);
  gulp.watch(config.html + '**/*.html', ['html']);
  gulp.watch(config.sass + '**/*.scss', ['sass']);
  gulp.watch(config.ts + '**/*.ts', ['typescript']);

  gulp.watch([
      config.html + '**/*.html',
      config.html + '**/*.php',
      config.css + '**/*.css'
    ], function() {
      browserSync.reload();
    }
  );
});
