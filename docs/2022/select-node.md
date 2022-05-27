# JavaScript 中获取光标位置并重新定位

## 理论

`document.createRange()`返回一个 Range 对象。定位方法：

- `Range.setStart()` 设置 Range 的起点
- `Range.setEnd()` 设置 Range 的终点

`Window.getSelection()`，返回一个 Selection 对象，表示用户选择的文本范围或光标的当前位置。

`Selection.removeAllRanges()`方法会从当前 selection 对象中移除所有的 range 对象,取消所有的选择只 留下 anchorNode 和 focusNode 属性并将其设置为 null。

`Selection.addRange()`向选区（Selection）中添加一个区域（Range）。

## 代码实现

```js
export const getFocusRange = id => {
  const handler = () => {
    if (!id) return

    const target = document.getElementById(id)
    if (!target) return

    target.click()
    target.focus()

    const range = document.createRange()

    if (target.firstChild) {
      range.setStart(target.firstChild, 0)
      range.setEnd(target.firstChild, target.firstChild.length)
    }

    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }

  setTimeout(handler, 10)
}
```
