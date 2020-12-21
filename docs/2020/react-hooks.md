# React Hooks 使用总结

## 组件类的缺点

1. 大型组件很难拆分和重构，也很难测试。
2. 业务逻辑分散在组件的各个方法之中，导致重复逻辑或关联逻辑。
3. 组件类引入了复杂的编程模式，比如 render props 和高阶组件

## 函数组件

1. 数据流的管道，不是复杂的容器
1. 组件的最佳写法应该是函数，而不是类
1. 必须是纯函数，不能包含状态，也不支持生命周期方法，因此无法取代类

## 类和纯函数

- 类：数据和逻辑的封装
- 纯函数：只应该做一件事，就是返回一个值

  - 函数返回结果只依赖参数
  - 函数执行不会对外产生可观察的变化

- 副作用：数据计算无关的操作
  - 如：生成日志、储存数据、改变应用状态等

## Hook

目的：

- React 函数组件的副作用解决方案
- 加强版函数组件，完全不使用"类"，可写出一个全功能的组件

含义：

- 组件尽量写成纯函数
- 当需要外部功能和副作用的时候，就用钩子把外部代码"钩"进来

## Hook 方法

1. useState - 数据存储，派发更新
1. useEffect - 组件更新副作用钩子
1. useRef - 获取元素 ,缓存数据
1. useContext - 自由获取 context
1. useReducer - 无状态组件中的 redux
1. useMemo - 小而香性能优化
1. useCallback - useMemo 版本的回调函数
1. useLayoutEffect - 渲染更新之前的 useEffect

## useState

特点：

- useState 派发更新函数的执行，会使 function 组件从头到尾执行一次
- 可以配合 useMemo，usecallback 等 api 配合使用，起到优化作用

使用：

```js
import { useState } from 'react'

export default function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0)

  console.log('outer', count) // 会及时更新

  const handleClick = () => {
    setCount(count + 1)
    // 只有当下一次上下文执行的时候，state值才随之改变
    console.log('inner', count) // 不会及时更新
  }
  return (
    <>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>Click me</button>
    </>
  )
}
```

## useEffect

特点：

- useEffect 第一个参数不能直接用 async await 语法，可以在内部调用
- 第二个参数是个数组，可作为限定条件，限制 useEffect 的执行
- 如果没有第二个参数，useEffect 会受 state 或 props 更新而执行
- return 可清除 effect

与 useLayoutEffect 的执行过程对比：

- 组件更新挂载完成 -> 浏览器 dom 绘制完成 -> 执行 useEffect 回调
- 组件更新挂载完成 -> 执行 useLayoutEffect 回调-> 浏览器 dom 绘制完成

只要是副效应，都可以使用`useEffect()`引入。它的常见用途有下面几种：

- 获取数据（data fetching）
- 事件监听或订阅（setting up a subscription）
- 改变 DOM（changing the DOM）
- 输出日志（logging）

**注意**：如果有多个副效应，应该调用多个`useEffect()`，而不应该合并写在一起。

使用搜索功能体验下各种状态是如何处理的，详细内容讲解，见这里[[译] 如何使用 React hooks 获取 api 接口数据](https://juejin.cn/post/6844903921480105991#heading-0)

主要包含：

- 获取数据，初次自动加载，以及表单搜索也可重新发起请求
- 使用 Loading
- 添加错误处理
- 添加中止数据请求，可防止切换组件，因找不到组件而触发警告

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Example() {
  const [data, setData] = useState({ items: [] })
  const [target, setTarget] = useState('javascript')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [url, setUrl] = useState(
    'https://api.github.com/search/repositories?sort=stars&q=javascript'
  )

  useEffect(() => {
    let didCancel = false
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)
      try {
        const res = await axios(url)
        if (!didCancel && res?.data) {
          setData(res.data)
        }
      } catch (e) {
        if (!didCancel) {
          setIsError(true)
        }
      }
      setIsLoading(false)
    }

    fetchData()

    return () => {
      didCancel = true
    }
  }, [url])

  const handleClick = () => {
    const url = `https://api.github.com/search/repositories?sort=stars&q=${target}`
    setUrl(url)
  }

  return (
    <>
      <input
        type="text"
        value={target}
        onChange={event => setTarget(event.target.value)}
      />
      <button type="button" onClick={handleClick}>
        Search
      </button>
      {isError && <div>出错了...</div>}
      {isLoading ? (
        <div>加载中...</div>
      ) : data.items.length > 0 ? (
        <ul>
          {data.items.map(item => (
            <li key={item.id}>
              <a href={item.html_url}>{item.name}</a>
            </li>
          ))}
        </ul>
      ) : (
        <div>没有更多信息了...</div>
      )}
    </>
  )
}
```

为什么要在 effect 中返回一个函数？这是 effect 可选的清除机制。

React 何时清除 effect？

- React 会在组件卸载的时候执行清除操作。
- effect 在每次渲染的时候都会执行。这就是为什么 React 会在执行当前 effect 之前对上一个 effect 进行清除。

接下来模拟下实际项目中倒计时的写法，使用了 setTimeout 模拟 setInterval，当然也使用到了清除操作。

```js
import { useState, useEffect } from 'react'

