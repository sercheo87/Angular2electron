var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  traceur = require('gulp-traceur'),
  sass = require('gulp-sass'),
  webserver = require('gulp-webserver'),
  electron = require('gulp-atom-electron'),
  symdest = require('gulp-symdest'),
  runElectron = require("gulp-run-electron");

var config = {
  sourceDir: 'src',
  buildDir: 'build',
  packagesDir: 'packages',
  npmDir: 'node_modules',
  bowerDir: 'bower_components'
};

// run init tasks
gulp.task('default', ['dependencies', 'js', 'html', 'css']);

gulp.task('clean', [
  'clean:build',
  'clean:package'
]);

gulp.task('clean:build', function () {
  return del(config.buildDir + '/**/*', { force: true });
});

gulp.task('clean:package', function () {
  return del(config.packagesDir + '/**/*', { force: true });
});

gulp.task('package', [
  'package:osx',
  'package:linux',
  'package:windows'
]);

gulp.task('package:osx', function () {
  return gulp.src(config.buildDir + '/**/*')
    .pipe(electron({
      version: '0.36.7',
      platform: 'darwin'
    }))
    .pipe(symdest(config.packagesDir + '/osx'));
});

gulp.task('package:linux', function () {
  return gulp.src(config.buildDir + '/**/*')
    .pipe(electron({
      version: '0.36.7',
      platform: 'linux'
    }))
    .pipe(symdest(config.packagesDir + '/linux'));
});

gulp.task('package:windows', function () {
  return gulp.src(config.buildDir + '/**/*')
    .pipe(electron({
      version: '0.36.7',
      platform: 'win32'
    }))
    .pipe(symdest(config.packagesDir + '/windows'));
});

// run development task
gulp.task('dev', ['watch', 'serve']);
gulp.task('run-electron', ['watch', 'runserver']);

// serve the build dir
gulp.task('runserver', function () {
  gulp.src('build')
    .pipe(runElectron([], { cwd: config.sourceDir + '/electron/' }));
});

// serve the build dir
gulp.task('serve', function () {
  gulp.src('build')
    .pipe(webserver({
      open: true
    }));
});

// watch for changes and run the relevant task
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.css', ['css']);
});

gulp.task('frontend', [
  'frontend:dependencies',
  'frontend:js',
  'frontend:html',
  'frontend:css',
  'frontend:sass'
]);

// move dependencies into build dir
gulp.task('frontend:dependencies', function () {
  return gulp.src([
    config.npmDir + '/traceur/bin/traceur-runtime.js',
    config.npmDir + '/systemjs/dist/system-csp-production.src.js',
    config.npmDir + '/systemjs/dist/system.js',
    config.npmDir + '/reflect-metadata/Reflect.js',
    config.npmDir + '/angular2/bundles/angular2.js',
    config.npmDir + '/angular2/bundles/angular2-polyfills.js',
    config.npmDir + '/rxjs/bundles/Rx.js',
    config.npmDir + '/es6-shim/es6-shim.min.js',
    config.npmDir + '/es6-shim/es6-shim.map',
    config.bowerDir + '/jquery/dist/jquery.min.js',
    config.npmDir + '/angular2/bundles/router.js',
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
  ])
    .pipe(gulp.dest('build/lib'));
});

// transpile & move js
gulp.task('frontend:js', function () {
  return gulp.src('src/**/*.js')
    .pipe(rename({
      extname: ''
    }))
    .pipe(traceur({
      modules: 'instantiate',
      moduleName: true,
      annotations: true,
      types: true,
      memberVariables: true
    }))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(gulp.dest('build'));
});

// move html
gulp.task('frontend:html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build'))
});

// move css
gulp.task('frontend:css', function () {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('build'))
});

gulp.task('frontend:sass', function () {
  return gulp.src(config.sourceDir + '/**/*.scss')
    .pipe(sass({
      style: 'compressed',
      includePaths: [
        config.sourceDir + '/styles',
        config.bowerDir + '/bootstrap-sass/assets/stylesheets'
      ]
    }))
    .pipe(gulp.dest(config.buildDir));
});

gulp.task('electron', function () {
  return gulp.src([
    config.sourceDir + '/electron/main.js',
    config.sourceDir + '/electron/package.json'
  ])
    .pipe(gulp.dest(config.buildDir));
});