'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    pugLinter = require('gulp-pug-linter'),
    plumber = require('gulp-plumber');

const paths = {
  styles: {
    src: 'src/less/*.less',
    dest: './dist/css/'
  },
  pug: {
    src: 'src/pug/*.pug',
    dest: './dist/'
  }
}

gulp.task('lint:template', () => (
    gulp
        .src('./**/*.pug')
        .pipe(pugLinter({ reporter: 'default' }))
));

gulp.task('browser-sync', function(done) {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000,
    open: true,
    notify: false
  });

  browserSync.watch('dist/').on('change', browserSync.reload);

  done();
});

gulp.task('less', function (done) {
  gulp.src(paths.styles.src)
      .pipe(less())
      .pipe(plumber())
      .pipe(cleanCSS())
      .pipe(autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
      }))
      .pipe(concat('styles.min.css'))
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(browserSync.reload({stream: true}));

  done();
})

gulp.task('pug', function (done) {
  gulp.src(paths.pug.src)
      .pipe(pug({
        locals: '',
        pretty: true,
      }))
      .pipe(plumber())
      .pipe(gulp.dest(paths.pug.dest))
      .pipe(browserSync.reload({stream: true}));

  done();
});

gulp.task('watch', gulp.series('less', 'pug', 'lint:template', 'browser-sync', function(done) {
  gulp.watch('src/less/**/*.less', gulp.series('less'));
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/pug/**/*.pug', gulp.series('lint:template'));

  done()
}));

gulp.task('default', gulp.series('watch'));