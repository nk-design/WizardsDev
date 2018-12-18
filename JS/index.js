const gulp = require('gulp');
gulp.task('hello',()=>{
	console.log('Hello');
});

gulp.task('task_name',()=>{
	return gulp.src('source-files')
	.pipe(plugin_exmpl())
	.pipe(gulp.dest('destination'))
})