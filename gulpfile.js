
// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const fileinclude = require('gulp-file-include');

const browserSync = require('browser-sync').create();


// File paths
const files = {
	distPath : './dist',
	distcssPath : './dist/css/**/*.css',
	disthtmlPath : './dist/**/*.html',
	scssPath : './src/scss/**/*.scss',
	htmlPath : './src/html/**/*.html',
	htmlPartialsPath : './src/htmlPartials/**/*.html',
	jsPath : './dist/js/**/*.js',
};

// Sass task: compiles the style.scss file into style.css
function scssTask(){
	var scssOptions = {
		/*
		* outputStyle (Type : String , Default : nested)
		* CSS의 컴파일 결과 코드스타일 지정
		* Values : nested, expanded, compact, compressed
		*/
		outputStyle : "expanded",
	
		/*
		* indentType (>= v3.0.0 , Type : String , Default : space)
		* 컴파일 된 CSS의 "들여쓰기" 의 타입
		* Values : space , tab
		*/
		indentType : "tab",
		
		/*
		* indentWidth (>= v3.0.0, Type : Integer , Default : 2)
		* 컴파일 된 CSS의 "들여쓰기" 의 갯수
		*/
		indentWidth : 1,
		
		/*
		* precision (Type : Integer , Default : 5)
		* 컴파일 된 CSS 의 소수점 자리수.
		*/
		precision: 8,
		
		/*
		* sourceComments (Type : Boolean , Default : false)
		* 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
		*/
		sourceComments: false,
	};

	return src(files.scssPath)
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(sass(scssOptions)) // compile SCSS to CSS
		//.pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
		.pipe(sourcemaps.write())
		.pipe(dest(files.distPath + '/css')
	); // put final CSS in dist folder
}


function fileincludeTask(){
    return src([
		files.htmlPath,
		'!./src/htmlPartials/*.html'
	])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest(files.distPath));
}



function brwosersyncTask(){
	var options = {
		browserSync: {
			server: {
				baseDir: (files.distPath),
				directory: true
			},
			open: 'external'
		}
	};
	if (true) {
		browserSync.init(options.browserSync);

		watch([files.scssPath, files.htmlPath, files.htmlPartialsPath],
			series(
				parallel(scssTask, fileincludeTask,)
			)
		);
		watch(files.htmlPath).on('change',browserSync.reload);
		watch(files.scssPath).on('change',browserSync.reload);
		watch(files.htmlPartialsPath).on('change',browserSync.reload);
		watch(files.jsPath).on('change',browserSync.reload);
	}
}


// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task

exports.default = series(
	parallel(scssTask, fileincludeTask,),
	brwosersyncTask
);