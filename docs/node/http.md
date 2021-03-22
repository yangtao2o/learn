# HTTP 服务

> 超文本传输协议，是一种 Web 协议，属于 TCP 上层的协议。

HTTP 模块式 Node 的核心模块，主要提供了一系列用于网络传输的 API。

HTTP 消息头如下所示(键是小写的，值不能被修改)：

```json
{
  "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "mysite.com",
  "accept": "*/*"
}
```

## 创建 HTTP 服务器

使用 NodeJS 内置的 http 模块简单实现一个 HTTP 服务器:

```js
const http = require("http");

http
  .createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello World!");
  })
  .listen(3000);
```

以上程序创建了一个 HTTP 服务器并监听 3000 端口，打开浏览器访问该端口`http://127.0.0.1:3000/`就能够看到效果。

使用 createServer 创建一个 HTTP 服务器，该方法返回一个 http.server 类的实例。

createServer 方法包含了一个匿名的回调函数，该函数有两个参数 request，response，它们是 IncomingMessage 和 ServerResponse 的实例。

分别表示 HTTP 的 request 和 response 对象，当服务器创建完成后，Node 进程开始循环监听 3000 端口。

http.server 类定义了一系列的事件，如 connection 和 request 事件。

## 处理 HTTP 请求

### method，URL 和 header

Node 将相关的信息封装在一个对象（request）中，该对象是 IncomingMessage 的实例。

获取 method、URL：

```js
const method = req.method;
const url = req.url;
```

比如访问`http://127.0.0.1:8000/index.html?name=tao`，就会输出：

```json
{
  "method": "GET",
  "url": "/index.html?name=tao"
}
```

URL 的值为去除网站服务器地址之外的完整值。

### header

获取 HTTP header 信息：

```js
const headers = req.headers;
const userAgent = headers["user-agent"];
```

输出：

```json
{
  "headers": {
    "host": "127.0.0.1:8000",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:68.0) Gecko/20100101 Firefox/68.0",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
    "accept-encoding": "gzip, deflate",
    "connection": "keep-alive",
    "upgrade-insecure-requests": "1",
    "cache-control": "max-age=0"
  },
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:68.0) Gecko/20100101 Firefox/68.0"
}
```

header 是一个 JSON 对象，可以对属性名进行单独索引。

### request body

Node 使用 stream 处理 HTTP 的请求体，并且注册了两个事件：data 和 end。

获取完整的 HTTP 内容体：

```js
let body = [];

request.on("data", chunk => {
  body.push(chunk);
});

request.on("end", () => {
  body = Buffer.concat(body).toString();
});
```

## get/post 请求

综上所述，我们来组织一个简易的 get、post 请求实例：

```js
const http = require("http");
const querystring = require("querystring");

http
  .createServer((req, res) => {
    const method = req.method;
    const url = req.url;
    const path = url.split("?")[0];
    const query = querystring.parse(url.split("?")[1]);
    const headers = req.headers;
    const userAgent = headers["user-agent"];
    const resData = {
      method,
      url,
      path,
      query,
      headers,
      userAgent
    };

    res.setHeader("Content-type", "application/json");

    if (method === "GET") {
      res.end(JSON.stringify(resData));
    }

    if (method === "POST") {
      let postData = [];

      req.on("data", chunk => {
        postData.push(chunk);
      });

      req.on("end", () => {
        resData.postData = Buffer.concat(postData).toString();
        res.end(JSON.stringify(resData));
      });
    }
  })
  .listen(8000);
```

比如`POST`请求 `http://127.0.0.1:8000/api/blog?ip=2`，然后使用 Postman 工具测试结果如下：

```json
{
  "method": "POST",
  "url": "/api/blog?ip=2",
  "path": "/api/blog",
  "query": {
    "ip": "2"
  },
  "headers": {
    "content-type": "application/json",
    "cache-control": "no-cache",
    "postman-token": "9e6cb382-8551-4a3f-b352-0581bb377cbc",
    "user-agent": "PostmanRuntime/7.6.0",
    "accept": "*/*",
    "host": "127.0.0.1:8000",
    "accept-encoding": "gzip, deflate",
    "content-length": "62",
    "connection": "keep-alive"
  },
  "userAgent": "PostmanRuntime/7.6.0",
  "postData": "{\n\t\"title\": \"你说什么\",\n\t\"content\": \"我知道你知道\"\n}"
}
```

