var gulp = require('gulp');
var typescript = require('gulp-typescript');
var browserify = require('gulp-browserify');
var connect = require('gulp-connect');
var concat = require('gulp-concat');

gulp.task('server', function () {
    var serverParams = {
        root: 'build/',
        port: 9000,
        livereload: true
    };
    return connect.server(serverParams);
});

gulp.task('ts', function () {
    return gulp.src(['src/ts/**/*.ts','src/ts/Kryproeuro.ts']).pipe(typescript({
        target: 'ES5',
        experimentalDecorators: true,
        removeComments: true,
        preserveConstEnums: true
    })).pipe(concat('main.js')).pipe(gulp.dest('build/'));
});

gulp.task('assets', function () {
    return gulp.src(['index.html', 'icon.png']).pipe(gulp.dest("build/"));
});

gulp.task('default', ['browserify','ts', 'assets', 'server'], function () {
    gulp.watch(['src/**/*.ts'], ['ts']);
    gulp.watch(['index.html'], ['assets']);
});

gulp.task('browserify', function() {

    return  gulp.src('src/js/ethutil-loader.js').pipe(browserify()).pipe(gulp.dest('build/js'))
});
