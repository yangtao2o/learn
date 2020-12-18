// 库选择：[8个JavaScript库可更好地处理本地存储](https://zhuanlan.zhihu.com/p/266619851)
// https://github.com/marcuswestin/store.js
// https://github.com/pamelafox/lscache
// https://github.com/localForage/localForage
// https://localforage.docschina.org/  通过简单类似 localStorage API 的异步存储来改进你的 Web 应用程序的离线体验。它能存储多种类型的数据，而不仅仅是字符串。

export const ACCOUNT_TOKEN = '_SITE_ACCOUNT_TOKEN'
export const ACCOUNT_INFO = '_SITE_ACCOUNT_INFO'
export const REGISTER_INFO = '_SITE_REGISTER_INFO'
export const ACCOUNT_FORGOT = '_SITE_ACCOUNT_FORGOT'
export const USER_INFO = '_SITE_USER_INFO'

//读取存储列表
export function loadData(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (e) {
    return null
  }
}

//存储数据
export function saveData(key, data) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (e) {
    window.localStorage.setItem(key, `${data}`)
    return false
  }
}

//删除
export function removeData(key) {
  try {
    return window.localStorage.removeItem(key)
  } catch (e) {
    return null
  }
}

// 设置本地存储
export const localStorageHandle = {
  set: (key, values) => saveData(key, values),
  get: key => loadData(key),
  remove: key => removeData(key),
}
