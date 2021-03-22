# Cookie、Session、LocalStorage 以及 SessionStorage

## 前言

- Session 是在服务端保存的一个数据结构，用来跟踪用户的状态，这个数据可以保存在集群、数据库、文件中；
- Cookie 是客户端保存用户信息的一种机制，用来记录用户的一些信息，也是实现 Session 的一种方式；
- LocalStorage 是 Web Storage API 的一种类型，能在浏览器端存储键值对数据；
- SessionStorage 只存储当前会话页(tab 页)的数据，一旦用户关闭当前页或者浏览器，数据就自动被清除掉了。

## Cookie

在网站中，http 请求是无状态的。也就是说即使第一次和服务器连接后并且登录成功后，第二次请求服务器依然不能知道当前请求是哪个用户。

cookie 的出现就是为了解决这个问题，第一次登录后服务器返回一些数据（cookie）给浏览器，然后浏览器保存在本地，当该用户发送第二次请求的时候，就会自动的把上次请求存储的 cookie 数据自动的携带给服务器，服务器通过浏览器携带的数据就能判断当前用户是哪个了。

cookie 存储的数据量有限，不同的浏览器有不同的存储大小，但一般不超过 4KB。因此使用 cookie 只能存储一些小量的数据。

**Cookie 的优点：**

- 能用于和服务端通信
- 当 cookie 快要自动过期时，我们可以重新设置而不是删除

**Cookie 缺点：**

- 增加了文档传输的负载
- 只能存储少量的数据
- 只能存储字符串
- 潜在的 安全问题（通过服务端设置 httpOnly）

解决办法：Web Storage API (Local and Session Storage)。

创建，读取，更新和删除 Cookie：

