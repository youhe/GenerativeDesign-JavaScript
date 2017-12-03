var gulp = require('gulp');
var requireDir = require('require-dir');
var config = require('./gulp/config').watch;

requireDir('./gulp/tasks', {recurse: true});

gulp.task('default', ['watch', 'browserSync']);
gulp.task('y', ['watch', 'browserSync_y']);