## http

[http](http://nodejs.cn/api/http.html) 模块提供两种使用方式：

1. 作为服务端使用时，创建一个 HTTP 服务器，监听 HTTP 客户端请求并返回响应。
2. 作为客户端使用时，发起一个 HTTP 客户端请求，获取服务端响应。

### 一个简单的 Web 服务器

```js
const http = require("http");
const qs = require("querystring");

http
  .createServer(function(req, res) {
    if ("/" == req.url) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        [
          '<form method="POST" action="/url">',
          "<h1>My Form</h1>",
          "<fieldset>",
          "<label>Personal information</label>",
          "<p>What is your name?</p>",
          '<input type="text" name="name" />',
          "<p><button>Submit</button></p>",
          "</fieldset>",
          "</form>"
        ].join("")
      );
    } else if ("/url" == req.url && "POST" == req.method) {
      var body = "";
      req.on("data", function(chunk) {
        body += chunk;
      });
      req.on("end", function() {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<p>Content-type: " +
            req.headers["content-type"] +
            "</p>" +
            "<p>Data: " +
            qs.parse(body).name +
            "</p>"
        );
      });
    } else {
      res.writeHead(404);
      res.end("Not Found.");
    }
  })
  .listen(3000);
```

### 一个 Twitter Web 客户端

创建服务器：app.js

```js
const http = require("http");
const qs = require("querystring");

http
  .createServer(function(req, res) {
    var body = "";
    req.on("data", function(chunk) {
      body += chunk;
    });
    req.on("end", function() {
      res.writeHead(200);
      res.end("Done");
      console.log("\n got name \033[90m" + qs.parse(body).name + "\033[39m\n");
    });
  })
  .listen(3000);
```

创建客户端：client.js

```js
const http = require("http");
const qs = require("querystring");

function send(theName) {
  http
    .request(
      {
        host: "127.0.0.1",
        port: 3000,
        url: "/",
        method: "POST"
      },
      function(res) {
        var body = "";
        res.setEncoding("utf8");
        res.on("data", function(chunk) {
          body += chunk;
        });
        res.on("end", function() {
          console.log("\n  \033[90m request complete! \033[39m");
          process.stdout.write("\n your name: ");
        });
      }
    )
    .end(qs.stringify({ name: theName }));
}

process.stdout.write("\n your name: ");
process.stdin.resume();
process.stdin.setEncoding("utf-8");
process.stdin.on("data", function(name) {
  send(name.replace("\n", ""));
});
```

启动`node app.js`，再启动`node client.js`

## HTTPS

HTTPS 是基于 TLS/SSL 的 HTTP 协议。在 Node.js 中，作为一个单独的模块实现。

HTTPS 模块与 HTTP 模块极为类似，区别在于 HTTPS 模块需要额外处理 SSL 证书。

```js
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("test/fixtures/keys/agent2-key.pem"),
  cert: fs.readFileSync("test/fixtures/keys/agent2-cert.pem")
};

https
  .createServer(options, (req, res) => {
    res.writeHead(200);
    res.end("hello world\n");
  })
  .listen(8000);
```

## URL

处理 HTTP 请求时 url 模块使用率超高，因为该模块允许解析 URL、生成 URL，以及拼接 URL。

首先我们来看看一个完整的 URL 的各组成部分，输出如下：

```bash
> require('url').parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash');
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'user:pass',
  host: 'host.com:8080',
  port: '8080',
  hostname: 'host.com',
  hash: '#hash',
  search: '?query=string',
  query: 'query=string',
  pathname: '/p/a/t/h',
  path: '/p/a/t/h?query=string',
  href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'}
```

当然，不完整的 url，也可以解析：

```js
const http = require("http");
const url = require("url");

http
  .createServer((request, response) => {
    let body = [];
    const tmp = request.url; // /foo/bar?a=b

    response.writeHead(200, { "Content-Type": "text/plain" });

    console.log("url-parse", url.parse(tmp));

    response.end("Hello World");
  })
  .listen(8000);
```

```json
{
  "protocol": null,
  "slashes": null,
  "auth": null,
  "host": null,
  "port": null,
  "hostname": null,
  "hash": null,
  "search": "?a=b",
  "query": "a=b",
  "pathname": "/foo/bar",
  "path": "/foo/bar?a=b",
  "href": "/foo/bar?a=b"
}
```

format 方法允许将一个 URL 对象转换为 URL 字符串

```js
const urlFormat = url.format({
  protocol: "http:",
  host: "www.example.com",
  pathname: "/p/a/t/h",
  search: "query=string"
});

console.log({ urlFormat }); // { urlFormat: 'http://www.example.com/p/a/t/h?query=string' }
```

## Query String

[querystring](http://nodejs.org/api/querystring.html) 模块用于实现 URL 参数字符串与参数对象的互相转换

```js
querystring.parse("foo=bar&baz=qux&baz=quux&corge");
// { foo: 'bar', baz: [ 'qux', 'quux' ], corge: '' }

querystring.stringify({ foo: "bar", baz: ["qux", "quux"], corge: "" });
// 'foo=bar&baz=qux&baz=quux&corge='
```

## Zlib

zlib 模块提供了数据压缩和解压的功能。当我们处理 HTTP 请求和响应时，可能需要用到这个模块。

## Net

net 模块可用于创建 Socket 服务器或 Socket 客户端。

由于 Socket 在前端领域的使用范围还不是很广，这里先不涉及到 WebSocket 的介绍，仅仅简单演示一下如何从 Socket 层面来实现 HTTP 请求和响应。

## 问题解答

使用 NodeJS 操作网络，特别是操作 HTTP 请求和响应时会遇到一些惊喜，这里对一些常见问题做解答。

- 为什么通过 headers 对象访问到的 HTTP 请求头或响应头字段不是驼峰的？

从规范上讲，HTTP 请求头和响应头字段都应该是驼峰的。但现实是残酷的，不是每个 HTTP 服务端或客户端程序都严格遵循规范，所以 NodeJS 在处理从别的客户端或服务端收到的头字段时，都统一地转换为了小写字母格式，以便开发者能使用统一的方式来访问头字段，例如`headers['content-length']`。

- 为什么 http 模块创建的 HTTP 服务器返回的响应是 chunked 传输方式的？

因为默认情况下，使用`.writeHead`方法写入响应头后，允许使用`.write`方法写入任意长度的响应体数据，并使用`.end`方法结束一个响应。由于响应体数据长度不确定，因此 NodeJS 自动在响应头里添加了`Transfer-Encoding: chunked`字段，并采用 chunked 传输方式。但是当响应体数据长度确定时，可使用`.writeHead`方法在响应头里加上`Content-Length`字段，这样做之后 NodeJS 就不会自动添加`Transfer-Encoding`字段和使用 chunked 传输方式。

- 为什么使用 http 模块发起 HTTP 客户端请求时，有时候会发生 socket hang up 错误？

答： 发起客户端 HTTP 请求前需要先创建一个客户端。http 模块提供了一个全局客户端`http.globalAgent`，可以让我们使用`.request`或`.get`方法时不用手动创建客户端。但是全局客户端默认只允许 5 个并发 Socket 连接，当某一个时刻 HTTP 客户端请求创建过多，超过这个数字时，就会发生`socket hang up`错误。解决方法也很简单，通过`http.globalAgent.maxSockets`属性把这个数字改大些即可。另外，https 模块遇到这个问题时也一样通过`https.globalAgent.maxSockets`属性来处理。

## 学习资料

- [7-days-nodejs](http://nqdeng.github.io/7-days-nodejs/#1.1) - 文章
- 《了不起的 Node.js：将 JavaScript 进行到底》- 书籍
- 《新时期的 Node.js 入门》- 书籍
- [Node.js 从零开发 Web Server 博客项目 前端晋升全栈工程师必备](https://coding.imooc.com/class/320.html) - 视频
- [http（HTTP）](http://nodejs.cn/api/http.html) - 官方文档
