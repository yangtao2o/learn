# Gulp@4 使用再总结

## 配置

### tree

```tree
.
├── README.md
├── _locales
│   ├── en
│   │   └── messages.json
│   └── zh_CN
│       └── messages.json
├── gulpfile.js
├── package.json
└── src
    ├── assets
    │   ├── css
    │   │   ├── demo-extensions.css
    │   │   └── demo-popup.css
    │   ├── img
    │   │   ├── icon.png
    │   │   ├── icon128.png
    │   │   ├── icon16.png
    │   │   ├── icon32.png
    │   │   └── icon48.png
    │   └── js
    │       ├── jquery-ui.min.js
    │       ├── jquery.min.js
    │       └── mousetrap.min.js
    ├── background.js
    ├── content.js
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    └── tool.js
```

### gulpfile.js

```js
const { src, dest, series, parallel } = require('gulp')
const moment = require('moment')
const zip = require('gulp-zip')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const cssmin = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const clean = require('gulp-clean')

const uglifyOptions = {
  // toplevel: true,
  // compress: {
  //   keep_fnames: true,
  // },
  // mangle: {
  //   reserved: ['resizeCanvas', 'webCapture', 'format', 'getZIndex'],
  //   // toplevel: true,
  // },
}
const config = {
  input: {
    src: 'src/',
    plugin: ['src/assets/js/*'],
    img: ['src/assets/img/*'],
    css: ['src/assets/css/*'],
    js: ['src/*.js'],
    html: ['src/*.html'],
    locale: ['src/_locales/**/*'],
  },
  output: {
    dist: 'dist/',
    css: 'dist/assets/css/',
    img: 'dist/assets/img/',
    plugin: 'dist/assets/js/',
    locale: 'dist/_locales/',
  },
}

// html 压缩
function minifyHtml() {
  var options = {
    collapseWhitespace: true,
    removeComments: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
  }
  return src(config.input.html).pipe(htmlmin(options)).pipe(dest(config.output.dist))
}

// javascript 压缩
function minifyJs() {
  return src(config.input.js).pipe(babel()).pipe(uglify(uglifyOptions)).pipe(dest(config.output.dist))
}

function minifyStyle() {
  return src(config.input.css).pipe(cssmin()).pipe(dest(config.output.css))
}

function minifyImg() {
  return src(config.input.img).pipe(imagemin()).pipe(dest(config.output.img))
}

// 压缩为 zip 结尾
function gulpZip() {
  var timeStamp = moment().format('YYYY-MM-D_HH-mm-ss')
  return src(config.output.dist + '**/*')
    .pipe(zip('Billfish_' + timeStamp + '.zip'))
    .pipe(dest('zip'))
}

// 直接复制不需要打包的文件
function copyFiles() {
  // js
  src(config.input.plugin).pipe(dest(config.output.plugin))
  // img
  src(config.input.img).pipe(dest(config.output.img))
  // locales
  src(config.input.locale).pipe(dest(config.output.locale))
  // manifest
  return src(config.input.src + 'manifest.json').pipe(dest(config.output.dist))
}

// 清空 dist 目录下文件
function removeFiles() {
  return src(config.output.dist, { read: false, allowEmpty: true }).pipe(clean())
}

exports.html = minifyHtml
exports.js = minifyJs
exports.css = minifyStyle
exports.img = minifyImg
exports.remove = removeFiles
exports.zip = gulpZip

exports.build = series(removeFiles, parallel(minifyHtml, minifyStyle, minifyJs, copyFiles))
```

使用 Babel，还需要在项目根目录下配置 `.babelrc`，如：

```json
{
  "presets": ["@babel/preset-env"]
}
```

### devDependencies

```json
{
  "devDependencies": {
    "@babel/core": "^7.10.4",
    "@babel/preset-env": "^7.10.4",
    "gulp": "^4.0.2",
    "gulp-babel": "^8.0.0-beta.2",
    "gulp-clean": "^0.4.0",
    "gulp-clean-css": "^4.3.0",
    "gulp-htmlmin": "^5.0.1",
    "gulp-imagemin": "^7.1.0",
    "gulp-uglify": "^3.0.2",
    "gulp-zip": "^5.0.2",
    "moment": "^2.27.0"
  }
}
```

### scripts

```json
{
  "scripts": {
    "build": "gulp build",
    "zip": "gulp build && gulp zip"
  }
}
```

## 参考资料

- [gulp 自动化打包（上）](https://cloud.tencent.com/developer/article/1435295)
