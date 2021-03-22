# React 基础理论

## 声明式编程 vs 命令式编程

**声明式编程**是一种编程范式，它关注的是你要做什么，而不是如何做。它表达逻辑而不显式地定义步骤。这意味着我们需要根据逻辑的计算来声明要显示的组件。它没有描述控制流步骤。声明式编程的例子有 HTML、SQL 等。

声明式编程的编写方式描述了应该做什么，而**命令式编程**描述了如何做。在声明式编程中，让编译器决定如何做事情。声明性程序很容易推理，因为代码本身描述了它在做什么。

**函数式编程**是声明式编程的一部分。javascript 中的函数是第一类公民，这意味着函数是数据，你可以像保存变量一样在应用程序中保存、检索和传递这些函数。

函数式编程有些核心的概念，如下：

- 不可变性(Immutability)
- 纯函数(Pure Functions)
- 数据转换(Data Transformations)
- 高阶函数 (Higher-Order Functions)
- 递归
- 组合

## React 生命周期

[生命周期图谱](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)速查表。

React 16 的生命周期，总的来说 React 组件的生命周期分为三（四）个部分:

- 装载期间(Mounting)
- 更新期间(Updating)
- 卸载期间(Unmounting)
- 捕捉错误（React16）componentDidCatch()

### 装载期间

组件被实例化并挂载在到 DOM 树这一过程称为装载，在装载期调用的生命周期函数依次为

- constructor() - 初始化这个组件的一些状态和操作
- getDerivedStateFromProps() - 会在 render 函数被调用之前调用
- render() - 根据状态 state 和属性 props 渲染一个 React 组件
- componentDidMount() - 在 render 方法之后立即被调用，只会被调用一次

示例 contructor 实现如下：

```js
constructor(props) {
  super(props);
  this.state = {
    color: '#fff'
  };

  this.handleClick = this.handleClick.bind(this);
}
```

getDerivedStateFromProps 配合 componentDidUpdate 的写法如下:

```js
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // 不再提供 prevProps 的获取方式
    if (nextProps.currentRow !== prevState.lastRow) {
      return {
        isScrollingDown: nextProps.currentRow > prevState.lastRow,
        lastRow: nextProps.currentRow,
      };
    }

    // 默认不改动 state
    return null;
  }

  componentDidUpdate() {
    // 仅在更新触发后请求数据
    this.loadAsyncData();
  }

  loadAsyncData() {
    /* ... */
  }
}
```

如何在 componentDidMount 加载数据并设置状态:

```js
componentDidMount() {
  fetch("https://api.github.com/search/repositories?q=language:java&sort=stars")
    .then(res => res.json())
    .then((result) => {
        this.setState({ // 触发render
          items: result.items
        });
      })
    .catch((error) => { console.log(error)});
  // this.setState({color: xxx}) // 不要这样做
}
```

### 更新期间

当组件的状态或属性变化时会触发更新，更新过程中会依次调用以下方法:

- getDerivedStateFromProps()
- shouldComponentUpdate(nextProps, nextState) - 是否要进行下一次 render()，默认这个函数放回 true
- render()
- getSnapshotBeforeUpdate() - 触发时间为 update 发生的时候，在 render 之后 dom 渲染之前返回一个值，作为 componentDidUpdate 的第三个参数
- componentDidUpdate() - 在更新完成后被立即调用，可以进行 DOM 操作，或者做一些异步调用

### 卸载期间

卸载期间是指组件被从 DOM 树中移除时，调用的相关方法为:

- componentWillUnmount()

该方法会在组件被卸载之前被调用，你可以在这个函数中进行相关清理工作，比如删除定时器。

```js
componentWillUnmount() {
  // 清除timer
  clearInterval(this.timerID1);
  clearTimeout(this.timerID2);

  // 关闭socket
  this.myWebsocket.close();

  // 取消消息订阅...
}
```

### 错误捕获

React16 中新增了一个生命周期函数:

- componentDidCatch(error, info)

### React16 中的生命周期函数变化

React 16 之后有三个生命周期被废弃(但并未删除)

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

官方计划在 17 版本完全删除这三个函数，只保留 UNSAVE\_前缀的三个函数，目的是为了向下兼容，但是对于开发者而言应该尽量避免使用他们，而是使用新增的生命周期函数替代它们。

### 父子组件生命周期变化

初次装载期间：

```log
Parent constructor {}
Parent getDerivedStateFromProps {} {name: "tao"}
Parent render
Child constructor  {}
Child getDerivedStateFromProps {} {value: 0}
Child render
Child componentDidMount
Parent componentDidMount
```

更新子组件：

```log
Child getDerivedStateFromProps {} {value: 1}
Child shouldComponentUpdate(nextProps, nextState) {} {value: 1}
Child render
Child getSnapshotBeforeUpdate {} {value: 1}
Child componentDidUpdate {} {value: 1} null
```

### 总结

挂载阶段:

- constructor: 构造函数，最先被执行,我们通常在构造函数里初始化 state 对象或者给自定义方法绑定 this

