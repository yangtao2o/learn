# React-Redux 使用总结

## 主要内容

- Redux 怎么使用，为什么要这么用
- React-redux 分别在类组件和 Hooks 中如何使用
- 如何实现一个 React-redux？更深层次了解它的使用原理

## Redux

### Redux 和 React-redux

> Redux 是 JavaScript 状态容器，提供可预测化的状态管理。 —— Redux 中文文档

Redux 和 React-redux 并不是同一个东西。

Redux 是一种架构模式（Flux 架构的一种变种），它不关注你到底用什么库，你可以把它应用到 React 和 Vue，甚至跟 jQuery 结合都没有问题。

而 React-redux 就是把 Redux 这种架构模式和 React.js 结合起来的一个库，就是 Redux 架构在 React.js 中的体现。

### Redux 三大原则

- 单一数据源：store
- State 是只读的，唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象
- 使用纯函数来修改，如 reducer，它接收先前的 state 和 action，并返回新的 state

### Redux 流程图

### Redux 为什么这么用

我们在代码中发现共享的状态如果可以被任意修改的话，那么程序的行为将非常不可预料，所以我们提高了修改数据的门槛：你必须通过 dispatch 执行某些允许的修改操作，而且必须大张旗鼓的在 action 里面声明。

这种模式挺好用的，我们就把它抽象出来一个 createStore，它可以产生 store，里面包含 getState 和 dispatch 函数，方便我们使用。

后来发现每次修改数据都需要手动重新渲染非常麻烦，我们希望自动重新渲染视图。所以后来加入了订阅者模式，可以通过 store.subscribe 订阅数据修改事件，每次数据更新的时候自动重新渲染视图。

接下来我们发现了原来的“重新渲染视图”有比较严重的性能问题，我们引入了“共享结构的对象”来帮我们解决问题，这样就可以在每个渲染函数的开头进行简单的判断避免没有被修改过的数据重新渲染。

我们优化了 stateChanger 为 reducer，定义了 reducer 只能是纯函数，功能就是负责初始 state，和根据 state 和 action 计算具有共享结构的新的 state。

createStore 现在可以直接拿来用了，套路就是：

```js
// 定一个 reducer
function reducer (state, action) {
  /* 初始化 state 和 switch case */
}

// 生成 store
const store = createStore(reducer)

// 监听数据变化重新渲染页面
store.subscribe(() => renderApp(store.getState()))

// 首次渲染页面
renderApp(store.getState())

// 后面可以随意 dispatch 了，页面自动更新
store.dispatch(...)
```

