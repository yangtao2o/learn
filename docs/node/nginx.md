# Nginx

## Nginx 特点

- 高性能的 web 服务器，开源免费
- 一般用于做静态服务、负载均衡
- 反向代理

## Nginx 简单使用

### 下载

Windows：[http://nginx.org/en/download.html](http://nginx.org/en/download.html)

MacOS: 

```shell
brew install nginx
```

### 配置

Windows:

```shell
C:\nginx\conf\nginx.conf
```

Mac:
```shell 
/usr/local/etc/nginx/nginx.conf
```

### 常用命令

```shell
# 测试配置文件格式是否正确
nginx -t
nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful

# 启动
nginx

# 重启
nginx -s reload

# 停止
nginx -s stop
```

修改 `nginx.conf`:

```shell
cd /usr/local/etc/nginx

open nginx.conf
# 或者 nano nginx.conf
# 或者 vi nginx.conf
```

### Vim 快速使用

vim 的基本三种模式：**命令模式**、**插入模式**、**底行模式**

- 进入 vim：`vim test.c` （刚进入是命令模式，不可输入文字）
- 命令模式 --> 插入模式

```text
1.输入a   （进入后，是从目前光标所在位置的下一位置开始输入文字）
2.输入i    （进入后，是从光标当前所在位置开始输入文字）
3.输入o   （进入后，是插入新的一行，从行首开始输入文字）
```

- 命令模式 --> 底行模式：输入 `：`
- 不管当前是插入模式，还是底行模式，都要按 Esc 退入到命令模式才能进入其它模式
- 退出 vim 切换到底行模式 输入 q 退出

```text
1.输入：w（保存当前文件）
2.输入：wq（保存并退出）
3.输入：q!（强制退出）
```

## Nginx 反向代理

**正向代理**帮助客户端访问客户端自己访问不到的服务器，然后将结果返回给客户端。

**反向代理**拿到客户端的请求，将请求转发给其他的服务器，主要的场景是维持服务器集群的负载均衡，换句话说，反向代理帮其它的服务器拿到请求，然后选择一个合适的服务器，将请求转交给它。

因此，两者的区别就很明显了，正向代理服务器是帮客户端做事情，而反向代理服务器是帮其它的服务器做事情。

好了，那 Nginx 是如何来解决跨域的呢？

比如说现在客户端的域名为`client.com`，服务器的域名为`server.com`，客户端向服务器发送 Ajax 请求，当然会跨域了，那这个时候让 Nginx 登场了，通过下面`nginx.conf`这个配置：

```conf
server {
  listen  80;
  server_name  client.com;
  location /api {
    proxy_pass server.com;
  }
}
```

Nginx 相当于起了一个跳板机，这个跳板机的域名也是`client.com`，让客户端首先访问 `client.com/api`，这当然没有跨域，然后 Nginx 服务器作为反向代理，将请求转发给`server.com`，当响应返回时又将响应给到客户端，这就完成整个跨域请求的过程。

## 实战操作

Github地址：[Node-Blog](https://github.com/yangtao2o/node-blog-express-koa2)

首先，启动我们的接口服务：

```shell
cd node-blog
npm run dev

# http://localhost:8000
```

接着，启动我们的前端资源服务：

```shell
cd html-test
http-server -p 8001
# Available on:
#   http://127.0.0.1:8001
```

这样，我们要访问的是 `localhost:8080`，首页下的内容我们需要代理到 `http://localhost:8000`，而接口处于另一个端口：`http://localhost:8001`，所以：

打开 `nginx.conf` 文件，设置：

```conf
#user  nobody;
worker_processes  2;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       8080;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        # location / {
        #     root   html;
        #     index  index.html index.htm;
        # }

        location / {
            proxy_pass http://localhost:8001;
        }

        location /api/ {
            proxy_pass http://localhost:8000;
            proxy_set_header Host $host;
        }

    }

    include servers/*;
}
```

主要修改：

```conf
location / {
    proxy_pass http://localhost:8001;
}

location /api/ {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
}
```

然后访问：`http://localhost:8080`，确保redis、mysql 已开启

接着，测试增删改查等功能，基本上没有问题。
