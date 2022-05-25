# iframe 通信

## 子传父

子页面传值给父页面：

```js
// 发送给主体窗口信息
window.parent.postMessage({ msg: 'exit' }, window.location.origin)
```

父页面监听：

```js
const receiveMessage = event => {
  console.log(event.data)

  if (event.origin !== window.location.origin || !event.data) {
    return
  }
  if (event.data.msg === 'exit') {
    return 'exit'
  }
}
window.addEventListener('message', receiveMessage, false)
```

React:

```js
useEffect(() => {
  const receiveMessage = event => {
    console.log(event.data)

    if (event.origin !== window.location.origin || !event.data) {
      return
    }
    if (event.data.msg === 'exit') {
      return 'exit'
    }
  }
  window.addEventListener('message', receiveMessage, false)

  return () => window.removeEventListener('message', receiveMessage, false)
}, [])
```