const STATUS = {
  STOP: 'stop',
  START: 'start',
  TIMEOUT: 1000,
  MAXTIME: 9,
}

export default function Example() {
  const [time, setTime] = useState(STATUS.MAXTIME)
  const [status, setStatus] = useState(STATUS.STOP)

  useEffect(() => {
    let timerId = null
    // 主体运行函数
    const run = () => {
      if (time <= 1) {
        setTime(STATUS.MAXTIME)
        setStatus(STATUS.STOP)
        return
      }
      setTime(time => time - 1)
      // 回调
      timerId = setTimeout(run, STATUS.TIMEOUT)
    }

    // 根据操作行为切换定时器状态
    if (status === STATUS.START) {
      timerId = setTimeout(run, STATUS.TIMEOUT)
    } else {
      timerId && clearTimeout(timerId)
    }

    // eefect 清除操作
    return () => {
      timerId && clearTimeout(timerId)
    }
  }, [status, time])

  const handleClick = e => setStatus(e.target.value)

  return (
    <div>
      <p>倒计时：{time}</p>
      <button type="button" value={STATUS.START} onClick={handleClick}>
        开始
      </button>
      <button type="button" value={STATUS.STOP} onClick={handleClick}>
        暂停
      </button>
    </div>
  )
}
```

## useRef

特点：

- 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数
- 返回的 ref 对象在组件的整个生命周期内保持不变，可缓存数据
- useRef 会在每次渲染时返回同一个 ref 对象
- 想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现

我们在 class 中通过 ref 属性来访问 DOM，然而`useRef()`比 ref 属性更好用 —— `useRef()`可以很方便地保存任何可变值。

访问 DOM：

```js
import { useRef } from 'react'

export default function Example() {
  const inputEl = useRef(null)

  const onButtonClick = () => {
    inputEl.current.focus() // `current` 指向已挂载到 DOM 上的文本输入元素
  }

  return (
    <div>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </div>
  )
}
```

缓存数据：useRef 可以第一个参数可以用来初始化保存数据，这些数据可以在 current 属性上获取到 ，当然我们也可以通过对 current 赋值新的数据源。

```js
// 初始化
const currenRef = useRef(InitialData)
// 获取
const getCurrentData = currenRef.current
// 更改
currenRef.current = newData
```

封装一个 usePrevious:

```js
import { useRef, useEffect } from 'react'
const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, value)
  return ref.current
}
```

还可以用在定时器：

```js
function Demo() {
  const [count, setCount] = useState(0)
  const [isClear, setClear] = useState(false)
  const timerID = useRef()

  useEffect(() => {
    timerID.current = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(timerID.current)
  }, [count])

  useEffect(() => {
    return () => clearInterval(timerID.current)
  }, [isClear])
}
```

由于 usestate，useReducer 执行更新数据源的函数，会带来整个组件从新执行到渲染，如果在函数组件内部声明变量，则下一次更新也会重置，那我们使用 useRef，就可以既想要保留数据，又不想触发函数的更新。

## useContext

- 接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值
- 当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 value prop 决定
- Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法

## useReducer

```js
const [state, dispatch] = useReducer(reducer, initialState, init)
```

特点：

- useState 的替代方案
- 数组的第一项就是更新之后 state 的值 ，第二个参数是派发更新的 dispatch 函数
- dispatch 的触发会触发组件的更新
- 使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数

使用：

```js
import { useReducer } from 'react'

const DECREMENT = 'decrement'
const INCREMENT = 'increment'
const RESET = 'reset'

const initialState = { number: 0 }

function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case DECREMENT:
      return { number: state.number + 1 }
    case INCREMENT:
      return { number: state.number - 1 }
    case RESET:
      return { number: payload.number }
    default:
      return { number: state.number }
  }
}

export default function Example() {
  const [state, dispath] = useReducer(reducer, initialState)
  return (
    <div>
      当前值：{state.number}
      <button onClick={() => dispath({ type: DECREMENT })}>增加</button>
      <button onClick={() => dispath({ type: INCREMENT })}>减少</button>
      <button onClick={() => dispath({ type: RESET, payload: initialState })}>
        重置
      </button>
    </div>
  )
}
```

## useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

- 第二个参数是一个 deps 数组，数组里的参数变化决定了 useMemo 是否更新回调函数
- 如果把 memo 比做无状态组件的 ShouldUpdate，那么 useMemo 就是更为细小的 ShouldUpdate 单元

优点

- useMemo 可以减少不必要的循环，减少不必要的渲染
- useMemo 可以减少子组件的渲染次数
- useMemo 让函数在某个依赖项改变的时候才运行，这可以避免很多不必要的开销

比如我们使用防抖函数时需要这样做：

```js
const searchDebounce = useMemo(() => {
  return debounce(handleSearch, 600)
}, [handleSearch])
```

这样的话，用 useMemo 包裹之后的 debounce 函数可以避免了每次组件更新再重新声明，可以限制上下文的执行。

## useCallback

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

- `useCallback(fn, [])` 相当于 `useMemo(() => fn, [])`
- 用处：当以 props 的形式传递给子组件时, 可避免非必要渲染
- 区别: useMemo 返回的是函数运行的结果，useCallback 返回的是函数
- useCallback ，需要搭配 react.memo 或 pureComponent 一起使用，才能使性能达到最佳

## useMemo 和 useCallBack 示例

接下来的组件中，我们维护了两个 state，可以看到 getCount 的计算仅仅跟 count 有关，那么我们兵分三路，逐个了解下各自的军情。

```js
import React, { useState, useMemo, useCallback } from 'react'

