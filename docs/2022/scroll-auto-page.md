# 当某个元素触底时自动滑动至中间位置

## 理论

### `Window.innerHeight`

浏览器窗口的视口（viewport）高度（以像素为单位）；如果有水平滚动条，也包括滚动条高度。

想获取窗口的外层高度（outer height），即整个浏览器窗口的高度，使用 `window.outerHeight`。

改变一个窗口的大小，可以查看 `window.resizeBy()` 和 `window.resizeTo()`。

### `Element.clientHeight`

这个属性是只读属性，对于没有定义 CSS 或者内联布局盒子的元素为 0，否则，它是元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。

### `Element.scrollTop`

这个属性可以获取或设置一个元素的`内容垂直滚动`的像素数。

一个元素的 scrollTop 值是这个元素的内容顶部（卷起来的）到它的视口可见内容（的顶部）的距离的度量。

### `Element.scrollHeight`

这个只读属性是一个元素`内容高度`的度量，包括由于溢出导致的视图中不可见内容。

属性将会对值取整。如果需要小数值，使用 `Element.getBoundingClientRect()`。

所以可以通过如下判断可以得知，页面是否已到底部：

`Element.clientHeight + Element.scrollTop >= Element.scrollHeight`

### `Element.getBoundingClientRect()`

这个方法返回元素的大小及其相对于视口的位置。

返回值是一个 DOMRect 对象，这个对象是由该元素的 `getClientRects()` 方法返回的一组矩形的集合，就是该元素的 CSS 边框大小。

返回的结果是包含完整元素的最小矩形，并且拥有 left, top, right, bottom, x, y, width, 和 height 这几个以像素为单位的只读属性用于描述整个边框。

除了 width 和 height 以外的属性是相对于视图窗口的左上角来计算的。

### `Element.scrollTo()`

这个方法可以使界面滚动到给定元素的指定坐标位置。

```js
element.scrollTo(0, 1000)

// or
element.scrollTo({
  top: 100,
  left: 100,
  behavior: 'smooth',
})
```

## 代码实现

```js
export const elementsBoxScroll = target => {
  let selectNode = target

  if (!selectNode) return

  if (typeof selectNode === 'string') {
    selectNode = document.getElementById(selectNode)
  }

  if (!selectNode || !selectNode.nodeType) return

  const targetBox = document.getElementById('targetBox')

  if (!targetBox) return

  const setContentHeight = height => {
    const contentBox = targetBox.getElementsByClassName('content')[0]
    contentBox.style.height = height + 'px'
  }

  const { bottom, height } = selectNode.getBoundingClientRect()
  const { scrollTop, clientHeight, scrollHeight } = targetBox

  // 首先判断当前节点是否到底，但只是视口上到底，并未是页面到底
  if (bottom + height >= window.innerHeight) {
    // 再判断滚动条是否到底，也就是真正到底，没有内容了
    if (scrollTop + clientHeight + height >= scrollHeight) {
      // 页面原有内容的高度再加上可滑动窗口的一半
      const addHeight = scrollHeight + clientHeight / 2

      const top = scrollHeight - clientHeight / 2

      // 设置页面最新内容高度
      setContentHeight(addHeight)

      // 内容滑动到底部，约视口的中间位置
      const handler = () =>
        targetBox.scrollTo({
          top,
          behavior: 'smooth',
        })

      setTimeout(handler, 10)
    }
  }
}
```
