# HTTP

HTTP 是一种**超文本传输协议**(`Hypertext Transfer Protocol`)，超文本传输协议可以进行文字分割：

- 超文本（Hypertext）
- 传输（Transfer）
- 协议（Protocol）

按照范围的大小： 协议 > 传输 > 超文本。

即，**HTTP** 是一个在计算机世界里专门在两点之间传输文字、图片、音频、视频等超文本数据的约定和规范。

## HTTP 请求特征

- 支持**客户-服务器**模式
- **简单快速**：客户向服务器请求服务时，只需传送请求方法和路径。请求方法常用的有 GET、HEAD、POST。每种方法规定了客户与服务器联系的类型不同。由于 HTTP 协议简单，使得 HTTP 服务器的程序规模小，因而通信速度很快。
- **灵活**：HTTP 允许传输任意类型的数据对象。正在传输的类型由 Content-Type 加以标记。
- **无连接**：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。
- **无状态**：HTTP 协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。

## HTTP 报文组成

HTTP 协议主要由三大部分组成：

- **起始行**（start line）：描述请求或响应的基本信息；
- **头部字段**（header）：使用 key-value 形式更详细地说明报文；
- **消息正文**（entity）：实际传输的数据，它不一定是纯文本，可以是图片、视频等二进制数据。

其中起始行和头部字段并成为 **请求头** 或者 **响应头**，统称为 **Header**；消息正文也叫做实体，称为 **body**。

HTTP 协议规定每次发送的报文必须要有 Header，但是可以没有 body，也就是说头信息是必须的，实体信息可以没有。而且在 header 和 body 之间必须要有一个**空行**（CRLF）。

比如使用`curl`工具请求`www.baidu.com`：

```shell
> GET / HTTP/1.1             # 请求起始行
> Host: www.baidu.com        # 请求头头部字段
> User-Agent: curl/7.64.1
> Accept: */*
>                            # 空行 CRLF
< HTTP/1.1 200 OK            # 响应状态行
< Accept-Ranges: bytes       # 响应头头部字段
< Cache-Control: private, no-cache, no-store, proxy-revalidate, no-transform
< Connection: keep-alive
< Content-Length: 2381
< Content-Type: text/html
< Date: Thu, 26 Mar 2020 04:40:40 GMT
< Etag: "588604f8-94d"
< Last-Modified: Mon, 23 Jan 2017 13:28:24 GMT
< Pragma: no-cache
< Server: bfe/1.0.8.18
< Set-Cookie: BDORZ=27315; max-age=86400; domain=.baidu.com; path=/
<                            # 空行 CRLF
<!DOCTYPE html>              # 实体 Body
<!--STATUS OK--><html> <head>...
```

每个报文的起始行都是由三个字段组成：**方法、URL 字段和 HTTP 版本字段**。

## HTTP 请求方法

主要有：

- `GET` 获取资源
- `POST` 向服务器端发送数据，传输实体主体
- `PUT` 传输文件
- `HEAD` 获取报文首部
- `DELETE` 删除文件
- `OPTIONS` 询问支持的方法
- `TRACE` 追踪路径

### 方法含义

**GET 获取资源**，GET 方法用来请求访问已被 URI 识别的资源。指定的资源经服务器端解析后返回响应内容。也就是说，如果请求的资源是文本，那就保持原样返回；

**POST 传输实体**，虽然 GET 方法也可以传输主体信息，但是便于区分，我们一般不用 GET 传输实体信息，反而使用 POST 传输实体信息，

**PUT 传输文件**，PUT 方法用来传输文件。就像 FTP 协议的文件上传一样，要求在请求报文的主体中包含文件内容，然后保存到请求 URI 指定的位置。

但是，鉴于 HTTP 的 PUT 方法自身不带验证机制，任何人都可以上传文件 , 存在安全性问题，因此一般的 Web 网站不使用该方法。若配合 Web 应用程序的验证机制，或架构设计采用 REST（`REpresentational State Transfer`，表征状态转移）标准的同类 Web 网站，就可能会开放使用 PUT 方法。

**HEAD 获得响应首部**，HEAD 方法和 GET 方法一样，只是不返回报文主体部分。用于确认 URI 的有效性及资源更新的日期时间等。

**DELETE 删除文件**，DELETE 方法用来删除文件，是与 PUT 相反的方法。DELETE 方法按请求 URI 删除指定的资源。

**OPTIONS 询问支持的方法**，OPTIONS 方法用来查询针对请求 URI 指定的资源支持的方法。

**TRACE 追踪路径**，TRACE 方法是让 Web 服务器端将之前的请求通信环回给客户端的方法。

