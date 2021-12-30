import { extend } from 'umi-request'
import store from '@/store'
import { onLogout, setToken } from '@/store/modules/user.js'
import { get_new_token } from '@api/token'
import { localStorageHandle, ACCOUNT_TOKEN } from '@/utils/storage'
import { getAppId } from '@/utils/getAppId'

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
  // return response   // 如果要拦截报错信息，统一处理，可返回 response
  return data
}

const getToken = () =>
  localStorageHandle.get(ACCOUNT_TOKEN)
    ? localStorageHandle.get(ACCOUNT_TOKEN)
    : {}

// 默认统一从本地存储中获取token
const getAuthor = () => {
  const { access_token } = getToken()
  const res = access_token ? `Bearer ${access_token}` : ''

  return { Authorization: res }
}

/**
 * Resquest Handler
 */

const resquestHandler = (url, options) => {
  const appId = getAppId()
  const author = getAuthor()

  return {
    url,
    options: {
      ...options,
      headers: {
        appId,
        ...options.headers,
        ...author,
      },
      interceptors: true,
      credentials: 'omit', // 'omit: Never send or receive cookies', 'same-origin' is default
    },
  }
}

/**
 * Refresh Token Handler
 * 1200 token失效,自动刷新
 * 1201 token失效(无法自动刷新), 退出登录
 */

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
  const { refresh_token } = getToken()
  try {
    const res = await get_new_token(refresh_token)

    if (res && res.access_token) {
      store().dispatch(setToken(res))
      notifySubscriber(res.access_token)
    } else {
      notifySubscriber()
    }
  } catch (e) {
    notifySubscriber()
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
      if (newToken) {
        const newOptions = {
          ...options,
          prefix: '',
          params: {},
          headers: {
            Authorization: 'Bearer ' + newToken,
          },
        }
        resolve(request(url, newOptions))
      } else {
        resolve()
      }
    })
  })
}

/**
 * Response Handler
 */

const responseHandler = async (response, options) => {
  try {
    if (typeof response.clone === 'function') {
      // 捕获 body 可能为空的情况，直接跳出判断，正常返回即可
      const res = await response.clone().json()
      if (res.code === 1200) {
        return checkStatus(response, options)
      } else if (res.code === 1201) {
        /**
         * 由于刷新token需时间加上浏览请求并发
         * 可能会有刷新token成功前另一个业务请求
         * 如果正在刷新token按处理正在刷新的逻辑处理
         */
        if (!isRefreshing) {
          store().dispatch(onLogout())
        } else {
          return checkStatus(response, options)
        }
      }
    }
  } catch (error) {
    // console.error('ResponseHandler Error:', error)
  }

  return response
}

/**
 * Create a new instance of umi-request
 */

const request = extend({
  prefix: process.env.API_Host,
  timeout: 15000,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache', // 兼容 IE11
  },
  errorHandler,
})

// request interceptor, change url or options.
request.interceptors.request.use(resquestHandler, { global: false })
// response interceptor, chagne response
request.interceptors.response.use(responseHandler, { global: false })

export { request }
