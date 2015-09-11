var gulp = require('gulp');
var async = require('async');
var util = require('./lib/util');
var copy = require('gulp-copy');
var less = require('gulp-less');
var ejs = require('gulp-ejs');
var ejshelper = require('tmt-ejs-helper');
var minifyCSS = require('gulp-minify-css');
var tmtsprite = require('gulp-tmtsprite');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var usemin = require('gulp-usemin2');
var uglify = require('gulp-uglify');
var del = require('del');
var webp = require('./common/webp');
var rev = require('gulp-rev');
var bs = require('browser-sync').create();

module.exports = function (gulp, config) {

    //build_release
    gulp.task('release',['dist'], function (cb) {

        async.series([
            function (cb) {
                del(['./release'], cb);
            },
            function (cb){
                gulp.src(['./dist/css/*.css', './dist/js/*.js'])
                .pipe(gulp.dest('./release'))
                .pipe(rev())
                .on('end',function(){
                    util.task_log('md5');
                    cb();
                })

            },
            function (cb){
                bs.init({
                    server: './release',
                    port: config['livereload']['port'] || 8080,
                    startPath: config['livereload']['startPath'] || '/html',
                    reloadDelay: 500,
                    files: ['./dev/css/style-*.css', './src/html/**/*.*']
                });
            }

        ], function () {
            util.load_plugin('release');
            cb(null);
        })
    });
};

