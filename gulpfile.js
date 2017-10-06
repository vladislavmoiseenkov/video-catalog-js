var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    concatCss = require('gulp-concat-css'),
    connect = require('gulp-connect'),
    minifyCss = require('gulp-clean-css');

var path = {

    css: {
        watch: 'src/styles/**/*.scss',
        src: 'src/styles/**/*.scss',

        buildDir: 'www/css/',
        buildFile: 'styles.css',
        buildLibsFile: 'libs.min.css'
    },

    js: {
        src: [
            'src/scripts/**/*.js'
        ],

        buildDir: 'www/js/',
        buildAppFile: 'app.js',
        buildLibsFile: 'libs.min.js'
    }
};

var libs = {
    js: [
        'node_modules/angular/angular.js',
        'node_modules/jquery/dist/jquery.js',
        'node_modules/@uirouter/angularjs/release/angular-ui-router.js',
        'node_modules/@uirouter/angularjs/release/stateEvents.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
    ],

    css: [
        'node_modules/bootstrap/dist/css/bootstrap.css'
    ]
};

// *** *** *** MAIN TASKS *** *** ****

var tasks = [
    'build:css',
    'build:js:libs',
    'build:css:libs',
    'build:js',
    'connect'
];

var devTasks = tasks.concat('watch');

gulp.task('default', tasks);

gulp.task('dev', devTasks);

gulp.task('watch', function () {

    gulp.watch(path.css.watch, ['build:css']);

    gulp.watch(path.js.src, ['build:js']);

});

gulp.task('build:css', function () {
    return gulp.src(path.css.src)
        .pipe(sass())
        .pipe(concatCss(path.css.buildFile))
        .pipe(gulp.dest(path.css.buildDir))
        .pipe(minifyCss())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(path.css.buildDir));
});

gulp.task('build:js', function() {
    return gulp.src(path.js.src)
        .pipe(concat(path.js.buildAppFile))
        .pipe(gulp.dest(path.js.buildDir))

        .pipe(uglify({ mangle: false }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(path.js.buildDir));
});

gulp.task('build:js:libs', function() {
    return gulp.src(libs.js)
        .pipe(concat(path.js.buildLibsFile))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest(path.js.buildDir));
});

gulp.task('build:css:libs', function() {
    return gulp.src(libs.css)
        .pipe(concat(path.css.buildLibsFile))
        .pipe(minifyCss())
        .pipe(gulp.dest(path.css.buildDir));
});

gulp.task('connect', function() {
    connect.server({
        port: 8000
    });
});