- getDerivedStateFromProps: `static getDerivedStateFromProps(nextProps, prevState)`,这是个静态方法,当我们接收到新的属性想去修改我们 state，可以使用 getDerivedStateFromProps

- render: render 函数是纯函数，只返回需要渲染的东西，不应该包含其它的业务逻辑,可以返回原生的 DOM、React 组件、Fragment、Portals、字符串和数字、Boolean 和 null 等内容

- componentDidMount: 组件装载之后调用，此时我们可以获取到 DOM 节点并操作，比如对 canvas，svg 的操作，服务器请求，订阅都可以写在这个里面，但是记得在 componentWillUnmount 中取消订阅

更新阶段:

- getDerivedStateFromProps: 此方法在更新个挂载阶段都可能会调用`shouldComponentUpdate`

- `shouldComponentUpdate(nextProps, nextState)`,有两个参数 nextProps 和 nextState，表示新的属性和变化之后的 state，返回一个布尔值，true 表示会触发重新渲染，false 表示不会触发重新渲染，默认返回 true,我们通常利用此生命周期来优化 React 程序性能

- render: 更新阶段也会触发此生命周期

- getSnapshotBeforeUpdate: `getSnapshotBeforeUpdate(prevProps, prevState)`,这个方法在 render 之后，componentDidUpdate 之前调用，有两个参数 prevProps 和 prevState，表示之前的属性和之前的 state，这个函数有一个返回值，会作为第三个参数传给 componentDidUpdate，如果你不想要返回值，可以返回 null，此生命周期必须与 componentDidUpdate 搭配使用

- componentDidUpdate: `componentDidUpdate(prevProps, prevState, snapshot)`,该方法在 getSnapshotBeforeUpdate 方法之后被调用，有三个参数 prevProps，prevState，snapshot，表示之前的 props，之前的 state，和 snapshot。第三个参数是 getSnapshotBeforeUpdate 返回的,如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

卸载阶段:

- componentWillUnmount: 当我们的组件被卸载或者销毁了就会调用，我们可以在这个函数里去清除一些定时器，取消网络请求，清理无效的 DOM 元素等垃圾清理工作

学习资料：

