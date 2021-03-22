# React 高级特性

## setState 是同步还是异步相关问题

- setState 是同步还是异步？

我的回答是执行过程代码同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，所以表现出来有时是同步，有时是“异步”。

- 何时是同步，何时是异步呢？

只在合成事件和钩子函数中是“异步”的，在原生事件和 `setTimeout/setInterval`等原生 API 中都是同步的。简单的可以理解为被 React 控制的函数里面就会表现出“异步”，反之表现为同步。

- 那为什么会出现异步的情况呢？

为了做性能优化，将 state 的更新延缓到最后批量合并再去渲染对于应用的性能优化是有极大好处的，如果每次的状态改变都去重新渲染真实 dom，那么它将带来巨大的性能消耗。

- 那如何在表现出异步的函数里可以准确拿到更新后的 state 呢？

通过第二个参数 `setState(partialState, callback)` 中的 callback 拿到更新后的结果。

或者可以通过给 setState 传递函数来表现出同步的情况：

```js
this.setState((state) => {
  return { val: newVal };
});
```

setState  的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState，setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

- 那表现出异步的原理是怎么样的呢？

我这里还是用最简单的语言让你理解：在 React 的 setState 函数实现中，会根据 `isBatchingUpdates`(默认是 false) 变量判断是否直接更新 `this.state` 还是放到队列中稍后更新。然后有一个 `batchedUpdate` 函数，可以修改 `isBatchingUpdates` 为 true，当 React 调用事件处理函数之前，或者生命周期函数之前就会调用 `batchedUpdate` 函数，这样的话，setState 就不会同步更新 `this.state`，而是放到更新队列里面后续更新。

这样你就可以理解为什么原生事件和 `setTimeout/setinterval` 里面调用 `this.state` 会同步更新了吧，因为通过这些函数调用的 React 没办法去调用 `batchedUpdate` 函数将 `isBatchingUpdates` 设置为 true，那么这个时候 setState 的时候默认就是 false，那么就会同步更新。

