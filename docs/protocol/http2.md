# HTTP2

## HTTP1.1 的问题

- 线头阻塞：TCP 连接只能发送一个请求，前面的请求未完成前，后续的请求都在排队等待;
- 为了加快速度，过度依赖于多个 TCP 连接并发请求，但是建立 TCP 连接成本很高;
- 头部冗余，格式是文本格式;
- 客户端需要主动请求。

## HTTP2 的新特性

- 新的**二进制格式**（Binary Format），HTTP1.x 的解析是基于文本。基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认 0 和 1 的组合。基于这种考虑 HTTP2.0 的协议解析决定采用二进制格式，实现方便且健壮。

- **多路复用**（MultiPlexing），即连接共享，即每一个 request 都是是用作连接共享机制的。一个 request 对应一个 id，这样一个连接上可以有多个 request，每个连接的 request 可以随机的混杂在一起，接收方可以根据 request 的 id 将 request 再归属到各自不同的服务端请求里面。

- **header 压缩**，如上文中所言，对前面提到过 HTTP1.x 的 header 带有大量信息，而且每次都要重复发送， HTTP2.0 使用 encoder 来减少需要传输的 header 大小，通讯双方各自 cache 一份 header fields 表，既避免了重复 header 的传输，又减小了需要传输的大小。

- **服务端推送**（server push），同 SPDY 一样，HTTP2.0 也具有 server push 功能。目前，有大多数网站已经启用 HTTP2.0，例如 YouTuBe，淘宝网等网站。

## 学习资料

- [（建议精读）HTTP灵魂之问，巩固你的 HTTP 知识体系](https://juejin.im/post/5e76bd516fb9a07cce750746) - 作者整理的非常详细
- [前端必须懂的计算机网络知识—(HTTP)](https://juejin.im/post/5ba9d5075188255c652d4208)
- [计算机网络：这是一份全面& 详细 HTTP 知识讲解](https://www.jianshu.com/p/a6d086a3997d)