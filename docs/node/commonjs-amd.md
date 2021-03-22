# CommonJS and AMD

## CommonJS 规范

CommonJS 是以在浏览器环境之外构建 JavaScript 生态系统为目标而产生的项目，比如在服务器和桌面环境中。

这个项目最开始是由 Mozilla 的工程师 Kevin Dangoor 在 2009 年 1 月创建的，当时的名字是 ServerJS。

> 我在这里描述的并不是一个技术问题，而是一件重大的事情，让大家走到一起来做决定，迈出第一步，来建立一个更大更酷的东西。 —— Kevin Dangoor's [What Server Side JavaScript needs](http://www.blueskyonmars.com/2009/01/29/what-server-side-javascript-needs/)

2009 年 8 月，这个项目改名为 CommonJS，以显示其 API 的更广泛实用性。CommonJS 是一套规范，它的创建和核准是开放的。这个规范已经有很多版本和具体实现。CommonJS 并不是属于 ECMAScript TC39 小组的工作，但 TC39 中的一些成员参与 CommonJS 的制定。2013 年 5 月，Node.js 的包管理器 NPM 的作者 Isaac Z. Schlueter 说 [CommonJS 已经过时，Node.js 的内核开发者已经废弃了该规范](https://github.com/nodejs/node-v0.x-archive/issues/5132#issuecomment-15432598)。

CommonJS 规范是为了解决 JavaScript 的作用域问题而定义的模块形式，可以使每个模块它自身的命名空间中执行。该规范的主要内容是，模块必须通过 `module.exports` 导出对外的变量或接口，通过 `require()` 来导入其他模块的输出到当前模块作用域中。

一个直观的例子：

```js
// moduleA.js
module.exports = function(value) {
  return value * 2;
};
```

```js
// moduleB.js
var multiplyBy2 = require("./moduleA");
var result = multiplyBy2(4);
```

CommonJS 是同步加载模块，但其实也有浏览器端的实现，其原理是现将所有模块都定义好并通过 `id` 索引，这样就可以方便的在浏览器环境中解析了，可以参考 [require1k](https://github.com/Stuk/require1k) 和 [tiny-browser-require](https://github.com/ruanyf/tiny-browser-require) 的源码来理解其解析（resolve）的过程。

更多关于 CommonJS 规范的内容请查看 [http://wiki.commonjs.org/wiki/CommonJS](http://wiki.commonjs.org/wiki/CommonJS)。

## AMD 规范

AMD（异步模块定义）是为浏览器环境设计的，因为 CommonJS 模块系统是同步加载的，当前浏览器环境还没有准备好同步加载模块的条件。

AMD 定义了一套 JavaScript 模块依赖异步加载标准，来解决同步加载的问题。

模块通过 `define` 函数定义在闭包中，格式如下：

```js
define(id?: String, dependencies?: String[], factory: Function|Object);
```

`id` 是模块的名字，它是可选的参数。

`dependencies` 指定了所要依赖的模块列表，它是一个数组，也是可选的参数，每个依赖的模块的输出将作为参数一次传入 `factory` 中。如果没有指定 `dependencies`，那么它的默认值是 `["require", "exports", "module"]`。

```js
define(function(require, exports, module) {}）
```

`factory` 是最后一个参数，它包裹了模块的具体实现，它是一个函数或者对象。如果是函数，那么它的返回值就是模块的输出接口或值。

一些用例：

定义一个名为 `myModule` 的模块，它依赖 `jQuery` 模块：

```js
define("myModule", ["jquery"], function($) {
  // $ 是 jquery 模块的输出
  $("body").text("hello world");
});
// 使用
require(["myModule"], function(myModule) {});
```

注意：在 webpack 中，模块名只有局部作用域，在 Require.js 中模块名是全局作用域，可以在全局引用。

定义一个没有 `id` 值的匿名模块，通常作为应用的启动函数：

```js
define(["jquery"], function($) {
  $("body").text("hello world");
});
```

依赖多个模块的定义：

```js
define(["jquery", "./math.js"], function($, math) {
  // $ 和 math 一次传入 factory
  $("body").text("hello world");
});
```

模块输出：

```js
define(["jquery"], function($) {
  var HelloWorldize = function(selector) {
    $(selector).text("hello world");
  };

  // HelloWorldize 是该模块输出的对外接口
  return HelloWorldize;
});
```

在模块定义内部引用依赖：

```js
define(function(require) {
  var $ = require("jquery");
  $("body").text("hello world");
});
```

原文地址：[CommonJS 规范](https://zhaoda.net/webpack-handbook/commonjs.html)