- [React 的生命周期](https://www.yuque.com/ant-design/course/lifemethods) - 语雀
- [2019 年 17 道高频 React 面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)

## React 中的 props 是什么

React 中的组件 (包括 Class Component 和 Functional Component) 对应于 JavaScript 的函数，而 props 就相当于这个构造函数的入参。其目的是为了实现数据从父组件到子组件的流动和组件的复用。
在 Class Component 中这样使用 props：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

在 Functional Component 中这样使用：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

React 中所有的组件都应该是 “纯函数”，也就是说，入参 props 是不可以在组件内部被直接更改的。

props 不仅仅可以传递数据，还可以传递回调函数：

```js
function Welcome(props) {
  return <button onClick={props.callback}>Hello, {props.name}</button>;
}
```

props 与解构赋值，其主要应用于给组件的子组件直传 props：

```js
function Button2({ keyword, ...propsForButton }) {
  return (
    <div>
      keyword:{props.keyword}
      <button {...propsForButton} class="sub-button" />
    </div>
  );
}
```

## JSX 语法

JSX 是一个 JavaScript 的语法扩展。

JSX 可以被 Babel 转码器转为正常的 JavaScript 语法。Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。

React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。

React 并没有采用将标记与逻辑进行分离到不同文件这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现关注点分离。

```js
export default () => {
  return <div className="greeting">hello world</div>;
};
```

可以转化为：

```js
export default = function() {
  return React.createElement(
    'div',
    {className: 'greeting'},
    'hello world'
  )
}
```

`React.createElement()` 会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：

```js
// 注意：这是简化过的结构
const element = {
  type: "div",
  props: {
    className: "greeting",
    children: "hello world",
  },
};
```

所以，可以回答为什么要引入 React?

babel 里进行转化一下，发现 babel 会把代码转化成:

```js
return React.createElement("div", { className: "greeting" }, "hello world");
```

因为从本质上讲，JSX 只是为 `React.createElement(component, props, ...children)` 函数提供的语法糖。

参考：[JSX 简介](https://zh-hans.reactjs.org/docs/introducing-jsx.html)

## 组件和不同类型

React 中一切都是组件。 我们通常将应用程序的整个逻辑分解为小的单个部分。 我们将每个单独的部分称为组件。 通常，组件是一个 javascript 函数，它接受输入，处理它并返回在 UI 中呈现的 React 元素。

### 函数/无状态/展示组件

函数或无状态组件是一个纯函数，它可接受接受参数，并返回 react 元素。这些都是没有任何副作用的纯函数。这些组件没有状态或生命周期方法，比如：

```js
import React from "react";

export const Header = () => {
  return (
    <div style={{ backgroundColor: "orange" }}>
      <h1>TODO App</h1>
    </div>
  );
};
```

### 类/有状态组件

类或有状态组件具有状态和生命周期方可能通过`setState()`方法更改组件的状态。类组件是通过扩展 React 创建的。它在构造函数中初始化，也可能有子组件，比如：

```js
import React from "react";

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={{ backgroundColor: "orange" }}>
        <h1>TODO App</h1>
      </div>
    );
  }
}
```

### 受控组件与非受控组件

- 受控组件

受控组件是在 React 中处理输入表单的一种技术。表单元素通常维护它们自己的状态，而 react 则在组件的状态属性中维护状态。我们可以将两者结合起来控制输入表单。这称为受控组件。因此，在受控组件表单中，数据由 React 组件处理。

- 非受控组件

在非受控组件中，Ref 用于直接从 DOM 访问表单值，而不是事件处理程序。

我们使用 Ref 构建了相同的表单，而不是使用 React 状态。使用`React.createRef()`定义 Ref 并传递该输入表单，并直接从 handleSubmit 方法中的 `this.input.current.value` 访问表单值。

```js
import React from "react";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "Hi" };
    this.input = React.createRef();
  }

  handleSubmit(e) {
    this.setState({
      value: this.input.current.value,
    });
    e.preventDefault();
  }

  render() {
    return (
      <>
        <input ref={this.input} onChange={(e) => this.handleSubmit(e)} />
        <p>{this.state.value}</p>
      </>
    );
  }
}
```

总结：

| 受控组件                                       | 非受控组件               |
| ---------------------------------------------- | ------------------------ |
| 1. 没有维持自己的状态                          | 1. 保持着自己的状态      |
| 2.数据由父组件控制                             | 2.数据由 DOM 控制        |
| 3. 通过 props 获取当前值，然后通过回调通知更改 | 3. Refs 用于获取其当前值 |

### 容器组件

容器组件是处理获取数据、订阅 redux 存储等的组件。它们包含展示组件和其他容器组件，但是里面从来没有 html。

### 高阶组件

高阶组件是将组件作为参数并生成另一个组件的组件。 Redux connect 是高阶组件的示例。 这是一种用于生成可重用组件的强大技术。

学习资料：

- [受控组件与非受控组件](https://www.yuque.com/ant-design/course/goozth)
- [你要的 React 面试知识点，都在这了](https://juejin.im/post/5cf0733de51d4510803ce34e)

## React 是如何处理事件的

React 的事件是合成事件， 内部原理非常复杂，我这里只把关键性，可以用来解答这个问题的原理部分进行介绍即可。

jsx 实际上是 `React.createElement(component, props, …children)` 函数提供的语法糖，那么这段 jsx 代码：

```js
<button onClick={this.handleClick}>Click me</button>
```

会被转化为：

```js
React.createElement(
  "button",
  {
    onClick: this.handleClick,
  },
  "Click me"
);
```

React 在组件加载(mount)和更新(update)时，将事件通过 addEventListener 统一注册到 document 上，然后会有一个事件池存储了所有的事件，当事件触发的时候，通过 dispatchEvent 进行事件分发。

所以你可以简单的理解为，最终 `this.handleClick` 会作为一个回调函数调用。

### 四种事件处理对比

对于事件处理的写法也有好几种，咱们来进行对比一下：

- 直接 bind this 型

就是像文章开始的那样，直接在事件那里 bind this

```js
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa });
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Click me</button>;
  }
}
```

优点：写起来顺手，一口气就能把这个逻辑写完，不用移动光标到其他地方。

缺点：性能不太好，这种方式跟 react 内部帮你 bind 一样的，每次 render 都会进行 bind，而且如果有两个元素的事件处理函数式同一个，也还是要进行 bind，这样会多写点代码，而且进行两次 bind，性能不是太好。(其实这点性能往往不会是性能瓶颈的地方，如果你觉得顺手，这样写完全没问题)

- constuctor 手动 bind 型

```js
class Foo extends React.Component {
  constuctor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ xxx: aaa });
  }

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

优点：相比于第一种性能更好，因为构造函数只执行一次，那么只会 bind 一次，而且如果有多个元素都需要调用这个函数，也不需要重复 bind，基本上解决了第一种的两个缺点。

缺点：没有明显缺点，硬要说的话就是太丑了，然后不顺手(我觉得丑，你觉得不丑就这么写就行了)。

- 箭头函数型

```js
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa });
  }

  render() {
    return <button onClick={(e) => this.handleClick(e)}>Click me</button>;
  }
}
```

优点：顺手，好看。

缺点：每次 render 都会重复创建函数，性能会差一点。

- public class fields 型

```js
class Foo extends React.Component {
  handleClick = () => {
    this.setState({ xxx: aaa });
  };

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

优点：好看，性能好。

缺点：没有明显缺点，如果硬要说可能就是要多装一个 babel 插件来支持这种语法。

学习资料：[新手学习 react 迷惑的点(二)](https://juejin.im/post/5d6f127bf265da03cf7aab6d)

## React 中应用样式的三种方式

- 外部样式表，使用 className 而不是 class 来为 React 元素应用样式
- 内联样式，将 javascript 对象传递给 style，如

```jsx
<div style={{ backgroundColor: "orange" }} />
```

- 定义样式对象并使用它，如：

```js
import React from "react";

const footerStyle = {
  width: "100%",
  backgroundColor: "green",
};

export const Footer = () => {
  return <div style={footerStyle}>All Rights Reserved 2020</div>;
};
```
