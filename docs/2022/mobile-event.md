# 移动端事件调研

## 库

### hammer.js 识别触摸、鼠标事件等

[hammer.js](https://github.com/hammerjs/hammer.js). A JavaScript library for detecting touch gestures.

```sh
yarn add hammerjs
```

```js
import Hammer from 'hammerjs'

const hammer = new Hammer(document)
hammer.on('tab', function (e) {
  log(`tab${JSON.stringify(e, null, 2)}`)
})
```

### KeyboardJS

[KeyboardJS](https://github.com/RobertWHurst/KeyboardJS)，键盘按键监听处理。

```sh
yarn add keyboardjs
```

```js
import keyboardJS from 'keyboardjs'

keyboardJS.bind('tab', e => {
  log('tab is pressed')
})
keyboardJS.bind('enter', e => {
  log('enter is pressed')
})
```

## compositionstart 和 compositionend 事件

查看 vue 的源码 src/platforms/web/runtime/directives/model.js，有这么几行代码：

```js
export default {
  inserted(el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context)
      el._vOptions = [].map.call(el.options, getValue)
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd)
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart)
          el.addEventListener('compositionend', onCompositionEnd)
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true
        }
      }
    }
  },
}

//...

function onCompositionStart(e) {
  e.target.composing = true
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) return
  e.target.composing = false
  trigger(e.target, 'input')
}

function trigger(el, type) {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
```

## 参考资料

- [js 中 compositionstart 和 compositionend 事件](https://juejin.cn/post/6966423577168248869)
- [Web 键盘输入法应用开发指南 (3) —— 输入法事件](https://xie.infoq.cn/article/49640d0f3c0ba0d793f6b7501)
- [移动端事件（Touch 触摸和 Pointer 指针）](https://juejin.cn/post/7039723755806916638)
