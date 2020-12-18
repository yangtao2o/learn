export const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
export const emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
export const passwordReg = /^[0-9A-Za-z]{8,20}$/

export const regExpRules = {
  phone: {
    pattern: phoneReg,
    message: '请输入格式正确的手机号',
  },
  password: {
    pattern: passwordReg,
    message: '密码格式错误，8-20位数字或字母',
  },
}

// 删除
export const deleFilter = (data, id) => data.filter(value => value.id !== id)

// 根据参数获取地址栏对应参数值
export const getQueryString = name => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function getHttpsUrl(url) {
  if (url) {
    return url.replace('http://', 'https://')
  }
  return url
}

// 中文与其他字符换算
// 双字节的替换成两个单字节的然后再获得长度
export function getStringLength(str) {
  if (str == null) return 0
  if (typeof str != 'string') {
    str += ''
  }
  return str.replace(/[^\x00-\xff]/g, '01').length
}

export function throttle(fn, delay, immediate, debounce) {
  var curr = +new Date(),
    last_call = 0,
    last_exec = 0,
    timer = null,
    diff,
    context,
    args,
    exec = function () {
      last_exec = curr
      fn.apply(context, args)
    }
  return function () {
    curr = +new Date()
    ;(context = this),
      (args = arguments),
      (diff = curr - (debounce ? last_call : last_exec) - delay)
    clearTimeout(timer)
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay)
      } else if (diff >= 0) {
        exec()
      }
    } else {
      if (diff >= 0) {
        exec()
      } else if (immediate) {
        timer = setTimeout(exec, -diff)
      }
    }
    last_call = curr
  }
}

export function debounce(func, wait, immediate) {
  var timeout, result

  var debounced = function () {
    var context = this
    var args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
    return result
  }

  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
