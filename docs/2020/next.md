# Next.js 使用总结

## SSR VS CSR

### 概念

SSR 即服务端渲染（Server Side Rendering），对应的就是 CSR ，客户端渲染（Client Side Rendering）。

区别：

- SSR，由服务端把渲染的完整的页面吐给客户端，减少了一次客户端到服务端的一次 http 请求，加快相应速度，一般用于首屏的性能优化
- CSR，它依赖的是运行在客户端的 JS，用户首次发送请求只能得到小部分的指引性 HTML 代码。第二次请求将会请求更多包含 HTML 字符串的 JS 文件。

作用：

- SSR 返回的页面是完整的 HTML 页面，有利于首屏渲染，以及 SEO，比如 PHP 等
- CSR 是包含有 js 链接的 script 标签，有利于页面交互，比如 React、Vue 等

### 同构

由于服务端渲染的页面交互能力有限，如果要实现复杂交互，还是要通过引入 js 文件来辅助实现，我们把页面的展示内容和交互写在一起，让代码执行两次，这种方式就叫 **同构**。

对于一些 js 操作，如事件绑定，dom 操作等，在服务端渲染的 html 文本无法执行，所以这些 js 逻辑必须是在浏览器端才能执行，这里我们将目标页面的代码，在浏览器进行二次渲染：

```js
ReactDOM.hydrate(<Intro />, document.getElementById('root'))
```

与 `render()` 相同，但它用于在 ReactDOMServer 渲染的容器中对 HTML 的内容进行 hydrate 操作。React 会尝试在已有标记上绑定事件监听器。

看到这里，会有个疑问：在 Node 环境下，是没有 DOM 这个概念存在的，那 Node 环境下执行，必定会报错，那为何 React 它们就不会报错呢？这一切源于 React 的虚拟 DOM。

因为使用的是虚拟 DOM，而虚拟 DOM 是真实 DOM 的一个 JavaScript 对象映射，React 在做页面操作时，实际上不是直接操作 DOM，而是操作虚拟 DOM，也就是操作普通的 JavaScript 对象，这就使得 SSR 成为了可能。在服务器，我可以操作 JavaScript 对象，判断环境是服务器环境，我们把虚拟 DOM 映射成字符串输出；在客户端，我也可以操作 JavaScript 对象，判断环境是客户端环境，我就直接将虚拟 DOM 映射成真实 DOM，完成页面挂载。

关于 SSR 原理讲得比较好的一篇文章：[React 中同构（SSR）原理脉络梳理](https://zhuanlan.zhihu.com/p/47044039)。

## Next.js

功能：

- 服务器端渲染(默认)
- 自动代码切分, 加速页面加载
- 简单的客户端路由(基于页面)
- 基于 Webpack 的开发环境, 支持热模块替换(HMR: Hot Module Replacement)
- 使用 React 的 JSX 和 ES6 的 module，模块化和维护更方便
- 可以使用 Express 或其他 Node.js 服务器实现
- 使用 Babel 和 Webpack 配置定制

## 静态文件服务

Next.js 支持将静态文件（例如图片）存放到根目录下的 public 目录中，并对外提供访问。public 目录下存放的静态文件的对外访问路径以 (/) 作为起始路径。如：

```tree
public
├── favicon.ico
├── robots.txt
├── static
│   ├── css
│   │   └── animate.min.css
│   ├── img
│   │   └── logo.png
│   └── js
│       └── wow.min.js
└── vercel.svg
```

然后直接引入：`<img src="/static/img/logo.png" />`，public 文件夹还可用于存放 `robots.txt`、`favicon.ico`等静态文件。

## 自定义 `Document`

pages 下自定义`_document.js`，这里可以配置一些通用 meta 信息，以及埋点信息等，如：

```js
<Head>
  <meta content="yes" name="apple-mobile-web-app-capable" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="renderer" content="webkit" />
  <meta property="og:image" content="https://www.zhixi.com/favicon.ico" />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        ;(function (para) {
          if (typeof window['sensorsDataAnalytic201505'] !== 'undefined') {
            return false
          }
          window['sensorsDataAnalytic201505'] = para.name
          window[para.name] = {
            para: para,
          }
        })({
          is_track_single_page: true, // !important
          name: 'sensors',
          server_url: 'https://sa.aunload.com:4006/sa?project=${process.env.sa}',
          heatmap: {},
          show_log: false
        })
      `,
    }}
  />
  <script src="https://cdn-oss-static.aunbox.cn/Sensors/sensorsdata.min.js"></script>
  <script dangerouslySetInnerHTML={{ __html: `sensors.quick('autoTrack');` }} />
</Head>
```

## 自定义配置文件

在根目录下增加 `next.config.js` 文件，比如配置了 env:

```js
module.exports = {
  env: {
    sa: process.env.SA_ENV || 'production',
    topic: '知犀思维导图',
  },
}
```

## 获取数据

注意：getInitialProps 不能使用在子组件中，只能使用在 pages 中

```js
import fetch from 'isomorphic-unfetch'

const Post = props => {
  if (props && props.show) {
    return (
      <>
        <h1>{props.show.name}</h1>
        <p>{props.show.summary.replace(/<[/]?p>/g, '')}</p>
        <img src={props.show.image ? props.show.image.medium : ''} />
      </>
    )
  }
}

Post.getInitialProps = async function (context) {
  const { id } = context.query
  const res = await fetch(`http://api.tvmaze.com/shows/${id}`)
  const show = await res.json()

  return { show }
}

