/**
 * METHODE 1 :
 *	- Init : npm init (puis tout valider avec "entree", cela va creer un fichier package.json a la racine)
 *	- Installer gulp			: npm install gulp --save-dev
 *	- Installer gulp-compass	: npm install gulp-compass --save-dev (cf : https://www.npmjs.com/package/gulp-compass)
 *	- Installer gulp-uglify		: npm install gulp-uglify --save-dev (cf : https://www.npmjs.com/package/gulp-uglify)
 *	- Installer gulp-plumber	: npm install gulp-plumber --save-dev (cf https://www.npmjs.com/package/gulp-plumber)
 *		- Permet de ne pas stopper le watcher s'il detecte une erreur de code.
 *
 *	- Installer ruby : http://rubyinstaller.org/ (pour windows)
 *	- Installer compass : gem install compass (source : http://thesassway.com/beginner/getting-started-with-sass-and-compass)
 *
 *	- Installer lodash (optionnel) : npm install -g lodash (ou npm install lodash --save-dev)
 *	
 * UTILISATION :
 *	- Executer la fonction "default" : 
 *		- gulp 
 *		- ou
 *		- gulp default 
 *		- Execute un tableau de fonction, ici uniquement ['compass'], mais on peut faire ['compass', 'minify', 'etc']. Attention toutes les fonctions du tableau sont execute en meme temps, puis celles dans la fonction.
 *	- ou Executer la fonction "compass" seule : 
 *		- gulp compass
 *	- ou Executer la fonction "watch" : 
 *		- gulp watch
 *		- Qui permet decouter les changements *.scss, puis de compiler en .css
 *		- Conseil : combiner avec gulp-plumber pour ne pas avoir de coupure du watcher si une erreur de code est sauvegardee. Ex : un oublie de ";".
 */

var gulp	= require('gulp'),
	plumber	= require('gulp-plumber'),
	compass	= require('gulp-compass'),
	cssmin	= require('gulp-cssmin'),
	rename	= require('gulp-rename'),
	uglify	= require('gulp-uglify');
	
// Function : compass (compilation scss vers css)
gulp.task('compass', function(){
	return gulp.src('sass/**/*.scss')	// source
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))			
		.pipe(compass({				// fonction (cf require('gulp-compass')
			css: 'css',				// option
			scss:'css',				// option
			image: 'img'			// option
		}))
		.pipe(gulp.dest('css'))// destination
});

// Function : uglify (minifier + renommer .min.js)
gulp.task('uglify', function() {
	return gulp.src('js/**/*.js')
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))	
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/js'));
});

// Function : "default" qui va appeler toutes les fonctions en meme temps du tableau (ici que ['compass'], puis lire celles dans "default"
// (ex : ['compass', 'a', 'b'])
gulp.task('default', ['compass', 'uglify'], function(){
	
	// minifier + renommer .min.css
	return gulp.src('css/**/*.css')
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/css'));
	
});

// Watcher (la commande watch est native a gulp)
gulp.task('watch', function(){
	gulp.watch( 'sass/**/*scss', ['compass']);
	gulp.watch( 'js/**/*.js', ['uglify']);
	
	// On peut le faire avec des commantaires dans le Terminal
//	gulp.watch('sass/*scss', ['compass']).on('change', function(event){
//		console.log("Note Michael:");
//		console.log(event);
//	});
});
