# WebSocket

## 为什么需要 WebSocket

因为 HTTP 协议有一个缺陷：通信只能由客户端发起。

这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。我们只能使用"轮询"：每隔一段时候，就发出一个询问，了解服务器有没有新的信息。最典型的场景就是聊天室。

轮询的效率低，非常浪费资源（因为必须不停连接，或者 HTTP 连接始终打开）。因此，工程师们一直在思考，有没有更好的方法。WebSocket 就是这样发明的。

## 特点

它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。

其他特点包括：

1. 建立在 TCP 协议之上，服务器端的实现比较容易。
1. 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
1. 数据格式比较轻量，性能开销小，通信高效。
1. 可以发送文本，也可以发送二进制数据。
1. 没有同源限制，客户端可以与任意服务器通信。
1. 协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL。

```text
ws://example.com:80/some/path
```

## 举个栗子

```js
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) {
  console.log("Connection open ...");
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log("Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};
```

## Client-Server 通信

### Client

```js
const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", function(event) {
  console.log("Connection open ...");
  socket.send("Hello Server!");
});

socket.addEventListener("message", function(event) {
  console.log("Message from server: ", event.data);
  socket.close();
});

socket.addEventListener("close", function(event) {
  console.log("Connection closed.");
});
```

### Server

```shell
npm install ws
```

```js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("something");
});
```

### HTTP server

```js
const http = require("http");
const WebSocket = require("ws");
const url = require("url");

const server = http.createServer();
const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });

wss1.on("connection", function connection(ws) {
  // ...
});

wss2.on("connection", function connection(ws) {
  // ...
});

server.on("upgrade", function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === "/foo") {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit("connection", ws, request);
    });
  } else if (pathname === "/bar") {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8080);
```

## 参考资料

- 阮一峰[WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)
- MDN [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [Node ws](https://github.com/websockets/ws)
- [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)
