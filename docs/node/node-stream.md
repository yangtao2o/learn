# Node.js stream

## 基本概念

- 管道换水的图（本课程中用到很多遍），以及 source.pipe(dest) 这个模型
- 为何使用 stream ，解决的本质问题是什么？—— 一次性 IO 操作的性能问题
- stream 的常用场景：网络 IO 和文件 IO

## get 请求

- node.js 处理 http 请求
- response 就是一个 writeable stream
- stream 在 http 请求中的性能提升
- ab 工具的使用，以及测试结果的简单分析

## post 请求

- 如何使用 postman 发送 post 请求
- request 就是一个 readable stream
- 如何使用 ab 工具测试 post 请求

## 文件操作

- node.js 的文件操作，特别是用 stream 的方式操作
- 使用 stream 对文件操作带来的性能提升
- 使用 memeye 进行 nodejs 内存监控

## readline

- readline 本质也是 stream
- readline 是 node.js 按行读取文件的最佳选择
- readline 的使用，以及本节的分析日志的案例

## buffer

- 二进制和字节（byte）的基本认识，以及 node.js 中二进制的表示
- stream 中的 chunk 是二进制格式，可以转换为字符串
- 二进制格式在 http 请求中的性能提升

## stream 类型

- stream 的常见类型：readable writeable duplex
- readable stream 的用法和本质
- writeable stream 的用法和本质
- pipe 的新规则

## 参考资料

- [两小时学会 Node.js stream](https://www.imooc.com/read/8) - 慕课网专栏