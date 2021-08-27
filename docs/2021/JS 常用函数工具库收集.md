## 前言

主要收录平时看到的工具函数，大部分内容保持了原作者的原有信息。

## 主要内容

### 获取文件后缀名

使用场景：上传文件判断后缀名

```js
/**
 * 获取文件后缀名
 * @param {String} filename
 */
export function getExt(filename) {
  if (typeof filename == 'string') {
    return filename.split('.').pop().toLowerCase()
  } else {
    throw new Error('filename must be a string type')
  }
}
```

### 复制内容到剪贴板

```js
export function copyToBoard(value) {
  const element = document.createElement('textarea')
  document.body.appendChild(element)
  element.value = value
  element.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    document.body.removeChild(element)
    return true
  }
  document.body.removeChild(element)
  return false
}
```

原理：

- 创建一个 textare 元素并调用`select()`方法选中
- `document.execCommand('copy')`方法，拷贝当前选中内容到剪贴板。

### 休眠多少毫秒

异步方式

```js
/**
 * 休眠xxxms
 * @param {Number} milliseconds
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const fetchData = async () => {
  await sleep(1000)
}
```

同步方式

```js
const sleepSync = ms => {
  const end = new Date().getTime() + ms
  while (new Date().getTime() < end) {
    /* do nothing */
  }
}

const printNums = () => {
  console.log(1)
  sleepSync(500)
  console.log(2)
  console.log(3)
}

printNums() // Logs: 1, 2, 3 (2 and 3 log after 500ms)
```

### 生成随机字符串

```js
/**
 * 生成随机id
 * @param {*} length
 * @param {*} chars
 */
export function uuid(length, chars) {
  chars =
    chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  length = length || 8
  var result = ''
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
```

使用场景：用于前端生成随机的 ID,毕竟现在的 Vue 和 React 都需要绑定 key

### 简单的深拷贝

```js
/**
 *深拷贝
 * @export
 * @param {*} obj
 * @returns
 */
export function deepCopy(obj) {
  if (typeof obj != 'object') {
    return obj
  }
  if (obj == null) {
    return obj
  }
  return JSON.parse(JSON.stringify(obj))
}
```

缺陷：只拷贝对象、数组以及对象数组，对于大部分场景已经足够

```js
const person = { name: 'xiaoming', child: { name: 'Jack' } }
deepCopy(person) //new person
```

### 数组去重

原理是利用 Set 中不能出现重复元素的特性

```js
/**
 * 数组去重
 * @param {*} arr
 */
export function uniqueArray(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('The first parameter must be an array')
  }
  if (arr.length == 1) {
    return arr
  }
  return [...new Set(arr)]
}
```

### 对象转化为 FormData 对象

```js
/**
 * 对象转化为formdata
 * @param {Object} object
 */

export function getFormData(object) {
  const formData = new FormData()
  Object.keys(object).forEach(key => {
    const value = object[key]
    if (Array.isArray(value)) {
      value.forEach((subValue, i) => formData.append(key + `[${i}]`, subValue))
    } else {
      formData.append(key, object[key])
    }
  })
  return formData
}
```

使用场景：上传文件时我们要新建一个 FormData 对象，然后有多少个参数就 append 多少次，使用该函数可以简化逻辑

使用方式：

```js
let req = {
  file: xxx,
  userId: 1,
  phone: '15198763636',
  //...
}
fetch(getFormData(req))
```

### 保留到小数点以后 n 位

```js
// 保留小数点以后几位，默认2位
export function cutNumber(number, no = 2) {
  if (typeof number != 'number') {
    number = Number(number)
  }
  return Number(number.toFixed(no))
}

// 方法2
const toFixed = (n, fixed) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed)
// 事例
toFixed(25.198726354, 1) // 25.1
toFixed(25.198726354, 2) // 25.19
```

使用场景：JS 的浮点数超长，有时候页面显示时需要保留 2 位小数

### 获得一个随机的布尔值（true/false）

该函数使用`Math.random()`方法返回一个布尔值（true 或者 false）。

`Math.random`创建一个 0 到 1 之间的随机数，我们只要检查它是否高于或低于 0.5，就有 50%机会得到 true 或 false。

```js
const randomBoolean = () => Math.random() >= 0.5
```

### 检查所提供的日期是否为工作日

使用这种方法，我们能够检查在函数中提供的日期是否是工作日或周末的日子。

```js
const isWeekday = date => date.getDay() % 6 !== 0

console.log(isWeekday(new Date(2021, 7, 6))) // true  因为是周五
console.log(isWeekday(new Date(2021, 7, 7))) // false 因为是周六
```

### 反转字符串

有几种不同的方法来反转一个字符串。这是最简单的一种，使用`split()`、`reverse()`和`join()`方法。

```js
const reverse = str => str.split('').reverse().join('')
reverse('hello world') // 'dlrow olleh'
```

### 检查当前标签是否隐藏

`Document.hidden` （只读属性）返回布尔值，表示页面是（true）否（false）隐藏。

```js
const isBrowserTabInView = () => document.hidden
isBrowserTabInView()
```

`document.hidden`是 h5 新增加 api 使用的时候有兼容性问题。

```js
var hidden
if (typeof document.hidden !== 'undefined') {
  hidden = 'hidden'
} else if (typeof document.mozHidden !== 'undefined') {
  hidden = 'mozHidden'
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
}
console.log('当前页面是否被隐藏：' + document[hidden])
```

### 检查一个数字是偶数还是奇数

```js
const isEven = num => num % 2 === 0
```

### 从一个日期获取时间

```js
const timeFromDate = date => date.toTimeString().slice(0, 8)

console.log(timeFromDate(new Date(2021, 0, 10, 17, 30, 0)))
// "17:30:00"

console.log(timeFromDate(new Date()))
// 打印当前的时间
```

### 检查当前是否有元素处于焦点中

我们可以使用`document.activeElement`属性检查一个元素是否当前处于焦点。

```js
const elementIsInFocus = el => el === document.activeElement
```

### 检查当前浏览器是否支持触摸事件

```js
const touchSupported = () => {
  'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
}
```

### 检查当前浏览器是否在苹果设备上

```js
const isAppleDevice = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
```

### 滚动到页面顶部

```js
const goToTop = () => window.scrollTo(0, 0)
```

### 获取参数的平均数值

```js
const average = (...args) => args.reduce((a, b) => a + b) / args.length
average(1, 2, 3, 4) // 2.5
```

### 华氏/摄氏转换

```js
const celsiusToFahrenheit = celsius => (celsius * 9) / 5 + 32
const fahrenheitToCelsius = fahrenheit => ((fahrenheit - 32) * 5) / 9
// 事例
celsiusToFahrenheit(15) // 59
celsiusToFahrenheit(0) // 32
celsiusToFahrenheit(-20) // -4
fahrenheitToCelsius(59) // 15
fahrenheitToCelsius(32) // 0
```

## 参考资料

- [8 个工程必备的 JavaScript 代码片段（建议添加到项目中）](https://juejin.cn/post/6999391770672889893)
- [12 个 GitHub 上超火的 JavaScript 奇技淫巧项目，找到写 JavaScript 的灵感！](https://juejin.cn/post/6906126184031977480)
- [13 个 JavaScript 一行程序，让你看起来像个专家](https://juejin.cn/post/6997930259953745950)
- [30 Seconds Of Code](https://www.30secondsofcode.org/)
- [JavaScript 工具函数大全（新）](https://juejin.cn/post/6844903966526930951)
