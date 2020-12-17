# 前端实现 token 过期时,无痛刷新方式

## 问题

项目中，在处理用户请求时，如果用户的 token 已过期，会触发刷新 token 的请求，请求有两种结果：

- code 1200，自动刷新成功
- code 1201，自动刷新失败，需要退出登录

一般情况下，自动刷新的时候用户是无感知的，也就是说，假设本次操作刚好触发 token 已过期，那么，刷新 token 成功之后，此时应该是继续响应之前的操作，不应该阻塞用户的本次操作。

这是问题一，建立在只有一次请求基础上，那我们只需要等待刷新 token 成功后的新 token，再次请求之前的操作即可。

那如果不止一次请求，如何在刷新 token 之后，继续响应这不止一次的请求呢？如果按照单次请求的逻辑，那每次请求都会重新刷新 token，在同一时间里会刷新 token 多次，很容易触发 1201，导致用户被迫下线的风险。

综上所述：

- 问题一：如何拦截用户的请求，并判断是否需要刷新 token
- 问题二：如何实现用户同一时间里多次请求，但只刷新一次 token

## 使用 umi-request 拦截器

首先，在项目中使用了[umi-request](https://github.com/umijs/umi-request/blob/master/README_zh-CN.md)，所以拦截器就是按照 umi-request 来建立的。

```js
import { extend } from 'umi-request'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

/**
 * Error Handler
 */
const errorHandler = error => {
  const { response, data } = error
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText
    const { status, url } = response
    console.error('Response Error', {
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    })
  }
  if (data && data.code && data.message) {
    console.error('Response Data', {
      code: data.code,
      message: data.message,
    })
  }
  return response
}

/**
 * Resquest Handler
 */

const resquestHandler = (url, options) => {
  const { Authorization } = options.headers
  const { access_token } = store.getState().user.token

  // 注意可以跨域的字段，详细内容可通过 Response Headers 的 Access-Control-** 去匹配
  let headers = access_token && {
    Authorization: `Bearer ${access_token}`,
  }
  if (Authorization) {
    headers = { Authorization }
  }

  return {
    url,
    options: {
      ...options,
      headers: {
        ...options.headers,
        ...headers,
      },
      interceptors: true,
    },
  }
}

/**
 * Response Handler
 */

const responseHandler = async (response, options) => {
  // 克隆响应对象做解析处理
  const res = await response.clone().json()
  if (res && res.NOT_LOGIN) {
    location.href = '/'
  }
  return response
}

/**
 * Create a new instance of umi-request
 */

// 通过 extend 新建一个 umi-request 实例
const request = extend({
  prefix: '/v1/api',
  timeout: 5000,
  headers: {
    appId: '80001001',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache', // 兼容 IE11
  },
  errorHandler, // 提前对响应做异常处理
})

// request interceptor, change url or options.
request.interceptors.request.use(resquestHandler)
// response interceptor, chagne response
request.interceptors.response.use(responseHandler)

export { request }
```

## 拦截用户请求，判断是否需要刷新 token

### responseHandler

针对这个问题，我们可以依据上述完成的拦截器，只需要在 responseHandler 里做判断即可。如下所示：

```js
const responseHandler = async (response, options) => {
  // 克隆响应对象做解析处理
  const res = await response.clone().json()
  if (res.code === 1200) {
    const { refresh_token } = store.getState().user.token
    const res = await accountLoginService.get_new_token(refresh_token)
    store.dispatch(onLogon(res))
    // 拿到最新结果，再次发起请求
    return request(response.url, {
      ...options,
      prefix: '',
      params: {},
      headers: {
        Authorization: 'Bearer ' + res.access_token,
      },
    })
  } else if (res.code === 1201) {
    store.dispatch(onLogout())
  }
  return response
}
```

### 模拟实际效果

我们用一下代码来模拟下实际效果：

```js
const request = () => console.log('重新请求当前接口')
const refreshToken = refresh_token => {
  console.log('refreshToken 接口请求')
  return {
    access_token: '111',
    refresh_token: '333',
  }
}

const responseHandler = async (res = {}) => {
  console.log(1)
  if (res.code === 1200) {
    console.log(2)
    const refresh_token = '222'
    const res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(refreshToken(refresh_token))
      }, 100)
    })
    console.log(3)
    // 拿到token最新结果，再次发起请求
    return request(res)
  }
  console.log('4走response')
  return true
}

// 发起请求
responseHandler({ code: 1200 })
```

直接在浏览器输出：

```txt
1
2
refreshToken 接口请求
3
重新请求当前接口
```

那如果多次请求呢？比如请求两次：

```js
1
2
1
2
refreshToken 接口请求
3
重新请求当前接口
// 第二次
refreshToken 接口请求
3
重新请求当前接口
```

结果显示会依次请求两次，很符合我们的逻辑，所以，接下来我们就是想办法解决多次请求的问题。

## 如何避免同时多个请求多次刷新 token

### 思路

首先，同时间触发刷新 token，我们只请求第一个去拿最新 token，那后面其他的请求怎么办?

其次，我们可以将其他请求存到一个队列中，等待使用最新 token，然后依次执行队列中的每一项，但如何让其处于等待状态呢？

所以，解决等待的问题，需要借助 Promise 的特性了。

### Promise 特性

一个 Promise 必然处于以下几种状态之一：

- 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
- 已兑现（fulfilled）: 意味着操作成功完成。
- 已拒绝（rejected）: 意味着操作失败。

当异步代码执行成功时，会调用 resolve(), 失败时就会调用 reject()

```js
const res = await new Promise((resolve, reject) => {
  // 使用 setTimeout 来模拟异步代码
  setTimeout(() => {
    resolve(refreshToken(refresh_token)) //代码正常执行！
  }, 100)
})
```

当同时有多个请求时，我们将请求存进队列中，同时返回一个未 resolve 的 Promise，让这个 Promise 一直处于 Pending 状态，当刷新请求的接口返回来后，我们再调用 resolve，依次执行队列里的每一项。

### 模拟实际情况

```js
let isRefreshing = false // 是否正在刷新
const refresh_token = '222'
const subscribers = [] // 重试队列，每一项将是一个待执行的函数形式
const addSubscriber = listener => subscribers.push(listener)

// 刷新 token api 模拟
const refreshToken = refresh_token => {
  console.log('refreshToken 请求')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        access_token: '111',
        refresh_token: '333',
      })
    }, 100)
  })
}

// 请求token
const refreshTokenRequest = async refresh_token => {
  const res = await refreshToken(refresh_token)
  // 将所有存储到观察者数组中的请求重新执行
  notifySubscriber(res.access_token)
  // 恢复刷新
  isRefreshing = false
}

// 多个请求api模拟
const request = (target = 1) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(console.log('重新请求当前接口' + target))
    }, 100)
  })

// 执行被缓存等待的接口事件
const notifySubscriber = (newToken = '') => {
  console.log('执行被缓存等待的接口事件')
  subscribers.forEach(callback => callback(newToken))
  subscribers.length = 0
}

const responseHandler = async (res = {}, target) => {
  console.log(1)
  if (res.code === 1200) {
    console.log(2)
    if (!isRefreshing) {
      isRefreshing = true
      refreshTokenRequest(refresh_token)
    }
    console.log(3)
    // 拿到token最新结果，再次发起请求
    return new Promise((resolve, reject) => {
      console.log('new Promise')
      addSubscriber(() => resolve(request(target)))
    })
  }
  console.log('4走response')
  return true
}

// 多次请求模拟
responseHandler({ code: 1200 }, 1)
responseHandler({ code: 1200 }, 2)
responseHandler({ code: 1200 }, 3)
```

执行结果如下，非常符合我们的预期，不仅只刷新一次 token，而且会继续执行被拦截的多次请求。

```txt
1
2
refreshToken 请求
3
new Promise
1
2
3
new Promise
1
2
3
new Promise
执行被缓存等待的接口事件
重新请求当前接口1
重新请求当前接口2
重新请求当前接口3
```

### 完整代码

模拟已经实现了，接下来就是在拦截器里继续完善相关逻辑：

```js
let isRefreshing = false // 是否正在刷新
const subscribers = [] // 重试队列，每一项将是一个待执行的函数形式

const addSubscriber = listener => subscribers.push(listener)

// 执行被缓存等待的接口事件
const notifySubscriber = (newToken = '') => {
  subscribers.forEach(callback => callback(newToken))
  subscribers.length = 0
}

// 刷新 token 请求
const refreshTokenRequst = async () => {
  const { refresh_token } = window.localStorage.getItem('token')
  try {
    const res = await refreshToken(refresh_token)
    notifySubscriber(res.access_token)
  } catch (e) {
    console.error('请求刷新 token 失败')
  }
  isRefreshing = false
}

// 判断如何响应
function checkStatus(response, options) {
  const { url } = response
  if (!isRefreshing) {
    isRefreshing = true
    refreshTokenRequst()
  }

  // 正在刷新 token，返回一个未执行 resolve 的 promise
  return new Promise(resolve => {
    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
    addSubscriber(newToken => {
      const newOptions = {
        ...options,
        prefix: '',
        params: {},
        headers: {
          Authorization: 'Bearer ' + newToken,
        },
      }
      resolve(request(url, newOptions))
    })
  })
}

const responseHandler = async (response, options) => {
  const res = await response.clone().json()

  if (res.code === 1200) {
    return checkStatus(response, options)
  } else if (res.code === 1201) {
    return onLogout()
  }

  return response
}
```

## 参考资料

- [前端请求 token 过期时,刷新 token 的处理](https://cloud.tencent.com/developer/article/1467376)
- [前端单点登录 token 过期前端处理](https://blog.csdn.net/gaoyan666/article/details/103888844)
- [前端实现 refresh_token 刷新, 无痛 token 刷新机制](https://www.jianshu.com/p/8ef1a4fd7fef)
- [axios 如何利用 promise 无痛刷新 token](https://zhuanlan.zhihu.com/p/80125501)
