# Vue.js 实战之前端路由与 vue-router

## 前端路由与 vue-router

### 什么是前端路由

> 每次 GET 或者 POST 请求在服务端有一个专门的正则配置列表，然后匹配到具体的一条路径后，分发到不同的 Controller，进行各种操作，最终将 html 或数据返回给前端，这就完成了一次 IO。

前端路由的实现  有两种：

- URL 的 hash，即锚点（#），js 通过 hashChange 事件监听 url 的变化
- HTML5 的 History 模式

优点：

- 页面持久性，如音乐网站
- 前后端彻底分离，如 Angular 的 ngRouter，React 的 ReactRouter，还有 Vue 的 vue-router

需要考虑的问题：

- 页面的拔插性
- 页面的生命周期
- 内存管理等

### vue-router 基本用法

```bash
# 新建目录 router
# 安装 vue-router
npm i -S vue-router

# index.js添加
import VueRouter from 'vue-router';
Vue.use(VueRouter);

```

在目录 router 新建 views 目录，接着新建 about.vue、 index.vue、 user.vue 等

```javascript
// index.js
const Routers = [
  {
    path: "/index",
    component: (resolve) => require(["../router/views/index.vue"], resolve),
  },
  {
    path: "/about",
    component: (resolve) => require(["../router/views/about.vue"], resolve),
  },
  {
    path: "*",
    redirect: "../index", // 404指向首页
  },
];

const RouterConfig = {
  // 使用HTML5的history路由模式
  mode: "history",
  routes: Routers,
};

const router = new VueRouter(RouterConfig);

document.body.appendChild(root);

new Vue({
  router: router,
  render: (h) => h(App),
}).mount(root);
```

路由模式通过 HTML5 的 History 路由模式，通过 ‘/’设置路径。修改 package.json:

```json
"scripts": {
  "dev": "webpack-dev-server --config webpack.config.js --mode=development --history-api-fallback"
},
```

增加了 `--history-api-fallback`，所有的路由都指向`index.html`。

然后在根实例`App.vue`中添加`<router-view></router-view>`

### 跳转

vue-router 有两种跳转页面的方式：

- `<router-link>`组件，会渲染成  `<a>` 标签，如：`<router-link to="/about">跳转到 about</router-link>`
  - tag : `tag="li"` 标签会被渲染成指定的 `<li>`
  - replace : 无历史记录
  - active-class
- 使用 router 实例： `router` 方法，如：`this.router.push('/index');`
  - replace : `this.router.replace('/index')`;
  - go : `this.router.go(-1)`;

### 高级用法

> 问题：如何在 SPA 项目中，修改网页的标题？

一般我们是通过`window.document.title = '标题'`来修改，但是在什么时候修改，这是个问题。

vue-router 提供了导航钩子 `beforeEach()` 和 `afterEach()`，它们会在路由即将改变前和改变后触发。

这样就解决了页面众多，维护麻烦的问题。（mounted 钩子）

```javascript
router.beforeEach((to, from, next) => {
  // 从路由对象 to 里获取 meta 信息
  window.document.title = to.meta.title;
  // 判断页面是否登录
  if (window.localStorage.getItem("token")) {
    next();
  } else {
    next("/login");
  }
});

router.afterEach((to, from, next) => {
  // 页面跳转回来滚动条默认在顶端
  window.scroll(0, 0);
});
```

## 状态管理与 Vuex

### 状态管理与使用场景

组件的基本运行模式：一个组件分为数据和视图，数据更新时，视图也跟着更新...视图中又可以绑定一些事件，它们触发 methods 里指定的方法，从而可以改变数据、更新视图。

如果需要跨组件共享数据的需求，那就需要借助 Vuex 来管理组件状态。

### Vuex 基本用法

```bash
npm i -S vuex
```

### 高级用法

## 实战：中央事件总线插件 vue-bus(loading...)

> [练习地址](https://github.com/yangtao2o/vue-webpack-iview))
