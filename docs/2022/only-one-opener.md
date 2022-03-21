## 问题

如何实现多次点击同一个链接，如果此窗口已经打开，只会聚焦至已打开的窗口，而且不会重新请求，更不会再次打开多个新窗口。

比如 [GitMind](https://gitmind.cn/) 进入我的文件下点击列表，只会开启一个窗口。

## Open 语法

```js
window.open(url, windowName, [windowFeatures])
```

- url：字符串，表示新窗口的网址。如果省略，默认网址就是 about:blank。
- windowName：字符串，表示新窗口的名字。如果该名字的窗口已经存在，则占用该窗口，不再新建窗口。如果省略，就默认使用\_blank。
- windowFeatures：字符串，内容为逗号分隔的键值对（详见下文），表示新窗口的参数。如果省略，则默认打开一个完整 UI 的新窗口。如果新建的是一个已经存在的窗口，则该参数不起作用，浏览器沿用以前窗口的参数。

## Open 第二个参数

open 方法的第二个参数虽然可以指定已经存在的窗口，但是不等于可以任意控制其他窗口。

为了防止被不相干的窗口控制，浏览器只有在两个窗口同源，或者目标窗口被当前网页打开的情况下，才允许 open 方法指向该窗口。

`window.open`方法返回新窗口（子窗口）的引用，对此可以进一步操控新窗口：

```js
var windowB = window.open('windowB.html', 'WindowB')
windowB.window.name // "WindowB"
```

注意，如果新窗口和父窗口不是同源的（即不在同一个域），它们彼此不能窗口对象获取对方的内部属性。

由于 open 这个方法很容易被滥用，许多浏览器默认都不允许脚本自动新建窗口。只允许在用户点击链接或按钮时，脚本做出反应，弹出新窗口。因此，有必要检查一下打开新窗口是否成功。

```js
var popup = window.open()
if (popup === null) {
  // 新建窗口失败
}
```

## 完整示例

```html
<script type="text/javascript">
  var windowObjectReference = null // global variable

  function openRequestedPopup(strUrl, strWindowName) {
    if (windowObjectReference == null || windowObjectReference.closed) {
      windowObjectReference = window.open(strUrl, strWindowName)
    } else {
      // 切换至已打开的窗口
      windowObjectReference.focus()
    }
  }
</script>

<p>
  <a
    href="http://www.spreadfirefox.com/"
    target="PromoteFirefoxWindow"
    onclick="openRequestedPopup(this.href, this.target); return false;"
  >
    Click this to test
  </a>
</p>
```

以上代码，可以解决第二次点击之后，如果此窗口已经打开，会聚焦至已打开的窗口，而且不会重新请求，更不会再次打开新窗口。

关于自动聚焦的问题，如果不通过控制子窗口的 focus 属性，谷歌或自动切换至新页面，但是火狐就不行。所以，为了兼容，需要统一通过 focus 去聚焦。

不过，IE 包括 Edge 均不支持聚焦。已验证 GitMind 也是如此。

## 参考资料

- [window.open](https://javascript.ruanyifeng.com/bom/window.html#toc27) - 阮一峰
- [Window.open()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open) - MDN
