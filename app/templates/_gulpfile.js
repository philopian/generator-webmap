var gulp 		= require('gulp');
var connect 	= require('gulp-connect');
var livereload 	= require('gulp-livereload');

var minifyHTML      = require('gulp-minify-html')
var concat          = require('gulp-concat');
var mainBowerFiles  = require('main-bower-files');
var order           = require('gulp-order');
var uglifycss       = require('gulp-uglifycss');
var gulpFilter      = require('gulp-filter');
var minifyCSS       = require('gulp-minify-css');
var uglify          = require('gulp-uglify')
var minify          = require('gulp-minify')
var replace         = require('gulp-replace');
var htmlreplace     = require('gulp-html-replace');


//--Dev Mode (web-server/livereload) ---------------------------
gulp.task('webserver', function() {
	connect.server({
        root: 'www',
	    port: 8080
	});
});
gulp.task('index', function() {
  return gulp.src(__dirname+'/www/index.html')
             .pipe(livereload());
});
gulp.task('watch', function() {
	livereload.listen();
    var watchAllTheseFiles = [
        __dirname+'/www/index.html',
        __dirname+'/www/js/*.js',
        __dirname+'/www/js/**/*.js',
        __dirname+'/www/css/*.css',
        __dirname+'/www/css/**/*.css',
    ]
    gulp.watch(watchAllTheseFiles, ['index']);
})
gulp.task('default', ['webserver', 'watch']);
gulp.task('serve', ['webserver', 'watch']);



//--Build HTML files--------------------
gulp.task('buildIndexHtml', function() {
    var opts = {
        empty:false,
        cdata:false,
        comments:false,
        conditionals:false,
        spare:false,
        quotes:true,
        loose: false
    };

    // regex pattern
    var regexBowerCss   = /<!-- bower:css -->([\s\S]*?)<!-- endbower -->/g;
    var regexBowerJs    = /<!-- bower:js -->([\s\S]*?)<!-- endbower -->/g;

    // Replace with
    var addBowerCss   = '<link rel="stylesheet" href="./css/vendors.css">';
    var addBowerJs    = '<script src="./js/vendors.js"></script>';

    return gulp.src('./www/index.html')
        .pipe(replace(regexBowerCss, addBowerCss))
        .pipe(replace(regexBowerJs, addBowerJs))
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./dist/'));
});
gulp.task('copyAssets', function() {
    return gulp.src(['./www/assets/*/**', "./www/spatial_data/geojson/**"],{ "base" : "./www" })
               .pipe(gulp.dest('./dist/'));
});


//--Build CSS files--------------------
gulp.task('buildCssVendors', function() {
    var cssFiles = ['./www/bower_components/*'];
    return gulp.src(mainBowerFiles().concat(cssFiles))
        .pipe(gulpFilter('*.css'))
        .pipe(order([
            'normalize.css',
            '*'
        ]))
        .pipe(concat('vendors.css'))
        .pipe(minifyCSS({keepSpecialComments:0}))
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('copyBootstrapGlyphs', function() {
    return gulp.src(['./www/bower_components/bootstrap/fonts/*'])
    		   .pipe(gulp.dest('./dist/fonts/'));
});
gulp.task('clientCss',function(){
    return gulp.src(['./www/css/styles.css'])
               .pipe(minifyCSS({keepSpecialComments:0}))
               .pipe(gulp.dest('./dist/css'));
});


//--Build JS files--------------------
gulp.task('buildJsVendors', function() {
    var jsFiles = ['./www/bower_components/*'];

    return gulp.src(mainBowerFiles().concat(jsFiles))
        .pipe(gulpFilter('*.js'))
        .pipe(concat('vendors.js'))
        // .pipe(minify())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});
gulp.task('clientJs',function(){
    return gulp.src(['./www/js/scripts.js'])
               // .pipe(minify('scripts.js'))
               .pipe(uglify())
               .pipe(gulp.dest('./dist/js'));
});


gulp.task('build', ['buildIndexHtml', 'clientCss','clientJs','buildCssVendors', 'buildJsVendors', 'copyBootstrapGlyphs', 'copyAssets']);