**CONNECT 要求用隧道协议连接代理**，CONNECT 方法要求在与代理服务器通信时建立隧道，实现用隧道协议进行 TCP 通信。主要使用 SSL（`Secure Sockets Layer`，安全套接层）和 TLS（`Transport Layer Security`，传输层安全）协议把通信内容加密后经网络隧道传输。

### GET 和 POST 有什么区别

首先最直观的是语义上的区别。

而后又有这样一些具体的差别:

- 从**缓存**的角度，GET 请求会被浏览器主动缓存下来，留下历史记录，而 POST 默认不会。
- 从**编码**的角度，GET 只能进行 URL 编码，只能接收 ASCII 字符，而 POST 没有限制。
- 从**参数**的角度，GET 一般放在 URL 中，因此不安全，POST 放在请求体中，更适合传输敏感信息。
- 从**幂等性**的角度，GET 是幂等的，而 POST 不是。(幂等表示执行相同的操作，结果也是相同的)
- 从**TCP**的角度，GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)

## 请求 URL

**URI**, 全称为(Uniform Resource Identifier), 也就是统一资源标识符，它的作用很简单，就是区分互联网上不同的资源。

但是，它并不是我们常说的网址, 网址指的是 URL, 实际上 URI 包含了 URN 和 URL 两个部分，由于 URL 过于普及，就默认将 URI 视为 URL 了。

如：

- 协议 （HTTP）
- 登录信息（username:password）不常用
- 主机名（www.baidu.com）
- 端口号 （80/443）
- 路径 （/a.html）
- 查询参数 （limit=1）
- hash 值（hash，服务器收不到 hash 值，一般为前端的路由跳转）

### URI 编码

URI 只能使用**ASCII**, ASCII 之外的字符是不支持显示的，而且还有一部分符号是界定符，如果不加以处理就会导致解析出错。

因此，URI 引入了编码机制，将所有非 ASCII 码字符和界定符转为十六进制字节值，然后在前面加个%。如，空格被转义成了`%20`。

## 协议/版本号

表示报文使用的 HTTP 协议版本，如：`HTTP/1.1`。

## 请求头部

HTTP 的请求标头分为四种： **通用标头**、**请求标头**、**响应标头**和**实体标头**。MDN：[HTTP Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)。

```shell
curl -v www.baidu.com

Host: www.baidu.com
User-Agent: curl/7.64.1
Accept: */*
```

### 通用标头(General Header)

通用标头主要有三个，分别是 `Date`、`Cache-Control` 和 `Connection`。

```http
Cache-Control: private, no-cache, no-store, proxy-revalidate, no-transform
Connection: keep-alive
Date: Thu, 26 Mar 2020 03:43:47 GMT
```

**Date**：格林威治标准时间，这个时间要比北京时间慢八个小时。

**Cache-Control**：

- `max-age`：资源被认为仍然有效的最长时间，与 Expires 不同，这个请求是相对于 request 标头的时间，而 Expires 是相对于响应标头。（请求标头）
- `s-maxage`：重写了 max-age 和 Expires 请求头，仅仅适用于共享缓存，被私有缓存所忽略（这块不理解，看完响应头的 Cache-Control 再进行理解）（请求标头）
- `max-stale`：表示客户端将接受的最大响应时间，以秒为单位。（响应标头）
  min-fresh: 表示客户端希望响应在指定的最小时间内有效。（响应标头）

**Connection**：

Connection 有两种，一种是持久性连接，即一次事务完成后不关闭网络连接`Connection: keep-alive`，另一种是非持久性连接，即一次事务完成后关闭网络连接`Connection: close`。

| 首部字段名       | 说明                       |
| ---------------- | -------------------------- |
| Cache-Control    | 控制缓存行为               |
| Connection       | 链接的管理                 |
| Date             | 报文日期                   |
| Pragma           | 报文指令                   |
| Trailer          | 报文尾部的首部             |
| Trasfer-Encoding | 指定报文主体的传输编码方式 |
| Upgrade          | 升级为其他协议             |
| Via              | 代理服务器信息             |
| Warning          | 错误通知                   |

### 请求标头(Request Header)

```http
GET /home.html HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/testpage.html
Connection: keep-alive
Upgrade-Insecure-Requests: 1
If-Modified-Since: Mon, 18 Jul 2016 02:36:04 GMT
If-None-Match: "c561c68d0ba92bbeb8b0fff2a9199f722e3a621a"
Cache-Control: max-age=0
```

