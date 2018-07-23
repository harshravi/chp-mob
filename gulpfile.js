var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('default', function () {
    return gulp.src('src/**/*.spec.ts')
        .pipe(clean({ force: true }))
        .pipe(gulp.dest('dist'));
});