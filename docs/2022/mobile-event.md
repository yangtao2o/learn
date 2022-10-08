# 移动端事件调研

## 库

### hammer.js 识别触摸、鼠标事件等

[hammer.js](https://github.com/hammerjs/hammer.js). A JavaScript library for detecting touch gestures.

```sh
yarn add hammerjs
```

```js
import Hammer from "hammerjs";

const hammer = new Hammer(document);
hammer.on("tab", function (e) {
  log(`tab${JSON.stringify(e, null, 2)}`);
});
```

### KeyboardJS

[KeyboardJS](https://github.com/RobertWHurst/KeyboardJS)，键盘按键监听处理。

```sh
yarn add keyboardjs
```

```js
import keyboardJS from "keyboardjs";

keyboardJS.bind("tab", (e) => {
  log("tab is pressed");
});
keyboardJS.bind("enter", (e) => {
  log("enter is pressed");
});
```

## compositionstart 和 compositionend 事件

查看 vue 的源码 src/platforms/web/runtime/directives/model.js，有这么几行代码：

```js
export default {
  inserted(el, binding, vnode) {
    if (vnode.tag === "select") {
      setSelected(el, binding, vnode.context);
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === "textarea" || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener("change", onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener("compositionstart", onCompositionStart);
          el.addEventListener("compositionend", onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
};

//...

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) return;
  e.target.composing = false;
  trigger(e.target, "input");
}

function trigger(el, type) {
  const e = document.createEvent("HTMLEvents");
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}
```

## iOS hover-click problem

iOS css 中使用了 hover 之后，会被处理为 click，但是默认绑定的 click 事件不会被触发，需要再次点击才能触发。

iOS 的 Safari 遵循一个非常奇怪的规则。它首先激发 mouseover 和 mousemove，如果在这些事件期间发生任何更改，都不会触发“点击”相关事件。

[iOS 中的触摸事件图](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW7)

mouseenter 并 mouseleave 似乎包括在内，尽管未在图表中指定。

如果您由于这些事件而修改了任何内容，则不会触发点击事件。

- [是否可以对 iPhone / iPad 用户强制忽略：hover 伪类？](https://qastack.cn/programming/2741816/is-it-possible-to-force-ignore-the-hover-pseudoclass-for-iphone-ipad-users)
- [iOS 中的触摸事件图](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW7)

## iOS focus 可能失效问题

如点击某个按钮，创建了一个新的输入框，希望这个输入框在创建之后就立即被 focus 呼起输入软键盘。

然后在 iOS Safari 浏览器下有时候就会出现 `input.focus()` 无效的情况。

首先明确一点，iPhone 浏览器中直接 `input.focus()`是可以有效的，但是需要有个前提，就是在点击事件中，而且是要在点击事件这个线程中。

也就是直接 `input.focus()` 是无法让输入框 focus 的，但是写在 click 事件中是有效的

- [细说 iOS Safari 下 focus 的行为](https://www.zhangxinxu.com/wordpress/2020/10/ios-safari-input-button-focus/)

## input 触发 focus 之后，阻止键盘弹出

设置 readonly 属性，readonly 态的元素也能触发点击事件

```js
receiver.setAttribute("readonly", "readonly");
```

## 参考资料

- [js 中 compositionstart 和 compositionend 事件](https://juejin.cn/post/6966423577168248869)
- [Web 键盘输入法应用开发指南 (3) —— 输入法事件](https://xie.infoq.cn/article/49640d0f3c0ba0d793f6b7501)
- [移动端事件（Touch 触摸和 Pointer 指针）](https://juejin.cn/post/7039723755806916638)