| 首部字段名          | 说明                                          |
| ------------------- | --------------------------------------------- |
| Accept              | 用户代理可处理的媒体类型                      |
| Accept-Charset      | 优先的字符集                                  |
| Accept-Encoding     | 优先的编码                                    |
| Accept-Langulage    | 优先的语言                                    |
| Authorization Web   | 认证信息                                      |
| Expect              | 期待服务器的特定行为                          |
| From                | 用户的电子邮箱地址                            |
| Host                | 请求资源所在的服务器                          |
| If-Match            | 比较实体标记                                  |
| If-Modified-Since   | 比较资源的更新时间，用于缓存                  |
| If-None-Match       | 比较实体标记                                  |
| If-Range            | 资源未更新时发送实体 Byte 的范围请求          |
| If-Unmodified-Since | 比较资源的更新时间(和 If-Modified-Since 相反) |
| Max-Forwards        | 最大传输跳数                                  |
| Proxy-Authorization | 代理服务器需要客户端认证                      |
| Range               | 实体字节范围请求                              |
| Referer             | 请求中的 URI 的原始获取方                     |
| TE                  | 传输编码的优先级                              |
| User-Agent HTTP     | 客户端程序的信                                |

### 实体标头(Entity Header Fields)

实体标头是描述消息正文内容的 HTTP 标头。实体标头用于 HTTP 请求和响应中。头部`Content-Length`、 `Content-Language`、 `Content-Encoding` 是实体头。

| 首部字段名       | 说明                         |
| ---------------- | ---------------------------- |
| Allow            | 资源可支持的 HTTP 方法       |
| Content-Encoding | 实体主体适用的编码方式       |
| Content-Language | 实体主体的自然语言           |
| Content-Length   | 实体主体的大小（单位：字节） |
| Content-Location | 替代对应资源的 URI           |
| Content-MD5      | 实体主体的报文摘要           |
| Content-Range    | 实体主体的位置范围           |
| Content-Type     | 实体主体的媒体类型           |
| Expires          | 实体主体过期的日期时间       |
| Last-Modified    | 资源的最后修改日期时间       |

### 响应表头

```http
200 OK
Access-Control-Allow-Origin: *
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Mon, 18 Jul 2016 16:06:00 GMT
Etag: "c561c68d0ba92bbeb8b0f612a9199f722e3a621a"
Keep-Alive: timeout=5, max=997
Last-Modified: Mon, 18 Jul 2016 02:36:04 GMT
Server: Apache
Set-Cookie: mykey=myvalue; expires=Mon, 17-Jul-2017 16:06:00 GMT; Max-Age=31449600; Path=/; secure
Transfer-Encoding: chunked
Vary: Cookie, Accept-Encoding
x-frame-options: DENY
```

响应状态码：

