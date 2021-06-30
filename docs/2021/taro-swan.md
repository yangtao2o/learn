# Taro 小程序采坑记录

## WebView 使用

基础使用：

```js
import Taro, { useDidShow } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

export default function () {
  const [currentSrc, setCurrentSrc] = useState('')

  useDidShow(() => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    setCurrentSrc(currentPage.options.src)
  })

  const postMessage = options => {
    const { detail } = options

    if (detail.data[0] === 'refresh') {
      const source = encodeURIComponent(currentSrc)
      Taro.redirectTo({
        url: '/pages/index/index?src=' + source,
      })
    }
  }

  return <WebView src={currentSrc} onMessage={postMessage} />
}
```

在需要传参的链接上，一定需要加上 encodeURIComponent，不然会有意想不到的小坑等着你。如：

```js
// 第一种情况：获取router params
const { src } = getCurrentInstance().router.params

// 第二种情况：获取router params
const pages = Taro.getCurrentPages()
const currentPage = pages[pages.length - 1]
const { src } = currentPage.options
```

如果不采用 encodeURIComponent 方式，有时会被忽略传过来的参数。

```js
// 通用query字段
const COMMON = {
  source: 'swan',
}

// 对象序列化
const stringify = (obj, sep = '&', eq = '=') => {
  let str = ''

  for (var k in obj) {
    str += k + eq + unescape(obj[k]) + sep
  }

  return str.slice(0, -1)
}

// 跳转至需要打开h5页面对应的位置
export const openUrl = ({ site = '', page = 'h5', params = {} } = {}) => {
  if (!PAGES[page]) {
    return console.error('openUrl 参数有误')
  }

  const querys = stringify({ ...COMMON, ...params })
  const source = encodeURIComponent(site + '?' + querys)

  return Taro.navigateTo({
    url: PAGES[page] + '?src=' + source,
  })
}
```

## 小程序请求拦截处理

config.js 文件：

```js
export const codeMessage = {
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
```

check.js:

```js
import Taro from '@tarojs/taro'
import store from '@/store'
import { onLogon } from '@/store/modules/user'
import { localStorageHandle, ACCOUNT_TOKEN } from '@/utils/storage'
import { getNewToken } from './api/user-login'

const getToken = () => localStorageHandle.get(ACCOUNT_TOKEN)

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
  try {
    const tokenRes = getToken()

    const res = await getNewToken({ refresh_token: tokenRes.refresh_token })

    if (res.code === 0) {
      store.dispatch(onLogon(res.res))
      notifySubscriber(res.res.access_token)
    }
  } catch (e) {
    console.error('请求刷新 token 失败')
  }
  isRefreshing = false
}

// 判断如何响应
export default function checkStatus(requestParams) {
  if (!isRefreshing) {
    isRefreshing = true
    refreshTokenRequst()
  }

  // 正在刷新 token，返回一个未执行 resolve 的 promise
  return new Promise(resolve => {
    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
    addSubscriber(newToken => {
      if (!newToken) {
        return resolve()
      }

      const newOptions = {
        ...requestParams,
        header: {
          ...requestParams.header,
          Authorization: 'Bearer ' + newToken,
        },
      }

      resolve(Taro.request(newOptions))
    })
  })
}
```

interceptors.js:

```js
import Taro from '@tarojs/taro'
import store from '@/store'
import { onLogout } from '@/store/modules/user'
import { localStorageHandle, ACCOUNT_TOKEN } from '@/utils/storage'
import { codeMessage, getAppId } from './config'
import checkStatus from './check'

const getToken = () => localStorageHandle.get(ACCOUNT_TOKEN)

const customInterceptor = chain => {
  const requestParams = chain.requestParams

  const token = getToken()

  if (token) {
    requestParams.header.Authorization = `Bearer ${token.access_token}`
  }

  requestParams.header.appId = getAppId()

  return chain.proceed(requestParams).then(res => {
    if (res.statusCode === 200) {
      const { code } = res.data

      if (code === 1200) {
        return checkStatus(requestParams)
      }
      if (code === 1201) {
        return store.dispatch(onLogout())
      }

      return res.data
    }

    const msg = codeMessage[res.statusCode]

    Promise.reject(msg || '未知请求错误')
  })
}

const interceptors = [customInterceptor, Taro.interceptors.logInterceptor]

export default interceptors
```

http.js:

```js
import Taro from '@tarojs/taro'
import interceptors from './interceptors'

interceptors.forEach(i => Taro.addInterceptor(i))

export default function extend(args) {
  class httpRequest {
    constructor({ prefix = '', header = {} }) {
      this.extend = {
        prefix,
        header,
      }
    }

    baseOptions(url = '', options = {}, method = 'GET') {
      const params = {
        url: this.extend.prefix + url,
        method,
        ...options,
        header: {
          'content-type': 'application/json', // 默认值
          ...this.extend.header,
          ...options.header,
        },
      }

      return Taro.request(params)
    }

    get(url = '', options = {}) {
      return this.baseOptions(url, options)
    }

    post(url = '', options = {}) {
      return this.baseOptions(url, options, 'POST')
    }

    put(url = '', options = {}) {
      return this.baseOptions(url, options, 'PUT')
    }

    delete(url = '', options = {}) {
      return this.baseOptions(url, options, 'DELETE')
    }
  }
  return new httpRequest(args)
}
```

请求：

```js
import extend from '../http'

const BASE_URL = process.env.host
const request = extend({ prefix: BASE_URL })

export function pushToken({ id }) {
  return request.post('/index/token', {
    data: { id },
  })
}
```
