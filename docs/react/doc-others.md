# Redux、Router、性能优化等

## Flux

Flux 将一个应用分成四个部分:

- View： 视图层
- Action（动作）：视图层发出的消息（比如 mouseClick）
- Dispatcher（派发器）：用来接收 Actions、执行回调函数
- Store（数据层）：用来存放应用的状态，一旦发生变动，就提醒 Views 要更新页面

![Flux](https://image-static.segmentfault.com/115/853/1158536343-5c935016e51c7_articlex)

Flux 是一种强制单向数据流的架构模式(MVC)。

它控制派生数据，并使用具有所有数据权限的中心 store 实现多个组件之间的通信。整个应用中的数据更新必须只能在此处进行。

Flux 为应用提供稳定性并减少运行时的错误。

- [Flux 架构入门教程](http://www.ruanyifeng.com/blog/2016/01/flux.html) - 阮一峰

## Redux

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。Redux 由以下组件组成：

- Action – 这是一个用来描述发生了什么事情的对象。
- Reducer – 这是一个确定状态将如何变化的地方。
- Store – 整个程序的状态/对象树保存在 Store 中。
- View – 只显示 Store 提供的数据。

![Redux 数据流动](https://image-static.segmentfault.com/966/439/96643934-5c935008d48ce_articlex)

Redux 遵循的三个原则：

**单一事实来源**：整个应用的状态存储在单个 store 中的对象/状态树里。单一状态树可以更容易地跟踪随时间的变化，并调试或检查应用程序。

**状态是只读的**：改变状态的唯一方法是去触发一个动作。动作是描述变化的普通 JS 对象。就像 state 是数据的最小表示一样，该操作是对数据更改的最小表示。

**使用纯函数进行更改**：为了指定状态树如何通过操作进行转换，你需要纯函数。纯函数是那些返回值仅取决于其参数值的函数。

```js
// Reducer 函数必须是“纯”的 —— 不能修改它的参数，也不能有副作用
const reducer = function(state = 0, action) {
  // 每一次调用 dispatch 最终都会调用 reducer！

  // State 是只读的，唯一修改它的方式是 actions
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

const store = Redux.createStore(reducer);

const unsubscribe = store.subscribe(() => console.log(store.getState()));

// 更新的唯一方式：dispatch(action) -> reducer -> new state。
store.dispatch({
  type: "INCREMENT",
});

store.dispatch({
  type: "INCREMENT",
});

// 停止监听 state 更新
unsubscribe();
```

简要描述：

- redux 是的诞生是为了给 React 应用提供「可预测化的状态管理」机制。
- Redux 会将整个应用状态(其实也就是数据)存储到到一个地方，称为 store
- 这个 store 里面保存一棵状态树(state tree)
- 组件改变 state 的唯一方法是通过调用 store 的 dispatch 方法，触发一个 action，这个 action 被对应的 reducer 处理，于是 state 完成更新
- 组件可以派发(dispatch)行为(action)给 store,而不是直接通知其它组件
- 其它组件可以通过订阅 store 中的状态(state)来刷新自己的视图

Demo 演示：

```js
import { createStore } from "redux";

/* 创建reducer
 ** 可以使用单独的一个reducer,也可以将多个reducer合并为一个reducer，即：combineReducers()
 ** action发出命令后将state放入reucer加工函数中，返回新的state,对state进行加工处理
 */
const reducer = (state = { counter: 0 }, action) => {
  switch (action.type) {
    case "INCREASE":
      return { counter: state.counter + 1 };
    case "DECREASE":
      return { counter: state.counter - 1 };
    default:
      return state;
  }
};

/* 创建action
 ** 用户是接触不到state的，只能有view触发，所以，这个action可以理解为指令，需要发出多少动作就有多少指令
 ** action是一个对象，必须有一个叫type的参数，定义action类型
 */
const actions = {
  increase: () => ({ type: "INCREASE" }),
  decrease: () => ({ type: "DECREASE" }),
};

/* 创建的store，使用createStore方法
 ** store 可以理解为有多个加工机器的总工厂
 ** 提供subscribe，dispatch，getState这些方法。
 */
const store = createStore(reducer);

// 订阅
const unsubscribe = store.subscribe(() => console.log(store.getState()));

// 发起一系列 action
store.dispatch(actions.increase()); // {counter: 1}
store.dispatch(actions.increase()); // {counter: 2}
store.dispatch(actions.increase()); // {counter: 3}
store.dispatch(actions.decrease()); // {counter: 2}

// 停止监听 state 更新
unsubscribe();
```

Redux 与 Flux 有何不同?

| Flux                               | Redux                            |
| ---------------------------------- | -------------------------------- |
| 1. Store 包含状态和更改逻辑        | 1. Store 和更改逻辑是分开的      |
| 2. 有多个 Store                    | 2. 只有一个 Store                |
| 3. 所有 Store 都互不影响且是平级的 | 3. 带有分层 reducer 的单一 Store |
| 4. 有单一调度器                    | 4. 没有调度器的概念              |
| 5. React 组件订阅 store            | 5. 容器组件是有联系的            |
| 6. 状态是可变                      | 6. 状态是不可改变的              |

Redux 的优点如下：

- 结果的可预测性 - 由于总是存在一个真实来源，即 store ，因此不存在如何将当前状态与动作和应用的其他部分同步的问题。
- 可维护性 - 代码变得更容易维护，具有可预测的结果和严格的结构。
- 服务器端渲染 - 你只需将服务器上创建的 store 传到客户端即可。这对初始渲染非常有用，并且可以优化应用性能，从而提供更好的用户体验。
- 开发人员工具 - 从操作到状态更改，开发人员可以实时跟踪应用中发生的所有事情。
- 社区和生态系统 - Redux 背后有一个巨大的社区，这使得它更加迷人。一个由才华横溢的人组成的大型社区为库的改进做出了贡献，并开发了各种应用。
- 易于测试 - Redux 的代码主要是小巧、纯粹和独立的功能。这使代码可测试且独立。
  组织 - Redux 准确地说明了代码的组织方式，这使得代码在团队使用时更加一致和简单。

关于 Redux 的资料：

- [[译] React Redux 完全指南](https://mp.weixin.qq.com/s/q8M-c3oGBTxURm7h6-sBUA)
- [Redux 中文文档](https://www.redux.org.cn/)
- [Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
- [Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
- [Redux 入门教程（三）：React-Redux 的用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)

## React-Redux

React Redux 将组件区分为 容器组件 和 UI 组件：

- 前者会处理逻辑
- 后者只负责显示和交互，内部不处理逻辑，状态完全由外部掌控

两个核心：

- Provider 顶层组件，目的是让所有组件都能够访问到 Redux 中的数据
- connect：`connect(mapStateToProps, mapDispatchToProps)(MyComponent)`

  - mapStateToProps - 把 Redux 中的数据映射到 React 中的 props 中去
  - mapDispatchToProps - 把各种 dispatch 变成了 props 让你可以直接使用

DEMO：实现计数器，完整 Demo 可以看[这里](https://github.com/yangtao2o/myreact/tree/master/myredux/react-redux-counter)。

学习资料：

- [Redux 入门教程（三）：React-Redux 的用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html) - 阮一峰
- [一篇文章总结 redux、react-redux、redux-saga](https://juejin.im/post/5ce0ae0c5188252f5e019c2c#heading-4)

## Redux 中间件

我们使用 redux-thunk 在 React 中调用 API。因为 reduce 是纯函数，所以没有副作用，比如调用 API。

因此，我们必须使用 redux-thunk 从 Action creators 那里进行 API 调用。Action creator 派发一个 action，将来自 API 的数据放入 action 的 payload 中。Reducers 接收数据，其余的过程也是相同的。

redux-thunk 是一个中间件。一旦它被引入到项目中，每次派发一个 action 时，都会通过 thunk 传递。如果它是一个函数，它只是等待函数处理并返回响应。如果它不是一个函数，它只是正常处理。

举个栗子：sendEmailAPI 是从组件中调用的函数，它接受一个数据并返回一个函数，其中 dispatch 作为参数。我们使用 redux-thunk 调用 API apiservice，并等待收到响应。一旦接收到响应，我们就使用 payload 派发一个 action。

```js
import apiservice from "../services/apiservice";

export function sendEmail(data) {
  return { type: "SEND_EMAIL", payload: data };
}

export function sendEmailAPI(email) {
  return function(dispatch) {
    return apiservice.callAPI(email).then((data) => {
      dispatch(sendEmail(data));
    });
  };
}
```

其他中间件：

- redux-saga
- redux-thunk
- redux-promise

学习资料：

- [Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html) - 阮一峰
- [你要的 React 面试知识点，都在这了](https://juejin.im/post/5cf0733de51d4510803ce34e)

## MobX

学习资料：

- [MobX 中文文档](https://cn.mobx.js.org/)

## React Router

Router 会创建一个 history 对象，history 用来跟踪 URL，当 URL 发生变化时，Router 的后代组件会重新渲染。React Router 中提供的其他组件可以通过 context 获取 history 对象，所以，React Router 中的其他组件必须作为 Router 组件的后代组件使用。但 Router 中只能有唯一的一个子元素。

### 基本组件

React Router 中有三类组件:

- router 组件（BrowserRouter，HashRouter）
- route matching 组件（Route，Switch）
- navigation 组件（Link）

使用 react-router-dom 之前，我们需要在工程路径下安装这个包

```shell
npm install react-router-dom
```

安装完成后，上面所列出的这些组件，我们可以通过 react-router-dom 得到。

```jsx
import { BrowserRouter, Route, Link } from "react-router-dom";
```

### Route Rendering Props

`<Route>` 匹配时所显示的组件，有三种写法：

- component
- render
- children

```jsx
<Route path="/user/:username" component={User} />;
// convenient inline rendering
<Route path="/foo" render={(props) => (
  <Foo {...props} data={exactProps} />
)} />
<Route path="/foo" children={(props) => (
  <div className={props.match ? 'active' : ''}>
    <Foo />
  </div>
)} />

function User({ match }) {
  return <h1>Hello {match.params.username}!</h1>;
}
```

### Navigation

- Link
- Navlink
- Redirect

```jsx
<Link to="/">Home</Link>
// <a href='/'>Home</a>

// location = { pathname: '/react' }
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>
// <a href='/react' className='hurray'>React</a>

<Route exact path="/" render={() => (
  loggedIn ? (
    <Redirect to="/dashboard"/>
  ) : (
    <PublicHomePage/>
  )
)}/>
```

### withRoute

不是通过 Route 渲染出来的组件没有 match、location、history 三个属性,但是又想要使用这三个属性，那该怎么办呢，所以可以在外面套一层 Route 组件，从而得到这三个属性，这种做法叫高阶组件。

- [React-Router 的基本使用](https://juejin.im/post/5be2993df265da611e4d220c)
- [React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html) - 阮一峰
- [React-Router 文档](https://reacttraining.com/react-router/web/guides/quick-start)
- [React Router 中文文档](http://react-guide.github.io/react-router-cn/)
- [让 react 用起来更得心应手——（react-router 原理简析）](https://juejin.im/post/5bcdb66251882577102a3b21)

## 如何提高性能

我们可以通过多种方式提高应用性能，以下这些比较重要：

- 适当地使用 **shouldComponentUpdate** 生命周期方法。它避免了子组件的不必要的渲染。如果树中有 100 个组件，则不重新渲染整个组件树来提高应用程序性能。
- 使用 **create-react-app** 来构建项目，这会创建整个项目结构，并进行大量优化。
- **不可变性**是提高性能的关键。不要对数据进行修改，而是始终在现有集合的基础上创建新的集合，以保持尽可能少的复制，从而提高性能。
- 在显示列表或表格时**始终使用 Keys**，这会让 React 的更新速度更快
- **代码分离**是将代码插入到单独的文件中，只加载模块或部分所需的文件的技术。

## 如何在重新加载页面时保留数据

单页应用程序首先在 DOM 中加载 index.html，然后在用户浏览页面时加载内容，或者从同一 index.html 中的后端 API 获取任何数据。

如果通过点击浏览器中的重新加载按钮重新加载页面 index.html，整个 React 应用程序将重新加载，我们将丢失应用程序的状态。如何保留应用状态？

每当重新加载应用程序时，我们使用浏览器**localstorage 来保存应用程序的状态**。我们将整个存储数据保存在 localstorage 中，每当有页面刷新或重新加载时，我们从 localstorage 加载状态。

## React 性能优化

- [React 性能优化的 8 种方式了解一下](https://juejin.im/post/5d63311be51d45620821ced8)
- [浅谈 React 性能优化的方向](https://juejin.im/post/5d045350f265da1b695d5bf2)
- [[译] React 性能优化-虚拟 Dom 原理浅析](https://juejin.im/post/5b2e06bde51d4558892ed786)

## React 源码解析

- [React 源码解析](https://www.bilibili.com/video/BV1cE411B7by) - 小马哥\_老师 视频，可以先睹为快了解下
- [《React 源码解析》系列完结！](https://juejin.im/post/5a84682ef265da4e83266cc4)
- [剖析 React 源码：先热个身](https://juejin.im/post/5cbae9a8e51d456e2809fba3)

## 学习资料

### React

- [React.js 小书](http://huziketang.mangojuice.top/books/react/)
- [React 精髓！一篇全概括(急速)](https://juejin.im/post/5cd9752f6fb9a03247157b6d)
- [新手学习 react 迷惑的点(一)](https://juejin.im/post/5d6be5c95188255aee7aa4e0)
- [新手学习 react 迷惑的点(二)](https://juejin.im/post/5d6f127bf265da03cf7aab6d)
- [理解 MVVM 在 react、vue 中的使用](https://www.cnblogs.com/momozjm/p/11542635.html)
- [必须要会的 50 个 React 面试题](https://segmentfault.com/a/1190000018604138)
- [2019 年 17 道高频 React 面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)
- [你要的 React 面试知识点，都在这了](https://juejin.im/post/5cf0733de51d4510803ce34e)

### Redux Mbox

- [Redux 中文文档](https://www.redux.org.cn/)
- [Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html) - 阮一峰
- [Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html) - 阮一峰
- [Redux 入门教程（三）：React-Redux 的用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html) - 阮一峰
- [一篇文章总结 redux、react-redux、redux-saga](https://juejin.im/post/5ce0ae0c5188252f5e019c2c)
- [React Hooks 入门教程](http://www.ruanyifeng.com/blog/2019/09/react-hooks.html) - 阮一峰
- [MobX 中文文档](https://cn.mobx.js.org/)

### Router

- [React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html) - 阮一峰
- [React-Router 的基本使用](https://juejin.im/post/5be2993df265da611e4d220c)
- [React-Router 文档](https://reacttraining.com/react-router/web/guides/quick-start)
- [React Router 中文文档](http://react-guide.github.io/react-router-cn/)
