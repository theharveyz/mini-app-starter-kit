import path from 'path';
import gulp from 'gulp';
import babel from 'gulp-babel';
import gutil from 'gulp-util';
import gulpReplace from 'gulp-replace';
import del from 'del';
import runSequence from 'run-sequence';
import npmMapping from './npm-mapping.json';
import plumber from 'gulp-plumber';

const babelTask = (src, dest) => {
	return gulp.src(src)
      .pipe(plumber())
      .pipe(gulpReplace(/\.\.\/node_modules\//g, './npm/'))
	  	.pipe(babel({
  	    presets: [
          "es2015",
          "stage-1"
        ],
  	    plugins: [
  	      "transform-decorators-legacy",
          ["transform-class-properties", { "spec": true }],
  	      [
  	        'babel-plugin-transform-builtin-extend',
  	        {
  	          globals: ['Error']
  	        }
  	      ]
  	    ]
	  })).pipe(gulp.dest(dest));
};

const fileCopy = (src, dest) => {
	return gulp.src(src).pipe(plumber()).pipe(gulp.dest(dest));
};

const getBuildCopyPath = (src) => {
	const dirName = path.resolve(path.dirname(src)); // 转换为绝对路径
	const buildPath = path.join(path.dirname(__filename), 'build');
	const srcPath = path.join(path.dirname(__filename), 'src');
	console.log(dirName, buildPath, srcPath);
	return dirName.replace(srcPath, buildPath);
};

// 清除构建好的js
gulp.task('clean-js', () => {
  return del(['build/**/*.js']).catch(console.log);
});

// 清除构建好的json
gulp.task('clean-json', () => {
  return del(['build/**/*.json']).catch(console.log);
});

// 清除构建好的wxss
gulp.task('clean-wxss', () => {
  return del(['build/**/*.wxss']).catch(console.log);
});

// 清除构建好的wxss
gulp.task('clean-wxml', () => {
  return del(['build/**/*.wxml']).catch(console.log);
});

// 清除图片
gulp.task('clean-image', () => {
  return del(['build/**/*.png',
    'build/**/*.jpg',
    'build/**/*.jpeg',
    'build/**/*.gif',
  ]).catch(console.log);
});
// clean build npm
// gulp.task('clean-npm-lib', () => {
//   return gulp.src(['build/npm/**/*.js'], {read: false}).pipe(clean());
// });

// clean
gulp.task('clean', () => {
  return del(['build']).catch(console.log);
});

// babel解释
// node_modules => ./build/npm/*/xxxx.js
gulp.task('babel', () => {
  return babelTask(['src/**/*.js'], 'build');
});

// wxml copy
gulp.task('copy-wxml', () => {
	return fileCopy(['src/**/*.wxml'], 'build');
});

// json copy
gulp.task('copy-json', () => {
	return fileCopy(['src/**/*.json'], 'build');
});

// wxss copy
gulp.task('copy-wxss', () => {
	return fileCopy(['src/**/*.wxss'], 'build');
});

gulp.task('copy-image', () => {
  return fileCopy(['src/**/*.png',
    'src/**/*.jpg',
    'src/**/*.jpeg',
    'src/**/*.gif',
  ], 'build');
});

// npm包安装
gulp.task('copy-npm', () => {
	if (npmMapping && npmMapping.length > 0) {
		npmMapping.forEach((npm) => {
			fileCopy(npm.src, npm.dest);
		});
	}
});

// copy
gulp.task('copy', () => {
	return runSequence('copy-npm', 'copy-json', 'copy-wxml', 'copy-wxss', 'copy-image');
});

// gulp的task并不是串行的执行，所以这里要用runSequence来控制串行
// watch 监听
gulp.task('watch', () => {
	gulp.watch('./src/**/*.json', (event) => {
		fileCopy(event.path, getBuildCopyPath(event.path));
	});
	gulp.watch('./src/**/*.wxml', (event) => {
		fileCopy(event.path, getBuildCopyPath(event.path));
	});
	gulp.watch('./src/**/*.wxss', (event) => {
		fileCopy(event.path, getBuildCopyPath(event.path));
	});
  gulp.watch('./src/**/*.(png|jpeg|jpg|gif)', (event) => {
    fileCopy(event.path, getBuildCopyPath(event.path));
  });
	return gulp.watch('./src/**/*.js', (event) => {
		babelTask(event.path, getBuildCopyPath(event.path));
		runSequence('copy-npm');
	});
});

// run-sequence 的task里有使用run-sequence 可能会有问题
gulp.task('build', () => {
	return runSequence('clean', 'babel', 'copy');
})

gulp.task('default', ['build'], () => {});

process.on('UncaughtException', console.log);
