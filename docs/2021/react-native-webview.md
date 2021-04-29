# React-native-webview 使用总结

> WebView 就是浏览器引擎部分，你可以像插入 iframe 一样将 Webview 插入到你的原生应用中，并且编程化的告诉它将会加载什么网页内容。

## 基本使用

### Basic inline HTML

```js
import React, { Component } from 'react'
import { WebView } from 'react-native-webview'

class MyInlineWeb extends Component {
  render() {
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: '<h1>This is a static HTML source!</h1>' }}
      />
    )
  }
}
```

### Basic URL Source

```js
This is the most common use-case for WebView.

import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class MyWeb extends Component {
  render() {
    return <WebView source={{ uri: 'https://reactnative.dev/' }} />;
  }
}
```

### Communicating between JS and Native

You will often find yourself wanting to send messages to the web pages loaded by your webviews and also receiving messages back from those web pages.

To accomplish this, React Native WebView exposes three different options:

- React Native -> Web: The `injectedJavaScript` prop
- React Native -> Web: The `injectJavaScript` method
- Web -> React Native: The `postMessage` method and `onMessage` prop

其他详细内容，可以参阅文档：[react-native-webview](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md)。

## React Native 与 Web 互相通信

### React Native 如何发送一次性数据到 Web

React Native 中使用官方提供的属性：`injectedJavaScript`。如下：

```js
import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

export const App = () => {
  const initDetailsDispatch = data => `
    (function() {
      window.$native_details = ${JSON.stringify(data)};
    })();
    true; // note: this is required, or you'll sometimes get silent failures
  `
  return (
    <View style={{ flex: 1 }}>
      <WebView
        injectedJavaScript={initDetailsDispatch(details)}
        onMessage={event => {}}
        source={{
          uri: 'https://github.com/react-native-webview/react-native-webview',
        }}
      />
    </View>
  )
}
```

Web 中接受发送过来的数据：

```js
const [details, setDetails] = useState()

useEffect(() => {
  if (window?.$native_details) {
    const detailData = window.$native_details
    setDetails(detailData)
  }
}, [])
```

### React Native 如何多次触发事件至 Web

主要依赖方法：`injectJavaScript`。React Native 中使用：

```js
import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

export const App = () => {
  const web = useRef(null)

  // 监听 token 变化，并传给 web
  useEffect(() => {
    if (token) {
      web.current?.injectJavaScript(
        generateOnMessageDispatch({ name: 'token', data: token })
      )
    }
  }, [token, web.current?.injectJavaScript])

  // 通过dispatchEvent自定义事件
  // MessageEvent 是接口代表一段被目标对象接收的消息
  const generateOnMessageDispatch = (data = {}) => `
    (function() {
      window.dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(
        data
      )}}));
    })();		
    true; // note: this is required, or you'll sometimes get silent failures
  `

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={web}
        source={{
          uri: 'https://github.com/react-native-webview/react-native-webview',
        }}
      />
    </View>
  )
}
```

Web 中监听事件变化：

```js
useEffect(() => {
  if (window?.$native_details) {
    // 监听RN自定义事件
    window.addEventListener('message', handleMessage)
  }

  // 组件卸载移除RN自定义事件
  return () => window.removeEventListener('message', handleMessage)
}, [])

// 接受自定义事件的消息，并处理
const handleMessage = event => {
  const res = event.data
  switch (res.name) {
    case 'token':
      setToken(res.data)
      break
  }
}
```

### Web 如何调用 React Native 中的方法

主要依赖于：`postMessage` 和 `onMessage`。

Web 中使用：

```js
const postMsg = (type = '', params = {}) =>
  window.ReactNativeWebView.postMessage(JSON.stringify({ type, ...params }))

// e.g.
const back = postMsg('goBack')
const share = postMsg('shareToWx', {
  url: 'https://github.com/react-native-webview',
})
```

React native 中监听传过来的消息，并触发对应的事件：

```js
import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

const goBack = () => true
const shareToWx = url => url

export const App = () => {
  const onMessage = event => {
    let data = JSON.parse(event.nativeEvent.data)
    switch (data.type) {
      case 'goBack':
        goBack()
        break
      case 'shareToWx':
        shareToWx(data.url)
        break
      default:
        break
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        onMessage={onMessage}
        source={{
          uri: 'https://github.com/react-native-webview/react-native-webview',
        }}
      />
    </View>
  )
}
```

## 参考资料

- [react-native-webview](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md)
- [【Web 技术】 275- 理解 WebView](https://cloud.tencent.com/developer/article/1471962?from=article.detail.1471821)
- [[Documentation] Clarify migration path for this.webView.postMessage removal](https://github.com/react-native-webview/react-native-webview/issues/809)
