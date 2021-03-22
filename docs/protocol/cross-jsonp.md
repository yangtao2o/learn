# 跨域解决方案 JSONP

> JSONP 请求本质上是利用了 “Ajax 请求会受到同源策略限制，而 script 标签请求不会” 这一点来绕过同源策略。

## 同源策略

什么是同源策略，其作用是什么？

同源策略指的是：协议+域名+端口三者皆相同，可以视为在同一个域，否则为不同域。同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。

作用是一个用于隔离潜在恶意文件的重要安全机制。

所限制的跨域交互包括：

- Cookie、LocalStorage、IndexdDB 等存储内容；
- DOM 节点；
- Ajax 请求。

## Ajax 为什么不能跨域

Ajax 其实就是向服务器发送一个 GET 或 POST 请求，然后取得服务器响应结果，返回客户端。Ajax 跨域请求，在服务器端不会有任何问题，只是服务端响应数据返回给浏览器的时候，浏览器根据响应头的`Access-Control-Allow-Origin`字段的值来判断是否有权限获取数据。因此，服务端如果没有设置跨域字段设置，跨域是没有权限访问，数据被浏览器给拦截了。

所以，要解决的问题是：**如何从客户端拿到返回的数据**？

其实，在同源策略的基础上，选择性地为同源策略开放了一些后门。例如 img、script、style 等标签，都允许跨域引用资源。

所以， JSONP 来了。

## JSONP 实现

JSONP(JSON with Padding（填充）)是 JSON 的一种“使用模式”，本质不是 Ajax 请求，是 script 标签请求。JSONP 请求本质上是利用了 “Ajax 请求会受到同源策略限制，而 script 标签请求不会” 这一点来绕过同源策略。

简单 JSONP 实现：

```js
class Jsonp {
  constructor(req) {
    this.url = req.url;
    this.callbackName = req.callbackName;
  }
  create() {
    const script = document.createElement("script");
    const url = `${this.url}?callback=${this.callbackName}`;
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
}

new Jsonp({
  url: "http://127.0.0.1:8000/",
  callbackName: "getMsg"
}).create();

function getMsg(data) {
  data = JSON.parse(data);
  console.log(`My name is ${data.name}, and ${data.age} years old.`);
}
```

服务端（Node）:

```js
const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
  const url = req.url;
  const query = querystring.parse(url.split("?")[1]);
  const { callback } = query;
  const data = {
    name: "Yang Min",
    age: "8"
  };
  res.end(`${callback}('${JSON.stringify(data)}')`);
});

server.listen(8000);
```

前端利用 `http-server -p 8001 .`，开启一个服务，然后 Node 也开启一个端口为 8000 的服务，运行：

```text
My name is Yang Min, and 8 years old.
```

### 一个 JSONP 的步骤实质

客户端发送 script 请求，参数中带着处理返回数据的回调函数的名字 (通常是 callback)，如请求 script 的 url 是：

```url
http://127.0.0.1:8000/?callback=getMsg
```

服务端收到请求，以回调函数名和返回数据组成立即执行函数的字符串，比如：其中 callback 的值是客户端发来的回调函数的名字，假设回调函数的名字是 getMsg，返回脚本的内容就是：

```js
getMsg("{name: 'Yang Min', age: '8'}");
```

客户端收到 JavaScript 脚本内容后，立即执行脚本，这样就实现了获取跨域服务器数据的目的。

很明显，由于 JSONP 技术本质上利用了 script 脚本请求，所以只能实现 GET 跨域请求，这也是 JSONP 跨域的最大限制。

由于 server 产生的响应为 json 数据的包装（故称之为 jsonp，即 json padding），形如：`getMsg("{name: 'Yang Min', age: '8'}")`

## JSONP 封装

客户端：

```js
const jsonp = ({ url, params, callbackName }) => {
  const generateURL = () => {
    let dataStr = "";
    for (let key in params) {
      dataStr += `${key}=${params[key]}&`;
    }
    dataStr += `callback=${callbackName}`;
    return `${url}?${dataStr}`;
  };
  return new Promise((resolve, reject) => {
    // 初始化回调函数名称
    callbackName =
      callbackName ||
      "cb" +
        Math.random()
          .toString()
          .replace(".", "");
    let scriptEle = document.createElement("script");
    scriptEle.src = generateURL();
    document.body.appendChild(scriptEle);

    // 绑定到 window 上，为了后面调用
    window[callbackName] = data => {
      resolve(data);
      // script 执行完了，成为无用元素，需要清除
      document.body.removeChild(scriptEle);
    };
  });
};

jsonp({
  url: "http://127.0.0.1:8000/",
  params: {
    name: "Yang Min",
    age: "8"
  },
  callbackName: "getData"
})
  .then(data => JSON.parse(data))
  .then(data => {
    console.log(data); // {name: "Yang Min", age: "8"}
  });
```

Node 端：

```js
const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
  const url = req.url;
  const query = querystring.parse(url.split("?")[1]);
  const { name, age, callback } = query;
  const data = {
    name,
    age
  }
  res.end(`${callback}('${JSON.stringify(data)}')`);
});

server.listen(8000);
```

## jQuery 中的 JSONP

Node 部分不变，使用 jQuery(3.4.1) 如下：

```js
function getAjaxData() {
  $.ajax({
    type: "get",
    async: false,
    url: "http://127.0.0.1:8000/",
    dataType: "jsonp", //由 JSON 改为 JSONP
    jsonp: "callback", //传递给请求处理程序或页面的，标识jsonp回调函数名(一般为:callback)
    jsonpCallback: "getData", //callback的function名称，成功就会直接走 success 方法
    success: function(data) {
      data = JSON.parse(data);
      console.log(`My name is ${data.name}, and ${data.age} years old.`);
    },
    error: function() {
      console.log("Error");
    }
  });
}
getAjaxData();
```

使用延迟对象重新写下：

```js
function getAjaxData() {
  const def = $.ajax({
    type: "get",
    async: false,
    url: "http://127.0.0.1:8000/",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "getData"
  });

  def
    .done(data => {
      data = JSON.parse(data);
      console.log(`My name is ${data.name}, and ${data.age} years old.`);
    })
    .fail(err => {
      console.log(err);
    });
}
```

## JSONP 缺点

- 只支持 GET 请求
- 只支持跨域 HTTP 请求这种情况，不能解决不同域的两个页面之间如何进行 JavaScript 调用的问题
- 调用失败的时候不会返回各种 HTTP 状态码。
- 安全性，万一假如提供 JSONP 的服务存在页面注入漏洞，即它返回的 javascript 的内容被人控制的。

## 参考资料

- [什么是跨域？浏览器如何拦截响应？如何解决](https://juejin.im/post/5e76bd516fb9a07cce750746#heading-67)
- [jsonp 跨域原理分析](https://segmentfault.com/a/1190000009773724) - 分析了 Ajax 和 jsonp 之间的关系
- [前端必须懂的计算机网络知识—(跨域、代理、本地存储)](https://juejin.im/post/5bb1cc2af265da0ae5052496)
