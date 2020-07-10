# Chrome 浏览器扩展

## Chrome 插件的通信机制

### 界面划分

1. 内容脚本 content_scripts.js —— 能够读取浏览器网页的详细信息（DOM）
2. 后台脚本 background.js —— 主要是通过监听浏览器事件来触发，具体有全局配置, 事件监听, 业务转发等
3. 交互界面 popup.js —— 注册 browser_action，主要是图标、弹出窗口页面 popup.html，Commands 命令等

### 功能权限

1. 声明权限 —— `permissions`
2. 给用户选项 —— `options_page`
3. 最佳性能 —— 尽可能延迟
4. 保护用户隐私 —— 减少所需权限、选择可选权限、限制和加密用户信息
5. 调试扩展方法

### 身份验证、CSP、跨域

1. OAuth2 —— 使用户可以在不共享用户名，密码和其他私有凭据的情况下，向 Web 和桌面应用程序授予对私有信息的访问权限
2. 辅助功能（a11y）
3. 内容安全政策（CSP）—— `content_security_policy`
4. 跨域 XMLHttpRequest —— `permissions`

### 通信机制

由于同源策略的限制，content_script 想要与其他扩展（popup.js 或 background.js）进行通信，需要借助浏览器通信 API。

### popup 和 background 相互通信

```js
// popup.js
chrome.runtime.sendMessage({
  action: "getSource",
  source: JSON.stringify(DOMtoString()),
});

// background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getSource") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // 一些操作。。。
    });
  }
});
```

也可以直接通信：

```js
// background.js
var getData = (data) => {
  console.log("拿到数据:" + data);
};

// popup.js
let bgObj = chrome.extension.getBackgroundPage();
bgObj.getData(); // 访问bg的函数
```

### popup 和 content_scripts 通信

popup.js

```js
// 发送消息
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, "activeBtn", function (response) {
    console.log(response);
  });
});

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting == "hello") sendResponse({ farewell: "goodbye" });
});
```

content_script.js

```js
// 接收消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message == "activeBtn") {
    // ...
    sendResponse({ farewell: "激活成功" });
  }
});

// 发送消息
chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
  console.log(response, document.body);
  // document.body.style.backgroundColor="orange"
});
```

### 数据存储

`chrome.storage` 用来针对插件全局进行数据存储，类似于 Redux 中的 Store 概念，所以其他扩展都可以获取到：

```js
// 保存数据
chrome.storage.sync.set({ imgArr: imgArr }, function () {
  console.log("保存成功");
});

// 获取数据
chrome.storage.sync.get("imgArr", function (data) {
  console.log(data);
});
```

详细文档可以参考：

- [Chrome 扩展(插件)开发教程](https://dev.crxhome.org/)
- [30 分钟开发一款抓取网站图片资源的浏览器插件](https://juejin.im/post/5e8ea783f265da47f60eae7e)

## 参考资料

- [30 分钟开发一款抓取网站图片资源的浏览器插件](https://juejin.im/post/5e8ea783f265da47f60eae7e)
- [一篇文章教你顺利入门和开发 chrome 扩展程序（插件）](https://juejin.im/post/5c135a275188257284143418)
- [【干货】Chrome 插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)
- [Chrome 浏览器插件开发:进阶](https://xu3352.github.io/javascript/2019/09/03/google-chrome-extension-tutorials-01)
- [Chrome 扩展(插件)开发教程](https://dev.crxhome.org/)
- [360 极速浏览器应用开放平台](http://open.chrome.360.cn/extension_dev/overview.html)
- [Chrome 扩展中文教程](http://chrome.cenchy.com/index.html)
- [Eagle](https://cn.eagle.cool/) —— Eagle 可以轻松管理大量图片、视频、音频素材，满足素材「收藏、整理、查找」的各种场景，支持 Mac 与 Windows 系统
