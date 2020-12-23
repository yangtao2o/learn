# Sass 项目文件结构管理

## 构建样式结构体系

Sass 的`@import`命令，可以让我们把样式内容根据内容属性进行分类，分割成多个文件，如同使用 ES6 模块导入一样，非常有利于我们根据样式所属类别进行模块开发。如下所示就是一个完整的树形视图：

```tree
styles
├── layout
│   └── _layout.scss
├── mixins
│   └── _mixins.scss
├── site
│   ├── _footer.scss
│   ├── _header.scss
│   ├── _homepage.scss
│   ├── _site.scss
│   ├── _tpl.scss
│   ├── _user-agent.scss
│   └── _user-login.scss
├── styles.scss
└── variables
    ├── _colors.scss
    ├── _fonts.scss
    ├── _layouts.scss
    └── _variables.scss
```

在根目录底下只有一个`styles.scss`文件，其他`.scss`文件都根据不同的分类放在对应的文件夹中。

我们把局部内容文件通过下划线来表示，如`_layouts.scss`，只有通过`@import`引入才会被编译成`.css`文件。

## 文件内容创建

### 入口

`styles/styles.scss`，从上到下，注意引入前后的顺序：

```css
/* Base */
@import 'variables/variables';
@import 'mixins/mixins';

/* Layout */
@import 'layout/layout';

/* Content */
@import 'site/site';
```

### Variables

入口 `variables/_variables`：

```css
@import 'colors';
@import 'fonts';
@import 'layouts';
```

比如 `variables/_colors.scss`：

```css
// Theme
$color__theme: #12bb37;
$color__theme-hover: #2cce51;

$color__white: #fff;

// Text
$color__text-white: #fff;
$color__text-main: #1a1a1a;
$color__text-sub: #4a4d52;
$color__text-third: #5d6063;
$color__text-light: #91969d;
$color__text-hover: $color__theme;
$color__text-input-focus: $color__theme;

// Links
$color__link: $color__theme;
$color__link-visited: $color__theme;

// Borders
// ...
```

### Mixins

`mixins/_mixins.scss`:

```css
@mixin flex(
  $direction: row,
  $justify: center,
  $align: center,
  $flex-wrap: wrap
) {
  display: -webkit-flex;
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
  flex-wrap: $flex-wrap;
}

/* Center block */
@mixin center-block {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Clearfix */
@mixin clearfix() {
  content: '';
  display: table;
  table-layout: fixed;
}

// Clear after (not all clearfix need this also)
@mixin clearfix-after() {
  clear: both;
}

@mixin ellipse() {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@mixin selection {
  ::-moz-selection {
    @content;
  }
  ::selection {
    @content;
  }
}
```

### Layout

`layout/_layout.scss`:

```css
html,
body {
  padding: 0;
  margin: 0;
  color: $color__text-main;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', tahoma,
    'hiragino sans GB', arial, 'Microsoft YaHei', sans-serif;
}
```

### Content

`site/_site.scss`:

```css
@import 'header';
@import 'footer';
@import 'user-login';
@import 'user-agent';
@import 'homepage';
@import 'tpl';
```

当然，还可以根据页面内容更进一步细分，如：

```css
@import 'common/header';
@import 'primary/homepage';
@import 'primary/tpl';
@import 'common/footer';
```

树形视图：

```tree
├── site
│   ├── _site.scss
│   ├── common
│   │   ├── _footer.scss
│   │   └── _header.scss
│   └── primary
│       └── _homepage.scss
│       └── _tpl_.scss
```

## 比较完整的目录结构

```tree
├── sass
│   ├── base
│   ├── components
│   ├── helpers
│   ├── layout
│   ├── main.scss
│   ├── pages
│   ├── themes
│   └── vendors
```

## 参考链接

- [管理 Sass 项目文件结构](https://www.w3cplus.com/preprocessor/architecture-sass-project.html)
