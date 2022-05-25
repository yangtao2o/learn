## JsBridge 封装

1. 通过 base64 的`base64.encode()`以及`base64.decode()`进行编码、解码，防止特殊字符在通信时发生转义等风险
2. 判断参数类型进行对应的参数格式化

```js
import { Base64 } from 'js-base64'

/**
 * jsBridge 注册事件监听
 * @param {*} callback
 */

export function connectJsBridge(callback) {
  const bridge = window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge
  if (bridge) {
    callback(bridge)
  } else {
    console.log(`WebViewJavascriptBridge Not found`)
  }
}

/**
 * Promise化
 */

export function bridgeCallHandler(action = '', params = {}) {
  const bridge = window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge
  console.log(`call ${action}`)
  return new Promise((resolve, reject) => {
    try {
      let base64Param = null
      if (typeof params === 'string') {
        console.log(`params ${params}`)
        base64Param = Base64.encode(params)
      } else {
        const json = JSON.stringify(params)
        console.log(`params ${json}`)
        base64Param = Base64.encode(json)
      }
      bridge.callHandler(action, base64Param, res => {
        if (res) {
          const json = Base64.decode(res)
          resolve(JSON.parse(json))
        } else {
          console.log(`${action} 没有返回数据`)
          resolve()
        }
        res ? resolve(JSON.parse(Base64.decode(res))) : resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

export function registerBridgeHandler(name, handle) {
  const bridge = window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge
  if (bridge) {
    bridge.registerHandler(name, (base64Data, callback) => {
      const data = Base64.decode(base64Data)
      console.log(`收到命令[${name}]数据${data}`)
      handle(data, data => {
        if (data !== null || data !== undefined) {
          let encrypt = null
          if (typeof data == 'string') {
            encrypt = Base64.encode(data)
          } else {
            encrypt = Base64.encode(JSON.stringify(data))
          }
          callback(encrypt)
        } else {
          callback()
        }
      })
    })
    console.log(`注册 ${name} 成功`)
  } else {
    console.log(`注册 ${name} 失败：WebViewJavascriptBridge not Found `)
  }
}
```

## 参考资料

- [JSBridge 深度剖析](https://cloud.tencent.com/developer/article/1038398)
- [深入浅出 JSBridge：从原理到使用](https://juejin.cn/post/6936814903021797389)
