# 什么是 SSO 与 CAS

单点登录的英文名叫做：Single Sign On（简称 SSO）。顾名思义，它把两个及以上个产品中的用户登录逻辑抽离出来，达到只输入一次用户名密码，就能同时登录多个产品的效果。

CAS（Central Authentication Service）中心授权服务，本身是一个开源协议。

从结构上看，CAS 包含两个部分： CAS Server 和 CAS Client。CAS Server 需要独立部署，主要负责对用户的认证工作；CAS Client 负责处理对客户端受保护资源的访问请求，需要登录时，重定向到 CAS Server。

## Cookie 和 Session

Cookie 会根据从服务器端发送的响应报文内的一个叫做 Set-Cookie 的首部字段信息，通知客户端保存 Cookie。当下次客户端再往该服务器发送请求时，客户端会自动在请求报文中加入 Cookie 值后发送出去。
服务器端发现客户端发送过来的 Cookie 后，会去检查究竟是从哪一个客户端发来的连接请求，然后对比服务器上的记录，最后得到之前的状态信息。

如果说 Cookie 是检查用户身上的”通行证“来确认用户的身份，那么 Session 就是通过检查服务器上的”客户明细表“来确认用户的身份的。Session 相当于在服务器中建立了一份“客户明细表”。

HTTP 协议是无状态的，Session 不能依据 HTTP 连接来判断是否为同一个用户。于是乎：服务器向用户浏览器发送了一个名为 JESSIONID 的 Cookie，它的值是 Session 的 id 值。

其实 Session 是依据 Cookie 来识别是否是同一个用户。

所以，一般我们单系统实现登录会这样做：

- 登录：将用户信息保存在 Session 对象中
  - 如果在 Session 对象中能查到，说明已经登录
  - 如果在 Session 对象中查不到，说明没登录（或者已经退出了登录）
- 注销（退出登录）：从 Session 中删除用户的信息
- 记住我（关闭掉浏览器后，重新打开浏览器还能保持登录状态）：配合 Cookie 来用

## 参考资料

- [什么是单点登录（SSO）](https://zhuanlan.zhihu.com/p/66037342)
- [什么是 SSO 与 CAS](https://www.cnblogs.com/btgyoyo/p/10722010.html)
- [OAuth 2.0 的四种方式](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