export default Post
```

## 项目打包

- `next build` 打包项目；
- `next start` 启动打包后的项目，先运行 `next build` 命令才能运行该命令；

{
"scripts": {
"dev": "next",
"build": "next build",
"start": "next start",
}
}

## 配置 Babel

在根目录下增加 `.babelrc` 文件，由于使用了 Ant Design of React，为了兼容 IE11，需要添加相应的 Polyfill，在内置的`next/babel`里可以直接使用`targets`配置：

```js
{
  "presets": [
    [
      "next/babel",
      {
        "preset-env": {
          "targets": {
            "ie": 11
          }
        }
      }
    ]
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd"
      }
    ]
  ]
}
```

## 绝对路径引用

在根目录下增加 `jsconfig.json` 文件

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  }
}
```

## 使用 react-redux

### 项目结构

使用[www.mindatoz.cn](http://gitlab.kxhz.cc/AunboxFE/mindatoz/www.mindatoz.cn)项目中的结构：

```tree
├── store
│   ├── index.js
│   ├── modules
│   │   └── user.js
│   └── rootReducer.js
```

### rootReducer.js

```js
import { combineReducers } from 'redux'
import { reducer as user } from './modules/user'

export default combineReducers({
  user,
})
```

### `modules/user.js` 部分内容

引入 `immer`

```js
import produce, { enableES5 } from 'immer'
import { profileService } from '@kxhz/user-service-sdk'

enableES5() // 兼容IE

// Actions Types
export const types = {
  SAVE_USER_INFO: 'USER/SAVE_USER_INFO',
  SAVE_LOGIN_STATUS: 'USER/SAVE_LOGIN_STATUS',
}

// Reducer
const initState = {
  userInfo: {},
  isLogin: false,
}

export function reducer(state = initState, action = {}) {
  switch (action.type) {
    case types.SAVE_USER_INFO:
      return produce(state, draft => {
        draft.userInfo = action.data
      })
    case types.SAVE_LOGIN_STATUS:
      return produce(state, draft => {
        draft.isLogin = action.data
      })
    default:
      return state
  }
}

// Action Creators
export const saveUserInfo = data => ({
  type: types.SAVE_USER_INFO,
  data,
})

export const saveLoginStatus = data => ({
  type: types.SAVE_LOGIN_STATUS,
  data,
})

// 获取用户信息、更新用户信息
export const getUserInfo = (token = {}) => {
  return async dispatch => {
    const res = await profileService.getProfile()
    if (res && !res.code) {
      dispatch(saveUserInfo(res))
      dispatch(saveLoginStatus(true))
    }
  }
}
```

### index.js

引入 `redux redux-thunk`

```js
import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './rootReducer'

// redux_devtools
const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const store = createStore(
  rootReducer,
  /* preloadedState, */ composeEnhancers(applyMiddleware(thunkMiddleware))
)

export default store
```

### \_app.js

在`pages/_app.js`下引入 `react-redux`，`next-redux-wrapper`:

```js
import { Provider } from 'react-redux'
import { createWrapper } from 'next-redux-wrapper'
import store from '@/store'

function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

const wrapper = createWrapper(() => store)

export default wrapper.withRedux(MyApp)
```

### 使用 Hooks 获取、更新

```js
import { useSelector, useDispatch } from 'react-redux'
import { getUserInfo } from '@/store/modules/user.js'

const Account = () => {
  // useSelector 获取状态
  const { userInfo, isLogin, token } = useSelector(state => state.user)

  // useDispatch 更新状态
  const dispatch = useDispatch()

  //获取用户信息
  useEffect(() => {
    if (isLogin) {
      dispatch(getUserInfo(token))
    }
  }, [isLogin])

  return <>111</>
}

export default Account
```

### 使用 Class 获取、更新

如果使用了 Class，需要借助 connect 高阶组件函数:

```js
import { connect } from 'react-redux'

class DrawingWrap extends Component {...}

const mapStateToProps = (state) => ({ user: state.user })
const mapDispatchToProps = (dispatch) => ({
  getUserInfo: (token) => dispatch(getUserInfo(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawingWrap)
```

## 自定义启动服务

在根目录下增加如 `server-local.js`，并在 package.json 配置启动，这样就可以通过访问本机 ip 同步测试跨端浏览器：

```js
"scripts": {
  "dev:local": "next build && node server-local.js",
}
```

```js
const { createServer } = require('http')
const os = require('os')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = 3100
const myHost = getLocalIP()

function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (let devName in interfaces) {
    const iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)

    handle(req, res, parsedUrl)
  }).listen(PORT, err => {
    if (err) throw err
    console.log(`Server running at http://${myHost}:${PORT}`)
  })
})
```

## 参考资料

- [Next.js 全解](https://juejin.cn/post/6876818735395831822)
- [SSR VS CSR ,一次讲个通透](https://zhuanlan.zhihu.com/p/60975107)
- [React 从 CSR 到 SSR：第一篇](https://zhuanlan.zhihu.com/p/53972376)
- [从零开始，揭秘 React 服务端渲染核心技术](https://segmentfault.com/a/1190000019916830)
- [React 中同构（SSR）原理脉络梳理](https://zhuanlan.zhihu.com/p/47044039)
- [Next.js 使用指南 1－基本规则](http://jartto.wang/2018/05/27/nextjs-1/)
- [React SSR 简介与 Next.js 使用入门](https://cloud.tencent.com/developer/article/1597458)
