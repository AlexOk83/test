'use strict';

import gulp from 'gulp';
import less from'gulp-less';
import pug from'gulp-pug';
import browserSync from'browser-sync';
import autoprefixer from'gulp-autoprefixer';
import cleanCSS from'gulp-clean-css';
import concat from'gulp-concat';
import plumber from'gulp-plumber';
import pugLinter from'gulp-pug-linter';

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