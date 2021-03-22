# TCP

## 定义

传输控制协议（TCP）是一个面向连接的协议，保证了两台计算机之间数据传输的可靠性和顺序。

Node HTTP 服务器是构建于 Node TCP 服务器之上的。

TCP 的特性：

- 面向连接的通信和保证顺序的传递
- 面向字节 - ASCII、Unicode
- 可靠性
- 流控制
- 拥堵控制 - Qos

Socket 是对 TCP 协议的一种封装方式，Socket 本身不是协议，而是一个编程接口。

## telnet 允许在终端手动建立一个 TCP 连接

### 服务端

使用 Node.js 写一个 web 服务器，并监听 3000 端口，然后 `node app.js` 运行下是否正确

```js
require("http")
  .createServer(function(req, res) {
    res.writeHead(200);
    res.end("Hello world");
  })
  .listen(3000);
```

### TCP 连接

使用`telnet 127.0.0.1 3000`建立一个连接，然后输入`GET / HTTP/1.1`，回车两次，然后服务器端就出现了响应：

```bash
~ telnet 127.0.0.1 3000

Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
GET / HTTP/1.1

HTTP/1.1 200 OK
Date: Sun, 15 Sep 2019 06:20:43 GMT
Connection: keep-alive
Transfer-Encoding: chunked

b
Hello world
0

Connection closed by foreign host.
```

总结：

- 成功建立了一个 TCP 连接
- 创建了一个 HTTP 请求
- 接收到一个 HTTP 响应
- 到达的数据和在 Node.js 中写的一样

## 基于 TCP 的聊天程序

```js
const net = require("net");

let count = 0,
  users = {};

const server = net.createServer(function(conn) {
  let nickname;

  conn.setEncoding("utf8");
  conn.write(
    "\n > 欢迎访问 \033[92mNode-Chat\033[39m!" +
      "\n > " +
      count +
      "个其他用户已连接" +
      "\n > 请输入你的用户名并回车："
  );

  count++;

  conn.on("data", function(data) {
    data = data.replace("\r\n", "");
    console.log(data);

    if (!nickname) {
      if (users[data]) {
        conn.write("\033[93m> 昵称已被使用，请重试：\033[39m ");
        return;
      } else {
        nickname = data;
        users[nickname] = conn;
        console.log("users: ", conn);
        broadcast("\033[90m > " + nickname + " 上线了\033[39m\n");
      }
    } else {
      broadcast("\033[96m > " + nickname + ":\033[39m " + data + "\n", true);
    }
  });

  conn.on("close", function() {
    count--;
    delete users[nickname];
    broadcast("\033[90m > " + nickname + " 下线了\033[39m\n");
  });
  // 向每一个用户发送信息
  function broadcast(msg, exceptMyself) {
    for (let i in users) {
      if (!exceptMyself || i != nickname) {
        users[i].write(msg);
      }
    }
  }
});
server.listen(3000, function() {
  console.log("\033[96m  server listening on *: 3000\033[39m");
});
```

单独运行：`telnet 127.0.0.1 3000`，比如：

```bash
~ telnet 127.0.0.1 3000

Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.

 > 欢迎访问 Node-Chat!
 > 0个其他用户已连接
 > 请输入你的用户名并回车：XiaoMing
 > XiaoMing 上线了
Hi
 > HanMeimei 上线了
 > HanMeimei: Hello
 > LiSi 上线了
 > LiSi: Ni hao ma?

# 第二位用户
 > 欢迎访问 Node-Chat!
 > 1个其他用户已连接
 > 请输入你的用户名并回车：HanMeimei
 > HanMeimei 上线了
Hello

# 第三位用户
 > 欢迎访问 Node-Chat!
 > 2个其他用户已连接
 > 请输入你的用户名并回车：LiSi
 > LiSi 上线了
Ni hao ma?
```
