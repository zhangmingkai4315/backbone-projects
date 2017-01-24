var gulp = require('gulp'),
    connect = require('gulp-connect'),
    browserify=require('gulp-browserify'),
    open=require('gulp-open');
var port=process.env.port||3000;

// 创建一个支持reload的服务器
gulp.task('connect',function () {
  connect.server({
    root:'./',
    port:port,
    livereload:true
  });
});

// 使用browserify处理脚本
gulp.task('build', function() {
    // Single entry point to browserify 
    gulp.src('./public/js/app.js')
        .pipe(browserify())
        .pipe(gulp.dest('./public/dist'))
});
// 当js文件发生变化的时候启动浏览器reload
gulp.task('reload',function () {
  gulp.src('./public/js/**/*.js').pipe(connect.reload());
});

gulp.task("watch",function () {
  gulp.watch('./public/js/**/*.js',['build','reload']);
  gulp.watch('./*.html',['reload']);
});
gulp.task('default',['connect','watch']);