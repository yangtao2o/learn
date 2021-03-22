# 关于 HTTP 命令行、抓包工具

## Curl

curl 是常用的命令行工具，用来请求 Web 服务器。它的名字就是客户端（client）的 URL 工具的意思。它的功能非常强大，命令行参数多达几十种。如果熟练的话，完全可以取代 Postman 这一类的图形界面工具。

curl 命令是一个利用 URL 规则在命令行下工作的文件传输工具。它支持文件的上传和下载，所以是综合传输工具，但按传统，习惯称 curl 为下载工具。作为一款强力工具，curl 支持包括 HTTP、HTTPS、ftp 等众多协议，还支持 POST、cookies、认证、从指定偏移处下载部分文件、用户代理字符串、限速、文件大小、进度条等特征。做网页处理流程和数据检索自动化，curl 可以祝一臂之力。

抓取较为完整请求-应答内容：

```shell
curl -v www.baidu.com
```

只打印响应头部信息`-I`或`-head`：

```shell
curl -I www.baidu.com
```

设置 Cookie：

```shell
curl http://man.linuxde.net --cookie "user=root;pass=123456"
```

- [curl 命令](https://man.linuxde.net/curl)
- 阮一峰[curl 的用法指南](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)

## Tcpdump

tcpdump 命令是一款 sniffer 工具，它可以打印所有经过网络接口的数据包的头信息，也可以使用-w 选项将数据包保存到文件中，方便以后分析。

tcpdump 通常作为标准的软件包被默认安装，可以执行 “tcpdump” 命令来确定是否已安装了 tcpdump。

```shell
~ ❯❯❯ tcpdump -h
tcpdump version tcpdump version 4.9.3 -- Apple version 90.60.1
libpcap version 1.9.1
LibreSSL 2.2.7
Usage: tcpdump [-aAbdDefhHIJKlLnNOpqStuUvxX#] [ -B size ] [ -c count ]
    [ -C file_size ] [ -E algo:secret ] [ -F file ] [ -G seconds ]
    [ -i interface ] [ -j tstamptype ] [ -M secret ] [ --number ]
    [ -Q in|out|inout ]
    [ -r file ] [ -s snaplen ] [ --time-stamp-precision precision ]
    [ --immediate-mode ] [ -T type ] [ --version ] [ -V file ]
    [ -w file ] [ -W filecount ] [ -y datalinktype ] [ -z postrotate-command ]
    [ -g ] [ -k ] [ -o ] [ -P ] [ -Q meta-data-expression]
    [ --apple-tzo offset] [--apple-truncate]
    [ -Z user ] [ expression ]
```

tcpdump 是命令行界面的（CUI），wireshark 是图形用户界面的（GUI），Wireshark 相对 tcpdump 而言，界面更友好、功能更强大。

可以指定 host 及端口，例如截获所有`www.baidu.com`的主机收到的和发出的所有的数据包：

```shell
sudo tcpdump host www.baidu.com and port 443
tcpdump: data link type PKTAP
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on pktap, link-type PKTAP (Apple DLT_PKTAP), capture size 262144 bytes
00:53:07.860010 IP 112.80.248.75.https > bogon.53865: Flags [F.], seq 3033805754, ack 194332148, win 1248, length 0
00:53:07.860112 IP bogon.53865 > 112.80.248.75.https: Flags [.], ack 1, win 4096, length 0
```

- [tcpdump 命令](https://man.linuxde.net/tcpdump)

## Wireshark

Wireshark（前称 Ethereal）是当今世界最流行的网络协议嗅探、抓包和分析工具，它使我们得以窥探网络上流动的数据及其协议细节。
网络管理员使用 Wireshark 来检测网络问题；网络安全工程师使用 Wireshark 来检查网络安全相关问题；开发者可以使用 Wireshark 来开发调试新的通信协议；普通使用者可以使用 Wireshark 来学习网络协议栈相关的知识。

- 支持协议：所有网络数据包协议
- 解包协议：IPsec，ISAKMP，Kerberos，SNMPv3，SSL/TLS，WEP/WPA/WPA2
- 支持平台：Windows，Linux，macOS，Solaris，FreeBSD，NetBSD
- 性质：免费、开源
- 官网：https://www.wireshark.org

## Fiddler

Fiddler 是位于客户端和服务器端的 HTTP 代理，也是目前最常用的 http 抓包工具之一 。 它能够记录客户端和服务器之间的所有 HTTP 请求，可以针对特定的 HTTP 请求，分析请求数据、设置断点、调试 web 应用、修改请求的数据，甚至可以修改服务器返回的数据，功能非常强大，是 web 调试的利器。

- 支持协议：应用层（http、https ），调试 web 应用、修改 http 请求和响应数据；重定向请求数据，DNS 欺骗，手机 app 抓包等
- 支持平台：Windows，Linux，macOS
- 性质：免费
- 官网：https://pc.qq.com/detail/10/detail_3330.html

## Charles

Charles 是一款 HTTP 代理/HTTP 监视器/反向代理工具，使开发人员可以查看其计算机与 Internet 之间的所有 HTTP 和 SSL/HTTPS 通信。这包括请求，响应和 HTTP 标头（其中包含 cookie 和缓存信息）等。

- 支持协议：应用层（http、https ），调试 web 应用、修改 http 请求和响应数据；重定向请求数据，DNS 欺骗，手机 app 抓包等
- 支持平台：Windows，Linux，macOS
- 性质：收费
- 官网：https://www.charlesproxy.com

## QPA

一款开源开放的基于进程抓包、可自学习特征、提供正则表达式识别引擎的智能分析软件。主要应用于应用行为分析、应用特征提取，入侵行为分析、入侵规则提取等领域。支持长时间抓包与存储、支持大文件报文分析。

- **进程抓包**：QPA 是基于进程抓包的，实时准确判定每个包所属进程，优于仅基于网卡抓包的软件
- **分析智能**：QPA 按流量类型自动归类，分析简便，优于基于一条条会话的分析模式
- **识别引擎**：QPA 是基于正则表达式书写规则，能提取 IP、端口、报长与内容等维度特征

- 支持协议：应用层（http、https ），进程抓包等
- 支持平台：windows(XP|Win7|Win8|Win10) linux
- 性质：免费、开源
- 官网：http://www.l7dpi.com

## 参考资料

- [5 款常用《网络抓包工具》](https://www.uedbox.com/post/59475/)
- [Mac OS X 上使用 Wireshark 抓包](https://blog.csdn.net/phunxm/article/details/38590561)
- [Wireshark for mac破解版合集](https://mac.orsoon.com/z/Wireshark.html)