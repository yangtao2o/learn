# 浏览器是怎么缓存资源的

浏览器缓存（Brower Caching）是浏览器在本地磁盘对用户最近请求过的文档进行存储，当访问者再次访问同一页面时，浏览器就可以直接从本地磁盘加载文档。这样做的好处有：**减少冗余数据传输、减少服务器负担、加快客户端加载网页的速度**。

浏览器的缓存规则分为两大块：**强制缓存**和**协商缓存**。对于某个文件来说，具体是采用哪种缓存方式，由 HTTP Response Headers 设置，当然也可以通过 meta 标签，但是现在越来越多浏览器忽略设置缓存的 meta 标签，所以还是推荐通过 HTTP Response Headers 设置。

## 强制缓存

首先客户端会检查本地缓存中是否有所要请求的数据，如果有，就直接从缓存中获取数据；如果没有，就从服务器获取数据。

HTTP Response Headers 中 `Cache-Control` 和 `Expires` 字段都表示对本资源启动强制缓存，其中 Cache-Control 是 http1.1 标准中的字段，而 Expires 是 http1.0 的字段，Cache-Control 优先级更高，使用更广泛。

### Expires

**Expires** 即过期时间，存在于服务端返回的响应头中，告诉浏览器在这个过期时间之前可以直接从缓存里面获取数据，无需再次请求，如：

```http
Expires: Wed, 22 Nov 2019 08:41:00 GMT
```

### Cache-Control

**Cache-Control** 的值的单位为秒，关键字 `max-age` 表示可以被缓存多长时间。

```http
cache-control: max-age=36029314
```

百度首页加载的一个资源返回头中出现了 Cache-Control 字段，当 Cache-Control 值设为 `max-age=300` 时，则代表在这个请求正确返回时间（浏览器也会记录下来）的 5 分钟内再次加载资源，就会命中强缓存。

常用的设置值：

- `no-cache`： 不使用本地缓存。需要使用缓存协商，先与服务器确认返回的响应是否被更改，如果之前的响应中存在 ETag，那么请求的时候会与服务端验证，如果资源未被更改，则可以避免重新下载。
- `no-store`： 直接禁止浏览器缓存数据，每次用户请求该资源，都会向服务器发送一个请求，每次都会下载完整的资源。
- `public`： 可以被所有的用户缓存，包括终端用户和 CDN 等中间代理服务器。
- `private`： 只能被终端用户的浏览器缓存，不允许 CDN 等中继缓存服务器对其缓存。
- `s-maxage`：这和 max-age 长得比较像，但是区别在于 s-maxage 是针对代理服务器的缓存时间。
- `must-revalidate`：是缓存就会有过期的时候，加上这个字段一旦缓存过期，就必须回到源服务器验证。

**注意**：当 Expires 和 Cache-Control 同时存在的时候，Cache-Control 会优先考虑。

当然，还存在一种情况，当资源缓存时间超时了，也就是强缓存失效了，接下来怎么办？没错，这样就进入到第二级屏障——协商缓存了。

## 协商缓存

强缓存失效之后，浏览器在请求头中携带相应的缓存 tag 来向服务器发请求，由服务器根据这个 tag，来决定是否使用缓存，这就是协商缓存。

具体来说，这样的缓存 tag 分为两种: **Last-Modified** 和 **ETag**。这两者各有优劣，并不存在谁对谁有绝对的优势，跟上面强缓存的两个 tag 不一样。

### Last-Modified

资源被服务器返回时，HTTP Response Headers 中的 **Last-Modified** 返回头标识了此资源在服务器上的最后修改时间。

浏览器再次请求服务器时，会将上次 **Last-Modified** 的值作为 **if-Modified-Since** 头的值发送，服务器收到请求后，查看最后修改时间以后资源是否被修改过：

- 没有被修改过，就返回 **304**，从缓存读取
- 修改过，返回状态 **200** 以及整个资源

```http
last-modified: Wed, 13 Nov 2019 15:16:37 GMT
```

### Etag

**ETag** 是服务器根据当前文件的内容，给文件生成的唯一标识，只要里面的内容有改动，这个值就会变。服务器通过响应头把这个值给浏览器。

浏览器接收到 ETag 的值，会在下次请求时，将这个值作为**If-None-Match**这个字段的内容，并放到请求头中，然后发给服务器。

服务器接收到 If-None-Match 后，会跟服务器上该资源的 ETag 进行比对：

- 两者不一样，说明要更新了。返回新的资源，跟常规的 HTTP 请求响应的流程一样
- 否则返回 304，告诉浏览器直接用缓存

```http
etag: W/"36BE6ECF0746FFAC5024A69C27141E08"
```

### 两者对比

