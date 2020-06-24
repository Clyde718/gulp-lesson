const gulp = require('gulp');                         // Инициализация Gulp
const concat = require('gulp-concat');                // Инициализация gulp-concat
const autoprefixer = require('gulp-autoprefixer');    // Инициализация autoprefixer
const cleanCSS = require('gulp-clean-css');           // Минификация CSS
const uglify = require('gulp-uglify');                // минификация JS
const del = require('del');                           // Инициализация предварительной очистки 
const browserSync = require('browser-sync').create(); // Инициализация browser-sync
const imagemin = require('gulp-imagemin');            // Сжатие изображений


// Массив css файлов которые будут конкатенированны в один - соблюдается порядок подключения
const cssFiles = [
  './src/css/style.css',
  './src/css/media.css'
]
// Массив js файлов которые будут конкатенированны в один - соблюдается порядок подключения
const jsFiles = [
  './src/js/lib.js',
  './src/js/main.js'
]


gulp.task('styles', () => {
  return gulp.src(cssFiles)
    .pipe(concat('style.css'))      // Объединение файлов в один
    .pipe(autoprefixer({            // проставление автопрефиксов
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    //
    .pipe(cleanCSS({                // Минификация файлов css 
      level: 2
    }))
    // 
    .pipe(gulp.dest('./build/css')) // Выходная папка для стилей - то куда конечный файл будет положен
    .pipe(browserSync.stream())     // после проделанных манипуляций browserSync обновит сервер 
});


gulp.task('scripts', () => {
  return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(uglify({                  // Минификация JS файлов
      toplevel: true                // Настройка - максимальный уровень минификации
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
});


gulp.task('del', () => {            // Запуск задачи на удаление содержимого папки del 
  return del(['build/*'])
});


gulp.task('gulp-imagemin', () => {
  return gulp.src('./src/img/**')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./build/img/'))
})


gulp.task('watch', () => {          // ТАск для отслеживания изменений
  browserSync.init({                // запуск сервера
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('./src/img/**', gulp.series('gulp-imagemin'))
  gulp.watch('./src/css/**/*.css', gulp.series('styles'))       // Следить за CSS файлами и при изменении запускать функ styles
  gulp.watch('./src/js/**/*.js', gulp.series('scripts'))        // Следить за JS файлами и при изменении запускать функ scripts
  gulp.watch("./*.html").on('change', browserSync.reload)       // Следить за html и при изменении перезагружать сервер 
});


gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts', 'gulp-imagemin'), 'watch'))





// gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)))
// Запускает последовательно сначала очистку, потом styles, scripts

// gulp.task('dev', gulp.series('build', 'watch'))
// Запускает последовательно сначала build, потом watch