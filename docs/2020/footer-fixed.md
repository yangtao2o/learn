# JS 控制页面底部内容自适应

```js
// 底部固定模块
var footerFixed = (function () {
  var handler = function () {
    var $footer = $('#footer')
    var bodyHeight = $(document.body).outerHeight(true) // 正文高度
    var pageHeight = $(window).height() // 浏览器页面高度
    var footerHeight = $footer.height()

    if ($footer.hasClass('page-footer')) {
      // 当position为absolute时，body高度不包含这个元素
      if (bodyHeight + footerHeight >= pageHeight) {
        $footer.removeClass('page-footer')
      }
    } else {
      // 若没有page-bottom类，body高度包含footer
      if (bodyHeight < pageHeight) {
        $footer.addClass('page-footer')
      }
    }
  }
  handler()
  // 自适应、防抖
  $(window).resize(debounce(handler, 200))
})()

function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this,
      args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
```

添加 css:

```css
.page-footer {
  position: absolute;
  bottom: 0;
  left: 0;
}
```

## 附：节流

```js
function throttle(fn, delay, immediate, debounce) {
  var curr = +new Date(),
    last_call = 0,
    last_exec = 0,
    timer = null,
    diff,
    context,
    args,
    exec = function () {
      last_exec = curr
      fn.apply(context, args)
    }
  return function () {
    curr = +new Date()
    ;(context = this), (args = arguments), (diff = curr - (debounce ? last_call : last_exec) - delay)
    clearTimeout(timer)
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay)
      } else if (diff >= 0) {
        exec()
      }
    } else {
      if (diff >= 0) {
        exec()
      } else if (immediate) {
        timer = setTimeout(exec, -diff)
      }
    }
    last_call = curr
  }
}
```

## 参考

- [JS 控制页面底部内容自适应](https://blog.csdn.net/sunshine_xtt/article/details/97398325)