const Child = React.memo(function ({ getCount }) {
  return <h4>传过来的Count值：{getCount()}</h4>
})

export default function DemoUseMemo() {
  const [count, setCount] = useState(1)
  const [val, setValue] = useState('')

  // 普通调用
  const getCount = () => {
    console.log('normal-result')
    return count
  }

  // 使用 useMemo
  const getCountWithMemo = useMemo(() => {
    console.log('useMemo-result')
    return count
  }, [count])

  // 使用 useCallback
  const getCountWithCallback = useCallback(() => {
    console.log('useCallback-result')
    return count
  }, [count])

  return (
    <div>
      <h4>
        Count：{getCount()}, {getCountWithMemo}
      </h4>
      <Child getCount={getCountWithCallback} />
      <div>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <input value={val} onChange={event => setValue(event.target.value)} />
      </div>
    </div>
  )
}
```

当我们点击 `+1` 时，打印如下：

```log
useMemo-result
normal-result
useCallback-result
```

当我们输入时，打印如下，只有普通调用的打印结果：

```log
normal-result
```

如上所示，普通调用时，无论是 count 还是 val 变化，都会导致 getCount 重新计算，所以这里我们希望 val 修改的时候，不需要再次计算，这种情况下我们可以使用 useMemo。

同样的，使用了 useCallback 后，结合 `React.memo`，显示结果和 useMemo 完全一致。如果这里值使用了 useCallback，而并未使用`React.memo`，结果如何呢？答案就是和普通调用结果一致。

那 useMemo 和 useCallback 到底有什么异同呢？

- 相同：接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值
- 区别：useMemo 返回的是函数运行的结果，useCallback 返回的是函数。

## 自定义 Hook

特点：

- 自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook
- 自定义 Hook 是一种自然遵循 Hook 设计的约定，而并不是 React 的特性

规则：

- 必须以 “use” 开头
- 两个组件中使用相同的 Hook 不会共享 state
- 每次调用 Hook，它都会获取独立的 state

注意：一个好用的自定义 hooks,一定要配合 useMemo, useCallback 等 api 一起使用

自定义获取数据的 Reducer Hook：

```js
import { useState, useEffect, useReducer } from 'react'

const REQUEST_INIT = Symbol('REQUEST_INIT')
const REQUEST_SUCCESS = Symbol('REQUEST_SUCCESS')
const REQUEST_FAILURE = Symbol('REQUEST_FAILURE')

const requestReducer = (state, action) => {
  switch (action.type) {
    case REQUEST_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      return console.error('出错了')
  }
}

// 请求数据、更新数据
export function useRequest(cb, isRequest) {
  const [isUpdate, setUpdate] = useState(false)
  const [param, setParam] = useState({})

  const [state, dispatch] = useReducer(requestReducer, {
    isLoading: false,
    isError: false,
    data: '',
  })

  useEffect(() => {
    let didCancel = false
    // 如果是 -1 初次不需要请求
    if (isRequest === -1) {
      return dispatch({ type: REQUEST_SUCCESS })
    }
    const requestData = async params => {
      dispatch({ type: REQUEST_INIT })
      try {
        const res = await cb(params)
        if (!didCancel) {
          dispatch({ type: REQUEST_SUCCESS, payload: res.data })
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: REQUEST_FAILURE })
        }
      }
    }

    requestData(param)

    return () => {
      didCancel = true
    }
  }, [isUpdate, param])

  const isUpdateHandle = () => setUpdate(!isUpdate)
  const onUpdateHandle = param => setParam(param)

  return { ...state, isUpdateHandle, onUpdateHandle }
}
```

## Hook 规则

- 本质： JavaScript 函数
- 只在最顶层使用 Hook，不要在循环，条件或嵌套函数中调用 Hook
- 只在 React 函数中调用 Hook，不要在普通的 JavaScript 函数中调用 Hook

## 参考资料

- [Hook 规则](https://react.docschina.org/docs/hooks-rules.html)
- [react-hooks 如何使用？](https://juejin.cn/post/6864438643727433741)
- [轻松学会 React 钩子：以 useEffect() 为例](http://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html)
- [[译] 如何使用 React hooks 获取 api 接口数据](https://juejin.cn/post/6844903921480105991)
- [玩转 react-hooks,自定义 hooks 设计模式及其实战 ](https://juejin.cn/post/6890738145671938062)
- [useMemo 和 useCallback 的使用](https://www.cnblogs.com/nianzhilian/p/14141620.html)
- [一篇文章，带你学会 useRef、useCallback、useMemo](https://zhuanlan.zhihu.com/p/117577458)