学习资料：[新手学习 react 迷惑的点(二)](https://juejin.im/post/5d6f127bf265da03cf7aab6d)

## Virtual DOM

### Real DOM VS Virtual DOM

| Real DOM                        | Virtual DOM                    |
| ------------------------------- | ------------------------------ |
| 1. 更新缓慢。                   | 1. 更新更快。                  |
| 2. 可以直接更新 HTML。          | 2. 无法直接更新 HTML。         |
| 3. 如果元素更新，则创建新 DOM。 | 3. 如果元素更新，则更新 JSX 。 |
| 4. DOM 操作代价很高。           | 4. DOM 操作非常简单。          |
| 5. 消耗的内存较多。             | 5. 很少的内存消耗。            |

### Virtual DOM 的工作原理

Virtual DOM 是一个轻量级的 JavaScript 对象，它最初只是 real DOM 的副本。

它是一个节点树，它将元素、它们的属性和内容作为对象及其属性。

React 的渲染函数从 React 组件中创建一个节点树。然后它响应数据模型中的变化来更新该树，该变化是由用户或系统完成的各种动作引起的。

Virtual DOM 工作过程有三个简单的步骤:

1. 每当底层数据发生改变时，整个 UI 都将在 Virtual DOM 描述中重新渲染。
2. 然后计算之前 DOM 表示与新表示的之间的差异。
3. 完成计算后，将只用实际更改的内容更新 real DOM。

资料：[必须要会的 50 个 React 面试题](https://segmentfault.com/a/1190000018604138)

## React 与 Angular 有何不同

| 主题        | React                | Angular       |
| ----------- | -------------------- | ------------- |
| 1. 体系结构 | 只有 MVC 中的 View   | 完整的 MVC    |
| 2. 渲染     | 可以进行服务器端渲染 | 客户端渲染    |
| 3. DOM      | 使用 virtual DOM     | 使用 real DOM |
| 4. 数据绑定 | 单向数据绑定         | 双向数据绑定  |
| 5. 调试     | 编译时调试           | 运行时调试    |
| 6. 作者     | Facebook             | Google        |

## 高阶组件（HOC）

高阶组件是重用组件逻辑的高级方法，是一种源于 React 的组件模式。

HOC 是自定义组件，在它之内包含另一个组件。它们可以接受子组件提供的任何动态，但不会修改或复制其输入组件中的任何行为。你可以认为 HOC 是“纯（Pure）”组件。

HOC 可用于许多任务，例如：

- 代码重用，逻辑和引导抽象
- 渲染劫持
- 状态抽象和控制
- Props 控制

## 纯组件

纯（Pure） 组件是可以编写的最简单、最快的组件。

它们可以替换任何只有 render() 的组件。这些组件增强了代码的简单性和应用的性能。

## React 中 key 的重要性是什么

key 用于识别唯一的 Virtual DOM 元素及其驱动 UI 的相应数据。

它们通过回收 DOM 中当前所有的元素来帮助 React 优化渲染。

这些 key 必须是唯一的数字或字符串，React 只是重新排序元素而不是重新渲染它们。这可以提高应用程序的性能。

## React 组件通信如何实现

React 组件间通信方式:

- 父组件向子组件通讯: 父组件可以向子组件通过传 props 的方式，向子组件进行通讯

```js
class Son extends React.Component {
  render() {
    return <p>{this.props.text}</p>;
  }
}

class Father extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Son text="这是父组件传给子组件的内容" />
      </div>
    );
  }
}
```

- 子组件向父组件通讯: props+回调的方式,父组件向子组件传递 props 进行通讯，此 props 为作用域为父组件自身的函数，子组件调用该函数，将子组件想要传递的信息，作为参数，传递到父组件的作用域中

```js
class Son extends React.Component {
  render() {
    return <p onClick={this.props.onClick}>{this.props.text}</p>;
  }
}

class Father extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fatherToSonText: "父组件传给子组件的内容",
      sonToFatherText: "子组件传给父组件的内容",
    };
  }
  handleClick(text) {
    alert(text);
  }
  render() {
    return (
      <Son
        text={this.state.fatherToSonText}
        onClick={(e) => this.handleClick(this.state.sonToFatherText, e)}
      />
    );
  }
}
```

- 兄弟组件通信: 找到这两个兄弟节点共同的父节点,结合上面两种方式由父节点转发信息进行通信

```js
class FirstSon extends React.Component {
  render() {
    return <h2 onClick={this.props.onClick}>戳我，我要让旁边那位变成红色</h2>;
  }
}

class SecondSon extends React.Component {
  render() {
    return <h2 style={{ color: this.props.color }}>我是你旁边那位</h2>;
  }
}

class Father extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "#666",
    };
  }
  handleClick() {
    this.setState({
      color: "red",
    });
  }
  render() {
    return (
      <div>
        <FirstSon onClick={() => this.handleClick()} />
        <SecondSon color={this.state.color} />
      </div>
    );
  }
}
```

- 跨层级通信: Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言, 对于跨越多层的全局数据通过 Context 通信再适合不过

```js
const MyContext = React.createContext(defaultValue);
```

- 发布订阅模式: 发布者发布事件，订阅者监听事件并做出反应,我们可以通过引入 event 模块进行通信

- 全局状态管理工具: 借助 Redux 或者 Mobx 等全局状态管理工具进行通信,这种工具会维护一个全局状态中心 Store,并根据不同的事件产生新的状态

![Redux](https://user-gold-cdn.xitu.io/2019/8/23/16cbc24e6fd6847c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

学习资料：[2019 年 17 道高频 React 面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)

## MVC VS MVVM

### MVC 的含义

- M（modal）：是应用程序中处理数据逻辑的部分。
- V（view） ：是应用程序中数据显示的部分。
- C（controller）：是应用程序中处理用户交互的地方（Controller 是 MVC 中的数据和视图的协调者，也就是在 Controller 里面把 Model 的数据赋值给 View 来显示（或者是 View 接收用户输入的数据然后由 Controller 把这些数据传给 Model 来保存到本地或者上传到服务器））

### MVC 模式有什么缺点

- 对 DOM 操作的代价非常高
- 程序运行缓慢且效率低下
- 内存浪费严重
- 应用程序复杂性高，难以分工开发
- 由于循环依赖性，组件模型需要围绕 models 和 views 进行创建

### MVVM 的含义

- M（modal）：模型，定义数据结构。
- C（controller）：实现业务逻辑，数据的增删改查。在 MVVM 模式中一般把 C 层算在 M 层中，（只有在理想的双向绑定模式下，Controller 才会完全的消失。这种理想状态一般不存在）。
- VM（viewModal）：视图 View 的模型、映射和显示逻辑（如 if for 等，非业务逻辑），另外绑定器也在此层。ViewModel 是基于视图开发的一套模型，如果你的应用是给盲人用的，那么也可以开发一套基于 Audio 的模型 AudioModel。
- V（view） ：将 ViewModel 通过特定的 GUI 展示出来，并在 GUI 控件上绑定视图交互事件，V(iew)一般由 MVVM 框架自动生成在浏览器中。

### MVVM 的优点

MVVM 比 MVC 精简很多，不仅简化了业务与界面的依赖，还解决了数据频繁更新的问题，不用再用选择器操作 DOM 元素。因为在 MVVM 中，View 不知道 Model 的存在，Model 和 ViewModel 也观察不到 View，这种低耦合模式提高代码的可重用性。

[理解 MVVM 在 react、vue 中的使用](https://www.cnblogs.com/momozjm/p/11542635.html)

## React 事件机制

React 其实自己实现了一套事件机制，首先我们考虑一下以下代码：

```js
const Test = ({ list, handleClick }) => ({
    list.map((item, index) => (
        <span onClick={handleClick} key={index}>{index}</span>
    ))
})
```

点击事件是否绑定在了每一个标签上？事实当然不是，JSX 上写的事件并没有绑定在对应的真实 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在了 document 上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。

另外冒泡到 document 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（SyntheticEvent）。因此我们如果不想要事件冒泡的话，调用 `event.stopPropagation` 是无效的，而应该调用 `event.preventDefault`。

那么实现合成事件的目的是什么呢？总的来说在我看来好处有两点，分别是：

- **合成事件**首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
- 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。

## 什么是错误边界

在 React 中，我们通常有一个组件树。如果任何一个组件发生错误，它将破坏整个组件树。没有办法捕捉这些错误，我们可以用错误边界优雅地处理这些错误。错误边界有两个作用：

- 如果发生错误，显示回退 UI
- 记录错误

下面是 ErrorBoundary 类的一个例子。如果类实现了 getDerivedStateFromError 或 componentDidCatch 这两个生命周期方法的任何一个，那么这个类就会成为 ErrorBoundary。前者返回`{hasError: true}`来呈现回退 UI，后者用于记录错误。

```js
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log("Error::::", error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>OOPS!. WE ARE LOOKING INTO IT.</h1>;
    }

    return this.props.children;
  }
}
```

以下是我们如何在其中一个组件中使用 ErrorBoundary。使用 ErrorBoundary 类包裹 ToDoForm 和 ToDoList。 如果这些组件中发生任何错误，我们会记录错误并显示回退 UI。

```js
export class Dashboard extends React.Component {
  render() {
    return (
      <div className="dashboard">
        <ErrorBoundary>
          <ToDoForm />
          <ToDolist />
        </ErrorBoundary>
      </div>
    );
  }
}
```

## 什么是 Fragments

React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。我们只需要用 `React.Fragment` 或才简写 `<>` 来包裹内容就行了。

```js
// Without Fragments
return (
  <div>
    <CompoentA />
    <CompoentB />
  </div>
);

// With Fragments
return (
  <React.Fragment>
    <CompoentA />
    <CompoentB />
  </React.Fragment>
);

// shorthand notation Fragments
return (
  <>
    <CompoentA />
    <CompoentB />
  </>
);
```

## 什么是 Portals

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

```js
ReactDOM.createPortal(child, container);
```

第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。第二个参数（container）是一个 DOM 元素。

首先，先获取 id 为 someid DOM 元素，接着在构造函数中创建一个元素 div，在 componentDidMount 方法中将 someRoot 放到 div 中。最后，通过`ReactDOM.createPortal(this.props.childen, domnode)`将 children 传递到对应的节点下。

```js
const someRoot = document.getElementById("someid");

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    someRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    someRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
```

使用的时候：

```js
<div>
  <Modal>
    <Child />
  </Modal>
</div>;

function Child() {
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}
```

## 什么是 Context

Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。使用 context, 我们可以避免通过中间元素传递 props：

```js
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
const ThemeContext = React.createContext("light");
class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

## 什么是 Hooks

> Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

动机：

- 在组件之间复用状态逻辑很难
- 复杂组件变得难以理解
- 难以理解的 class

React Hooks 的设计目的，就是加强版函数组件，完全不使用"类"，就能写出一个全功能的组件。

React Hooks 的意思是，组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码"钩"进来。 React Hooks 就是那些钩子。

常用钩子：

- useState() 状态钩子
- useContext() 共享钩子
- useReducer() action 钩子
- useEffect() 副作用钩子

```js
// 引入 React 中的 useState, useEffect Hook。
// 它让我们在函数组件中存储内部 state。
import React, { useState, useEffect } from "react";

function Counter() {
  // 调用 useState Hook 声明了一个新的 state 变量。
  // 它返回一对值给到我们命名的变量上。
  // [count, setCount] 使用的数组解构
  const [count, setCount] = useState(0);
  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
}

export default Counter;
```

对比 Class Component 中将组件状态放在 state 属性中维持的做法，React Hook 使用 useState 方法来在 Function Component 中创建状态变量、创建改变状态的方法、传入初始状态。这样就实现了一个拥有自己的状态的 Function Component。显而易见，无论是简洁程度还是优雅程度，Function Component 都要远远优于 Class Component。

**useEffect**是用来处理组件状态变化引起的副作用的，而副作用的含义是：和真实世界进行交互的作用，都是副作用，包括页面跳转、Ajax 请求、DOM 操作等等。

在传统的 Class Component 中，副作用是在 componentDidMount 和 componentDidUpdate 两个生命周期中结合处理的。因为初次渲染，并不会执行 componentDidUpdate，而更新的时候，又需要通过 componentDidUpdate 更新。

在 useEffect 结合了这两个生命周期，其含义是：无论组件状态是第 1 次更新还是第 n 次更新，其中的回调函数都会被调用。

**React 何时清除 effect**？React 会在组件卸载的时候执行清除操作。

由于添加和删除订阅的代码的紧密性，所以 useEffect 的设计是在同一个地方执行。如果你的 effect 返回一个函数，React 将会在执行清除操作时调用它：

```js
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  // Specify how to clean up after this effect:
  return function cleanup() {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
});
```

学习资料：

- [Hook 简介](https://zh-hans.reactjs.org/docs/hooks-intro.html) - 官方文档讲解的非常详细，也非常易于理解
- [React Hooks 入门教程](http://www.ruanyifeng.com/blog/2019/09/react-hooks.html) - 阮一峰
- [30 分钟精通 React Hooks](https://juejin.im/post/5be3ea136fb9a049f9121014)
