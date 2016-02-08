'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const nodemon = require('gulp-nodemon');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const envify = require('envify/custom');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('app/config');

var IS_DEVELOPMENT = !config.server.isProduction();

// add custom browserify options here
const browserifyOptions = {
  entries: ['app/client/index.js'],
  extensions: ['.jsx'],
  debug: IS_DEVELOPMENT
};
const opts = Object.assign({}, watchify.args, browserifyOptions);
var bundler = browserify(opts);
bundler.transform(babelify.configure({presets: [
  'react', 'es2015'
]}));

bundler.transform(envify({
  NODE_ENV: process.env.NODE_ENV || 'development'
}));

var uglify = function() {
  return $.uglify().on('error', $.util.log);
};

function bundle() {
  return bundler.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
      .pipe(IS_DEVELOPMENT ?
        $.sourcemaps.init({loadMaps: true}) : $.util.noop())
      .pipe(IS_DEVELOPMENT ? $.util.noop() : uglify())
      .pipe($.filesize())
      .pipe(IS_DEVELOPMENT ? $.sourcemaps.write('./') : $.util.noop())
    .pipe(gulp.dest(config.server.PUBLIC_PATH));
}

bundler.on('log', $.util.log); // output build logs to terminal
gulp.task('bundle', bundle); // so you can run `gulp js` to build the file

gulp.task('development', function() {
  IS_DEVELOPMENT = true;
  bundler = watchify(bundler);
  bundler.on('update', bundle); // on any dep update, runs the bundler
  return;
});

gulp.task('production', function() {
  IS_DEVELOPMENT = false;
  return;
});

gulp.task('lint', function() {
  return gulp.src([
    'app/**/*.js', '!app/public/**'
  ])
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe($.eslint.results(function(results) {
    // Called once for all ESLint results.
    $.util.log('Total Results: ' + results.length);
    $.util.log('Total Warnings: ' + results.warningCount);
    $.util.log('Total Errors: ' + results.errorCount);
  }));
});

gulp.task('nodemon', ['lint'], function(cb) {
  var started = false;
  return nodemon({
    script: 'app/server/server.js',
    verbose: true,
    ignore: [
      '.git/*',
      'README.md',
      'gulpfile.js',
      'app/client/**/*',
      'app/assets/**/*',
      'app/public/**/*',
      'app/maintenance/**/*',
      'test/**/*',
      'docs/**/*'
    ],
    execMap: {
      js: 'BLUEBIRD_WARNINGS=0 NODE_ENV=development node --harmony'
    }
  }).on('start', function() {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

const vendors = ['bower_components/pure/pure-min.css'];
const vendorsDev = ['bower_components/pure/pure.css'];

gulp.task('styles:vendors', () => {
  const vendorsSource = IS_DEVELOPMENT ? vendorsDev : vendors;
  return gulp.src(vendorsSource)
    // .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe($.concat('vendor.css'))
    .pipe($.filesize())
    .pipe(gulp.dest(config.server.PUBLIC_PATH + '/lib'));
});

const clientCSS = [
  'app/client/styles/**/*.css'
];

gulp.task('styles', ['styles:vendors'], function() {
  return gulp.src(clientCSS)
  .pipe(IS_DEVELOPMENT ? $.sourcemaps.init({loadMaps: true}) : $.util.noop())
  .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
  .pipe($.concat('app.css'))
  .pipe(IS_DEVELOPMENT ? $.util.noop() : $.cssnano())
  .pipe(IS_DEVELOPMENT ? $.sourcemaps.write() : $.util.noop())
  .pipe($.filesize())
  .pipe(gulp.dest(config.server.PUBLIC_PATH));
});

gulp.task('static:schemas', () => {
  return gulp.src(schemas)
  .pipe($.filesize())
  .pipe(gulp.dest(config.server.PUBLIC_PATH + '/schemas'));
});

const xforms = 'app/assets/xforms';

gulp.task('static:xforms', () => {
  return gulp.src(schemas)
  .pipe($.filesize())
  .pipe(gulp.dest(config.server.PUBLIC_PATH + '/xforms'));
});

const html = 'app/client/**/*.html';
const favicon = 'app/assets/favicon.ico';
const robots = 'app/assets/robots.txt';
const fonts = 'app/assets/fonts';
gulp.task('static', ['static:schemas', 'static:xforms'], () => {
  return gulp.src([html, favicon, fonts, robots])
    .pipe($.filesize())
    .pipe(gulp.dest(config.server.PUBLIC_PATH));
});

const schemas = 'app/assets/schemas/**/*';

gulp.task('styles:watch', () => gulp.watch(clientCSS, ['styles']));

gulp.task('static:watch', () =>
  gulp.watch([html, favicon, fonts, schemas], ['static'])
);

gulp.task('watch', ['static:watch', 'styles:watch']);

gulp.task('clean', () =>
  gulp.src([
    'app/public/**/*+(js|map|css|html|ico|txt)',
    'app/public/schemas',
    'app/public/xforms',
    'app/public/fonts',
    'app/public/lib',
  ], {read: false})
    .pipe($.rimraf())
);

gulp.task('default',
  ['development', 'nodemon', 'watch', 'bundle', 'static', 'styles']
);

gulp.task('build',
  ['production', 'bundle', 'styles', 'static']
);