以上内容原文见这里：[动手实现 Redux（六）：Redux 总结](http://huziketang.mangojuice.top/books/react/lesson35)

### Redux 使用

```js
import { createStore } from 'redux'

/* 创建reducer
 ** 可以使用单独的一个reducer,也可以将多个reducer合并为一个reducer，即：combineReducers()
 ** action发出命令后将state放入reucer加工函数中，返回新的state,对state进行加工处理
 */
const reducer = (state = { counter: 0 }, action) => {
  switch (action.type) {
    case 'INCREASE':
      return { counter: state.counter + 1 }
    case 'DECREASE':
      return { counter: state.counter - 1 }
    default:
      return state
  }
}

/* 创建action
 ** 用户是接触不到state的，只能有view触发，所以，这个action可以理解为指令，需要发出多少动作就有多少指令
 ** action是一个对象，必须有一个叫type的参数，定义action类型
 */
const actions = {
  increase: () => ({ type: 'INCREASE' }),
  decrease: () => ({ type: 'DECREASE' }),
}

/* 创建的store，使用createStore方法
 ** store 可以理解为有多个加工机器的总工厂
 ** 提供subscribe，dispatch，getState这些方法。
 */

const store = createStore(reducer)

store.subscribe(() => console.log(store.getState()))

store.dispatch(actions.increase()) // {counter: 1}
store.dispatch(actions.increase()) // {counter: 2}
store.dispatch(actions.increase()) // {counter: 3}
store.dispatch(actions.decrease()) // {counter: 2}
```

## React-Redux 使用

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

Next 项目中引入 redux，如 `pages/_app.js`:

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

  return (
    <>
      {isLogin ? (
        <UserAgent userInfo={userInfo} isLogin={isLogin} />
      ) : (
        <EmptyStatus image="/static/img/empty/6.svg" description="请先登录" />
      )}
    </>
  )
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

## 如何实现一个 React-redux

### 问题

- 为什么 React-redux 这么奇怪？
- 为什么要 connect？
- 为什么要 mapStateToProps 和 mapDispatchToProps？
- 什么是 Provider？

### createStore 实现

React.js 除了状态提升以外并没有更好的办法帮我们解决组件之间共享状态的问题，而使用 context 全局变量让程序不可预测。

我们知道 store 里面的内容是不可以随意修改的，而是通过 dispatch 才能变更里面的 state。

```js
function createStore(reducer) {
  let state = null
  const listeners = []
  const subscribe = listener => listeners.push(listener)
  const getState = () => state
  const dispatch = action => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }
  dispatch({}) // 初始化 state
  return { getState, dispatch, subscribe }
}

const themeReducer = (state, action) => {
  if (!state)
    return {
      themeColor: 'red',
    }
  switch (action.type) {
    case 'CHANGE_COLOR':
      return { ...state, themeColor: action.themeColor }
    default:
      return state
  }
}

export default createStore(themeReducer)
```

### 高阶组件 connect 函数

所以我们尝试把 store 和 context 结合起来使用，可以兼顾组件之间共享状态问题和共享状态可能被任意修改的问题。

但是 store 和 context 结合有大量的重复逻辑和对 context 的依赖性过强。

我们尝试通过构建一个高阶组件 connect 函数的方式，把所有的重复逻辑和对 context 的依赖放在里面 connect 函数里面，而其他组件保持 Pure（Dumb） 的状态，让 connect 跟 context 打交道，然后通过 props 把参数传给普通的组件。

而每个组件需要的数据和需要触发的 action 都不一样，所以调整 connect，让它可以接受两个参数 mapStateToProps 和 mapDispatchToProps，分别用于告诉 connect 这个组件需要什么数据和需要触发什么 action。

```js
const connect = (mapStateToProps, mapDispatchToProps) => WrappedComponent => {
  class Connect extends Component {
    static contextType = ThemeContext
    constructor(props) {
      super(props)
      this.state = {
        allProps: {},
      }
    }

    componentDidMount() {
      const value = this.context
      this.updateProps()
      value.subscribe(() => this.updateProps())
    }

    updateProps() {
      const value = this.context
      const stateProps = mapStateToProps
        ? mapStateToProps(value.getState(), this.props)
        : {}
      const dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(value.dispatch, this.props)
        : {}

      this.setState({
        allProps: { ...stateProps, ...dispatchProps, ...this.props },
      })
    }

    render() {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}
```

### Provider 实现

为了把所有关于 context 的代码完全从我们业务逻辑里面清除掉，我们构建了一个 Provider 组件。

Provider 作为所有组件树的根节点，外界可以通过 props 给它提供 store，它会把 store 放到自己的 context 里面，好让子组件 connect 的时候都能够获取到。

```js
import React, { Component } from 'react'

const ThemeContext = React.createContext()

class Provider extends Component {
  render() {
    return (
      <ThemeContext.Provider value={this.props.store}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}
```

### 使用方式

全局配置 store：

```js
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import { Provider } from './react-redux'
import App from './App'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

使用 connect：

```js
import React, { Component } from 'react'
import { connect } from './../react-redux'

class ThemeSwitch extends Component {
  handleClick(e) {
    this.props.onSwitchColor(e.target.value)
  }

  render() {
    const { color } = this.props
    return (
      <button style={{ color }} onClick={e => this.handleClick(e)} value="red">
        Red
      </button>
    )
  }
}

const mapStateToProps = state => ({
  color: state.themeColor,
})

const mapDispatchToProps = dispatch => ({
  onSwitchColor: color => {
    dispatch({ type: 'CHANGE_COLOR', themeColor: color })
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch)
```

### 总结

以上内容主要包含：connect 函数和 Provider 容器组件。这就是 React-redux 的基本内容，当然它是一个残疾版本的 React-redux，很多地方需要完善。例如性能问题，现在不相关的数据变化的时候其实所有组件都会重新渲染的。但不影响我们理解它的原理。

## 参考资料

- [Redux 中文文档](http://cn.redux.js.org/)
- [动手实现 Redux（一）：优雅地修改共享状态](http://huziketang.mangojuice.top/books/react/lesson30)
- [一篇文章总结 redux、react-redux、redux-saga](https://juejin.cn/post/6844903846666321934)
- [让 react 用起来更得心应手——（react-redux）](https://juejin.cn/post/6844903698338938888)
