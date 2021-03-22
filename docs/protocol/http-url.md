# 浏览器输入 URL 之后

## 大致流程

- 浏览器中输入网址，判断强缓存是否失效
- 域名解析（DNS），找到 IP 服务器
- 发起 TCP 连接，HTTP 三次握手,发送请求（Request）
- 服务器响应 HTTP(Response)
- 浏览器下载资源： html css js images
- 浏览器解析代码：构建 DOM 树、样式计算、生成布局树
- 浏览器渲染：建立图层树(Layer Tree)、生成绘制列表、生成图块并栅格化、显示器显示内容

## 学习资料

- [说一说从输入URL到页面呈现发生了什么？——网络篇](http://47.98.159.95/my_blog/browser-render/001.html) - 神三元
- [当我们在浏览器中输入一个 URL 后，发生了什么？](https://kmknkk.xin/2018/03/04/%E5%BD%93%E6%88%91%E4%BB%AC%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E8%BE%93%E5%85%A5%E4%B8%80%E4%B8%AAURL%E5%90%8E%EF%BC%8C%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88%EF%BC%9F/)
- [「真 ® 全栈之路 - DNS 篇」故事从输入 URL 开始.....](https://juejin.im/post/5ceebb7251882507266414b7)
- [在浏览器输入 URL 回车之后发生了什么（超详细版）](https://4ark.me/post/b6c7c0a2.html)
- [what-happens-when-zh_CN](https://github.com/skyline75489/what-happens-when-zh_CN) - 超超超详细版
