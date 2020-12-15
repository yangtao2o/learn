import { extend } from 'umi-request'
import store from '@/store'
import { onLogout, onLogon } from '@/store/modules/user.js'
import { accountLoginService } from '@kxhz/user-service-sdk'

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
 * Refresh Token Handler
 * 1200 token失效,自动刷新
 * 1201 token失效(无法自动刷新), 退出登录
 */

let isRefreshing = false // 是否正在刷新
let subscribers = [] // 重试队列，每一项将是一个待执行的函数形式

// 刷新 token 请求
const refreshTokenRequst = async () => {
  const { refresh_token } = store.getState().user.token
  try {
    const res = await accountLoginService.get_new_token(refresh_token)
    store.dispatch(onLogon(res))
    onAccessTokenFetched(res.access_token)
    isRefreshing = false
  } catch (e) {
    console.error('请求刷新 token 失败')
  }
}

// 判断如何
function checkStatus(response, options) {
  const { url } = response
  if (!isRefreshing) {
    isRefreshing = true
    refreshTokenRequst()
  }

  // 将当前的请求保存至 addSubscriber
  const retryOriginalRequest = new Promise(resolve => {
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
  return retryOriginalRequest
}

// 执行被缓存等待的接口事件
function onAccessTokenFetched(newToken = '') {
  subscribers.forEach(callback => callback(newToken))
  subscribers = []
}

// 添加缓存
function addSubscriber(callback) {
  subscribers.push(callback)
}

// 部分页面的特殊处理：tpl页面操作时被迫退出时，不返回首页
function hackResponse(url = '') {
  const targetReqUrl = ['template/details', 'template/operate']
  const res = targetReqUrl.findIndex(elem => url.indexOf(elem))

  if (res !== -1) {
    window.location.reload()
    return true
  }
  return false
}

/**
 * Response Handler
 */

const responseHandler = async (response, options) => {
  const res = await response.clone().json()

  if (res.code === 1200) {
    return checkStatus(response, options)
  } else if (res.code === 1201) {
    let isBack = true
    if (hackResponse(response.url)) {
      isBack = false
    }
    return store.dispatch(onLogout(isBack))
  }

  return response
}

/**
 * Create a new instance of umi-request
 */

const request = extend({
  prefix: process.env.NEXT_PUBLIC_ZHIXI_API_HOST,
  timeout: 5000,
  headers: {
    appId: '80001001',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache', // 兼容 IE11
  },
  errorHandler,
})

// request interceptor, change url or options.
request.interceptors.request.use(resquestHandler)
// response interceptor, chagne response
request.interceptors.response.use(responseHandler)

const requestHost = extend({
  prefix: '',
  timeout: 5000,
  headers: {
    appId: '80001001',
  },
  errorHandler,
})

export { request, requestHost }
