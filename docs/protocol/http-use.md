# HTTP 常见使用

## HTTP 中如何处理表单数据的提交

在 http 中，有两种主要的表单提交的方式，体现在两种不同的 Content-Type 取值:

- application/x-www-form-urlencoded
- multipart/form-data

由于表单提交一般是 POST 请求，很少考虑 GET，因此这里我们将默认提交的数据放在请求体中。

上传文件示例：

```js
const http = require("http");
const formidable = require("formidable");

const server = http.createServer((req, res) => {
  if (req.url === "/api/upload" && req.method.toLowerCase() === "post") {
    // parse a file upload
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });

    return;
  }

  // show a file upload form
  res.writeHead(200, { "content-type": "text/html" });
  res.end(`
    <h2>With Node.js <code>"http"</code> module</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});

server.listen(8080, () => {
  console.log("Server listening on http://localhost:8080/ ...");
});
```

## 对于定长和不定长的数据，HTTP 是怎么传输的

### 定长包体

对于定长包体而言，发送端在传输的时候一般会带上 `Content-Length`, 来指明包体的长度。

```js
const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Length", 10);
    res.write("helloworld");
  }
});

server.listen(8081, () => {
  console.log("成功启动");
});
```

变换`res.setHeader('Content-Length', 10);`中的 length 长度，会有三种情况：

- 10，长度正确，正确返回`helloworld`
- 8, 长度小于正确值，返回`hellowor`
- 20，长度大于正确值，报错

可以看到`Content-Length`对于 http 传输过程起到了十分关键的作用，如果设置不当可以直接导致传输失败。

### 不定长包体

不定长包体使用 http 头部字段:

```http
Transfer-Encoding: chunked
```

表示分块传输数据，设置这个字段后会自动产生两个效果:

- Content-Length 字段会被忽略
- 基于长连接持续推送动态内容

```js
const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Length", 20);
    res.setHeader("Transfer-Encoding", "chunked");
    res.write("<p>Hello, </p>");
    setTimeout(() => {
      res.write("第一次数据<br>");
    }, 1000);
    setTimeout(() => {
      res.write("第二次数据");
      res.end();
    }, 2000);
  }
});

server.listen(8000);
```

## HTTP 如何处理大文件的传输

HTTP 采取**范围请求**的解决方案，允许客户端仅仅请求一个资源的一部分。

`Accept-Ranges: none`用来告知客户端这边是支持范围请求的。

而对于客户端而言，它需要指定请求哪一部分，通过**Range**这个请求头字段确定，格式为`bytes=x-y`。书写格式:

- **0-499** 表示从开始到第 499 个字节。
- **500-** 表示从第 500 字节到文件终点。
- **-100** 表示文件的最后 100 个字节。

服务器收到请求之后，首先验证范围是否合法，如果越界了那么返回 416 错误码，否则读取相应片段，返回 206 状态码。

同时，服务器需要添加**Content-Range**字段，这个字段的格式根据请求头中 Range 字段的不同而有所差异。

具体来说，请求**单段数据**和请求**多段数据**，响应头是不一样的。

```http
// 单段数据
Range: bytes=0-9;
// 多段数据
Range: (bytes=0-9), 30-39;
```

一个非常关键的字段：

```http
Content-Type: multipart/byteranges;boundary=00000010101
```

它代表了信息量是这样的:

- 请求一定是多段数据请求
- 响应体中的分隔符是 00000010101

因此，在响应体中各段数据之间会由这里指定的分隔符分开，而且在最后的分隔末尾添上`--`表示结束。

## HTTP1.1 如何解决 HTTP 的队头阻塞问题

- 并发连接

提高了并发连接（如 Chrome 中是 6 个）。

- 域名分片

一个 test.com 域名可以分多个，如：`a.test.com`，`b.test.com`，一个域名可以并发 6 个长连接，分出非常多的二级域名，且都指向同样的一台服务器，能够并发的长连接数更多。

## 参考资料

- [（建议精读）HTTP 灵魂之问，巩固你的 HTTP 知识体系](https://juejin.im/post/5e76bd516fb9a07cce750746)