```js
// 读取
document.cookie;

// 修改/更新
document.cookie = "testname=Yangtao";

// 删除，设置expires的过期时间
document.cookie = "testname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

客户端设置：

```js
(function() {
  var getAndSetCookie = {
    init: function() {
      this.checkCookie();
    },
    // 设置cookie，同一域名都可获取
    setCookie: function(name, value, exdays) {
      var exdays = exdays || 1;
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      document.cookie =
        name + "=" + escape(value) + ";path=/;expires=" + d.toGMTString();
    },
    // 读取cookies，判断是否存在设置的name
    getCookie: function(name) {
      var name = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    checkCookie: function(pc) {
      var user = this.getCookie("msgCookie");
      if (user == "") {
        this.setCookie("msgCookie", "msgCookie", 1);
      }
    }
  };
  // init
  getAndSetCookie.init();
})();
```

Node 设置：

```js
// 获取 cookie 过期时间
const getCookieExpires = () => {
const d = new Date();
d.setTime(d.getTime() + 24 _ 60 _ 60 \* 1000);
return d.toGMTString();
};

// 设置
res.setHeader(
"Set-Cookie",
`username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`
);

// 解析 cookie
req.cookie = {};
const cookieStr = req.headers.cookie || ""; // "k1=v1; k2=v2; k3=v3"
cookieStr.split(";").forEach(item => {
  if (!item) {
    return;
  }
  const str = item.split("=");
  const key = str[0].trim();
  const val = str[1].trim();

  req.cookie[key] = val;
});
```

## Session

session 和 cookie 的作用有点类似，都是为了存储用户相关的信息。不同的是，cookie 是存储在本地浏览器，而 session 存储在服务器。

存储在服务器的数据会更加的安全，不容易被窃取。但存储在服务器也有一定的弊端，就是会占用服务器的资源，所以就用到了 redis。

**Session 的问题：**

- session 是一个变量存在 nodejs 进程内存中
- 进程内存有限，访问量过大，内存容易暴增
- 线上多为多进程，进程间内存无法共享
- 可以借助 redis 解决

## Cookie+Session

cookie 和 session 的使用已经出现了一些非常成熟的方案。在如今的市场或者企业里，一般有两种存储方式：

**1、存储在服务端**

通过 cookie 存储一个 session_id，然后具体的数据则是保存在 session 中。如果用户已经登录，则服务器会在 cookie 中保存一个 session_id，下次再次请求的时候，会把该 session_id 携带上来，服务器根据 session_id 在 session 库中获取用户的 session 数据。就能知道该用户到底是谁，以及之前保存的一些状态信息。这种专业术语叫做 `server side session`。

**2、将 session 数据加密，然后存储在 cookie 中**

这种专业术语叫做 `client side session`。

**总结：**

- 存储在浏览器的一段字符串
- 跨域不共享
- 可以存储结构化数据，格式为："k1=v1; k2=v2; k3=v3"
- 浏览器可以使用 JavaScript 修改 cookie（有限制）
- 每次发送 http 请求，都将请求域的 cookie 一起发给 server
- server 可以修改 cookie，并返给浏览器

```js
const SESSION_DATA = {};
let needSetCookie = false;

const serverHandle = (req, res) => {
  // 解析 session
  let userId = req.cookie.userid;
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];

  // 操作 cookie
  if (needSetCookie) {
    res.setHeader(
      "Set-Cookie",
      `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
    );
  }
  // ...

  // 获取username并赋值
  if (data.username) {
    req.session.username = data.username;
    return new SuccessModel();
  }
  // 然后返回
  if (req.session.username) {
    return Promise.resolve(
      new SuccessModel({
        session: req.session
      })
    );
  }
};
```

**详细内容：**[登录](https://github.com/yangtao2o/node-blog-express-koa2/blob/master/docs/signin.md)

## LocalStorage

Local Storage 是 Web Storage API 的一种类型，能在浏览器端存储键值对数据。

Local Storage 因提供了更直观和安全的 API 来存储简单的数据，被视为替代 Cookies 的一种解决方案。从技术上说，尽管 Local Storage 只能存储字符串，但是它也是可以存储字符串化的 JSON 数据。这就意味着，Local Storage 能比 Cookies 存储更复杂的数据。

创建，读取，更新和删除 Local Storage：

```js
// Create
const user = { name: "Bob", age: 25 };
localStorage.setItem("user", JSON.stringify(user));

// Read (Single)
console.log(JSON.parse(localStorage.getItem("user")));

// Update
const updatedUser = { name: "Bob", age: 24 };

localStorage.setItem("user", JSON.stringify(updatedUser));

// Delete
localStorage.removeItem("user");
```

**Local Storage 的优点：** 相比于 Cookie，其提供了更直观地接口来存储数据更安全,能存储更多数据。

**Local Storage 的缺点：** 只能存储字符串数据，浏览器支持`IE8+/Edge/Firefox 2+/Chrome/Safari 4+/Opera 11.5+(caniuse)`

## SessionStorage

Session Storage 和 Local Storage 非常类似，区别是 Session Storage 只存储当前会话页(tab 页)的数据，一旦用户关闭当前页或者浏览器，数据就自动被清除掉了。

创建，读取，更新和删除 Session Storage：

```js
// Create
const user = { name: 'Bob', age: 25 }sessionStorage.setItem('user', JSON.stringify(user))

// Read (Single)
console.log( JSON.parse(sessionStorage.getItem('user')) )

// Update
const updatedUser = { name: 'Bob', age: 24 }

sessionStorage.setItem('user', JSON.stringify(updatedUser))

// Delete
sessionStorage.removeItem('user')
```

sessionStorage、localStorage、cookie 都是在浏览器端存储的数据。

其中，sessionStorage 的概念很特别，引入了一个“浏览器窗口”的概念，sessionStorage 是在同源的同窗口中，始终存在的数据，也就是说只要这个浏览器窗口没有关闭，即使刷新页面或进入同源另一个页面，数据仍然存在，关闭窗口后 sessionStorage 就会被销毁，同时“独立”打开的不同窗口，即使同一页面，sessionStorage 对象也是不同的。

## 客户端存储方式异同

**cookie，sessionStorage 和 localStorage 的区别？**

- cookie 是网站为了标示用户身份而储存在用户本地终端（Client Side）上 的数据（通常经过加密）- cookie 数据始终在同源的 http 请求中携带（即使不需要），记会在浏 览器和服务器间来回传递
- sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地 保存

**存储大小：**

- cookie 数据大小不能超过 4k
- sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大

**有效期（生命周期）：**

- localStorage: 存储持久数据，浏览器关闭后数据不丢失，除非主动删除数据
- sessionStorage: 数据在当前浏览器窗口关闭后自动删除
- cookie: 设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭

## 参考资料

- 自己博客项目中[什么是 cookie](https://github.com/yangtao2o/node-blog-express-koa2/blob/master/docs/signin.md)
- [COOKIE 和 SESSION 有什么区别？](https://www.zhihu.com/question/19786827)
- [浅谈 cookie，sessionStorage，localStorage](https://baijiahao.baidu.com/s?id=1652697788741886713&wfr=spider&for=pc)