**精度上**Etag 要优于 Last-Modified。Last-Modified 的时间单位是秒，如果某个文件在 1 秒内改变了多次，那么他们的 Last-Modified 其实并没有体现出来修改，但是 Etag 每次都会改变确保了精度。

**性能上**，Last-Modified 要优于 Etag，毕竟 Last-Modified 只需要记录时间，而 Etag 需要服务器通过算法来计算出一个 hash 值。

**优先级上**，服务器校验优先考虑 Etag。

## 浏览器缓存

浏览器缓存这一块，最重要的是能区分开**强制缓存**和**协商缓存**：

- 完全不向服务器发送请求的是强制缓存
- 服务器发送请求的是协商缓存，涉及到 304 的都是协商缓存

总结一下浏览器缓存的全过程：

浏览器第一次加载资源，服务器返回 200，浏览器从服务器下载资源文件，并缓存住资源文件与 response header 以供下次加载时对比使用；

下一次加载资源时，由于强制缓存优先级较高，先比较当前时间与上一次返回 200 时的时间差，如果没有超过 cache-control 设置的 max-age，则没有过期，并命中**强缓存**，直接从本地读取资源。如果浏览器不支持 HTTP1.1，则使用 expires 头判断是否过期；

如果资源已过期，则表明强制缓存没有被命中，则开始**协商缓存**，向服务器发送带有 `If-None-Match` 和 `If-Modified-Since` 的请求；

服务器收到请求后，优先根据 Etag 的值判断被请求的文件有没有做修改，Etag 值一致则没有修改，命中协商缓存，返回 **304**；如果不一致则有改动，直接返回新的资源文件带上新的 Etag 值并返回 **200**；

如果服务器收到的请求没有 Etag 值，则将 `If-Modified-Since` 和被请求文件的最后修改时间做比对，一致则命中协商缓存，返回 304；不一致则返回新的 `last-modified` 和文件并返回 200。

## 其他问题

### 点击刷新按钮或者按 F5

浏览器直接对本地的缓存文件过期，但是会带上`If-Modifed-Since`，`If-None-Match`，这就意味着服务器会对文件检查新鲜度，返回结果可能是 304，也有可能是 200。

### 用户按 Ctrl+F5

浏览器不仅会对本地文件过期，而且不会带上 `If-Modifed-Since`，`If-None-Match`，相当于之前从来没有请求过，返回结果是 200。

### 地址栏回车

浏览器发起请求，按照正常流程，本地检查是否过期，然后服务器检查新鲜度，最后返回内容。

最后还可以提到，你注意到很多网站的资源后面都加了版本号，这样做的目的是：每次升级了 JS 或 CSS 文件后，为了防止浏览器进行缓存，强制改变版本号，客户端浏览器就会重新下载新的 JS 或 CSS 文件 ，以保证用户能够及时获得网站的最新更新。

### 缓存的资源都存在哪里

按优先级从高到低分别是：

- **Service Worker**：运行在 JavaScript 主线程之外，虽然由于脱离了浏览器窗体无法直接访问 DOM，但是它可以完成离线缓存、消息推送、网络代理等功能。

- **Memory Cache**：就是内存缓存，它的效率最快，但是存活时间最短，你一关掉浏览器 Memory Cache 里的文件就被清空了。

- **Disk Cache：Cache** 资源被存储在硬盘上，存活时间比 Memory Cache 要持久很多。

- **Push Cache**：即推送缓存，这是浏览器缓存的最后一道防线。它是 HTTP/2 中的内容，虽然现在应用的并不广泛，但随着 HTTP/2 的推广，它的应用越来越广泛。

## Node 演示

```js
const http = require("http");
const fs = require("fs");
const md5 = require("md5");

function handle(req, res) {
  const html = fs.readFileSync("index.html", "utf-8");
  const script = fs.readFileSync("script.js", "utf-8");

  if (req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.write(html);
  }

  if (req.url === "/script.js") {
    const etag = md5(script);
    const lastMidified = lastUpdatedDate("./script.js");
    const ifNoneMatch = req.headers["if-none-match"];

    let statusCode = ifNoneMatch === etag ? 304 : 200;

    res.writeHead(statusCode, {
      "Content-Type": "text/javascript",
      "Cache-Control": "no-cache",
      "Last-Modified": lastMidified,
      Etag: etag
    });
    res.write(script);
  }
  res.end();
}

function lastUpdatedDate(file) {
  const { mtime } = fs.statSync(file);
  return mtime;
}

http.createServer(handle).listen(8000);
```

## 参考资料

- [浏览器是怎么缓存资源的](https://www.imooc.com/read/68/article/1558)
- [能不能说一说前端缓存](http://47.98.159.95/my_blog/perform/001.html#%E5%BC%BA%E7%BC%93%E5%AD%98)
- [浏览器缓存 cache-control etag](https://www.jianshu.com/p/4667d0425878)