- **1XX Informational(信息性状态码)**
- **2XX Success(成功状态码)**
  - 200(OK 客户端发过来的数据被正常处理
  - 204(Not Content 正常响应，没有实体
  - 206(Partial Content 范围请求，返回部分数据，响应报文中由 content-Range 指定实体内容)
- **3XX Redirection(重定向)**
  - 301(Moved Permanently) 永久重定向
  - 302(Found)临时重定向，规范要求，方法名不变，但是都会改变
  - 303(See Other) 和 302 类似，但必须用 GET 方法
  - 304(Not Modified)状态未改变，配合(If-Match、If-Modified-Since、If-None_Match、If-Range、If-Unmodified-Since)
  - 307(Temporary Redirect) 临时重定向，不该改变请求方法
- **4XX Client Error(客户端错误状态码)**
  - 400(Bad Request) 请求报文语法错误
  - 401 (unauthorized) 需要认证
  - 403(Forbidden) 服务器拒绝访问对应的资源
  - 404(Not Found) 服务器上无法找到资源
- **5XX Server Error(服务器错误状态吗)**
  - 500(Internal Server Error)服务器故障
  - 503(Service Unavailable)服务器处于超负载或正在停机维护

| 首部字段名         | 说明                         |
| ------------------ | ---------------------------- |
| Accept-Ranges      | 是否接受字节范围请求         |
| Age                | 推算资源创建经过时间         |
| ETag               | 资源的匹配信息               |
| Location           | 令客户端重定向至指定 URI     |
| Proxy-Authenticate | 代理服务器对客户端的认证信息 |
| Retry-After        | 对再次发起请求的时机要求     |
| Server             | HTTP 服务器的安装信息        |
| Vary               | 代理服务器缓存的管理信息     |
| WWW-Authenticate   | 服务器对客户端的认证信息     |

### 内容协商

内容协商主要有以下 3 种类型：

- 服务器驱动协商（Server-driven Negotiation）
- 客户端驱动协商（Agent-driven Negotiation）
- 透明协商（Transparent Negotiation），是服务器驱动和客户端驱动的结合体，是由服务器端和客户端各自进行内容协商的一种方法。

内容协商的分类有很多种，主要的几种类型是：

- `Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`
- `Accept-Charset: unknown`
- `Accept-Language: en-US,en;q=0.5`
- `Accept-Encoding: gzip, deflate, br`
- Content-Language

## 关于 Accept 系列字段

对于 Accept 系列字段的介绍分为四个部分: **数据格式**、**压缩方式**、**支持语言**和**字符集**。

### 数据格式

**MIME 类型**是一系列消息内容类型的集合。类型体现在`Content-Type`这个字段和`Accept`字段。

那么 MIME 类型都有哪些呢？

- 文本文件： text/html、text/plain、text/css、application/xhtml+xml、application/xml
- 图片文件： image/jpeg、image/gif、image/png
- 视频文件： video/mpeg、video/quicktime
- 应用程序二进制文件： application/json、application/javascript、application/pdf、application/octet-stream、application/octet-stream、application/zip

### 压缩方式

体现在了`Content-Encoding`字段和`Accept-Encoding`字段上。这个字段的取值有下面几种：

- **gzip**: 当今最流行的压缩格式
- **deflate**: 另外一种著名的压缩格式
- **br**: 一种专门为 HTTP 发明的压缩算法

### 支持语言

`Content-Language`字段和`Accept-Language`：

```shell
# 接收端
Accept-Language: zh-CN, zh, en
# 发送端
Content-Language: zh-CN, zh, en
```

### 字符集

最后是一个比较特殊的字段, 在接收端对应为`Accept-Charset`，指定可以接受的字符集，而在发送端直接放在了`Content-Type`中，以 charset 属性指定。如：

```shell
# 接收端
Accept-Charset: charset=utf-8
# 发送端
Content-Type: text/html; charset=utf-8
```

它们之间的关系：

| 接收端                 | 发送端           |
| ---------------------- | ---------------- |
| Accept, Accept-Charset | Content-Type     |
| Accept-Encoding        | Content-Encoding |
| Accept-Language        | Content-Language |

## HTTP 的优点和缺点

### HTTP 的优点

- 简单灵活易扩展
- 应用广泛、环境成熟
- 可靠传输，请求-应答
- 无状态

### HTTP 的缺点

- 无状态

既然服务器没有记忆能力，它就无法支持需要连续多个步骤的事务操作。每次都得问一遍身份信息，不仅麻烦，而且还增加了不必要的数据传输量。由此出现了 Cookie 技术。

- 明文传输

HTTP 协议里还有一把优缺点一体的双刃剑，就是明文传输。明文意思就是协议里的报文（准确地说是 header 部分）不使用二进制数据，而是用简单可阅读的文本形式。

对比 TCP、UDP 这样的二进制协议，它的优点显而易见，不需要借助任何外部工具，用浏览器、Wireshark 或者 tcpdump 抓包后，直接用肉眼就可以很容易地查看或者修改，为我们的开发调试工作带来极大的便利。
当然缺点也是显而易见的，就是不安全，可以被监听和被窥探。因为无法判断通信双方的身份，不能判断报文是否被更改过。

- 队头阻塞问题

当 http 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，那么当前请求耗时过长的情况下，其它的请求只能处于阻塞状态

- 性能

HTTP 的性能不算差，但不完全适应现在的互联网，还有很大的提升空间。

## 学习资料

- [看完这篇 HTTP，跟面试官扯皮就没问题了](https://juejin.im/post/5e1870736fb9a02fef3a5dcb) - 从概念出发，梳理了各个名字的基本含义
- [（建议精读）HTTP 灵魂之问，巩固你的 HTTP 知识体系](https://juejin.im/post/5e76bd516fb9a07cce750746) - 作者整理的非常详细
- [HTTP 协议学习太枯燥？那我们看图吧～](https://juejin.im/post/5e198194e51d451c88361977) - 可以当做手册学习
- [前端必须懂的计算机网络知识—(HTTP)](https://juejin.im/post/5ba9d5075188255c652d4208)
- [前端必须懂的计算机网络知识—(跨域、代理、本地存储)](https://juejin.im/post/5bb1cc2af265da0ae5052496)
- [计算机网络：这是一份全面& 详细 HTTP 知识讲解](https://www.jianshu.com/p/a6d086a3997d)
- [面试带你飞：这是一份全面的 计算机网络基础 总结攻略](https://juejin.im/post/5ad7e6c35188252ebd06acfa)
- [「真 ® 全栈之路 - DNS 篇」故事从输入 URL 开始.....](https://juejin.im/post/5ceebb7251882507266414b7)
- [在浏览器输入 URL 回车之后发生了什么（超详细版）](https://4ark.me/post/b6c7c0a2.html)
- [一次完整的 HTTP 请求与响应涉及了哪些知识？](https://www.jianshu.com/p/c1d6a294d3c0)
- [深入理解 Http 请求、DNS 劫持与解析](https://juejin.im/post/59ba146c6fb9a00a4636d8b6)
- [漫画：用故事说透 HTTPS](https://juejin.im/post/5df7959051882512480a83e7)
