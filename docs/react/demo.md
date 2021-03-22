# 入门学习 React 一些实例

> 这是几个入门学习 React 的小 Demo [Github 地址](https://github.com/yangtao2o/myreact/tree/master/demo)，帮助自己学习了解 React 的运行机制，结合 [React 官方文档](https://zh-hans.reactjs.org/docs/getting-started.html)，会更佳噢...

## 前期准备

- [With babel-standalone](https://babeljs.io/en/setup/#installation)

```javascript
<div id="output"></div>
<!-- Load Babel -->
<!-- v6 <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script> -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<!-- Your custom script here -->
<script type="text/babel">
const getMessage = () => "Hello World";
document.getElementById('output').innerHTML = getMessage();
</script>
```

## Demo01: ReactDOM.render()

[Demo](https://istaotao.com/myreact/demo/01/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/01/index.html)

初始化咱先 Hello 一下，使用 jsx 语法，碰到代码块使用（{ }）包起来，碰到 html 标签，就使用（< />）:

```javascript
var names = ["AAA", "BBB", "CCC"];
ReactDOM.render(
  <div>
    {names.map(function(name) {
      return <h2>Hello, {name}!</h2>;
    })}
  </div>,
  document.getElementById("example")
);
```

## Demo02: Use Array in JSX

[Demo](https://istaotao.com/myreact/demo/02/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/02/index.html)

如果 JavaScript 的变量是个数组，会展开这个数组的所有项.

```javascript
var arr = [<h1 key="h1">Hello,</h1>, <h2 key="h2">React is awesome!</h2>];
ReactDOM.render(<div>{arr}</div>, document.getElementById("example"));
```

## Demo03: 组件

[Demo](https://istaotao.com/myreact/demo/03/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/03/index.html)

变量 HelloMsg 是一个组件类。模板插入 <HelloMsg /> 时，会自动生成 HelloMsg 的一个实例。所有组件类都必须有自己的 render 方法，用于输出组件。

```javascript
class HelloMsg extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
ReactDOM.render(
  <HelloMsg name="Dataozi" />,
  document.getElementById("example")
);
```

## Demo04: this.props.children

[Demo](https://istaotao.com/myreact/demo/04/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/04/index.html)

`this.props` 对象的属性与组件的属性一一对应，但是有一个例外，就是 `this.props.children` 属性。

ps: 注意大小写 `React.Children`、`React.Component`

```javascript
class NotesList extends React.Component {
  render() {
    return (
      <ol>
        {React.Children.map(this.props.children, function(child) {
          return <li>{child}</li>;
        })}
      </ol>
    );
  }
}
ReactDOM.render(
  <NotesList>
    <span>Hello</span>
    <span>World</span>
    <span>React</span>
  </NotesList>,
  document.getElementById("example")
);
```

## Demo05: PropTypes

[Demo](https://istaotao.com/myreact/demo/05/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/05/index.html)

- [使用 PropTypes 进行类型检查](https://react.docschina.org/docs/typechecking-with-proptypes.html)

React 内置了一些类型检查的功能。要在组件的 props 上进行类型检查，你只需配置特定的 propTypes 属性:

```javascript
var data = {
  tilte: "Hello",
  age: 19,
  isStudent: true
};
class MyTitle extends React.Component {
  static propTypes = {
    tilte: PropTypes.string,
    age: PropTypes.number,
    isStudent: PropTypes.bool
  };
  render() {
    return (
      <div>
        <h1>{this.props.data.tilte}</h1>
        <h2>{this.props.data.age}</h2>
        <h3>{this.props.data.isStudent ? "Yes" : "No"}</h3>
      </div>
    );
  }
}
ReactDOM.render(<MyTitle data={data} />, document.getElementById("root"));
```

还可以通过配置特定的 defaultProps 属性来定义 props 的默认值：

```javascript
class DefaultTitle extends React.Component {
  render() {
    return <h4>{this.props.title}</h4>;
  }
}
//指定 props 的默认值：
DefaultTitle.defaultProps = {
  title: "Hello React!"
};

ReactDOM.render(<DefaultTitle />, document.getElementById("root2"));
```

## Demo06: 获取真实的 DOM 节点

[Demo](https://istaotao.com/myreact/demo/06/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/06/index.html)

- [Refs and the DOM](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)

Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素。

- 创建 Refs: Refs 是由`React.createRef()`创建的，并通过 ref 属性附加到 React 元素（比如 input）
- 访问 Refs: 当 ref 被传递给 render 中的元素时，对该节点的引用可以在 ref 的 current 属性中被访问，`this.myTextFocus.current.focus();`

**_你不能在函数组件上使用 ref 属性，因为它们没有实例_**

组件 MyComponent 的子节点有一个文本输入框，用于获取用户的输入。这时就必须获取真实的 DOM 节点，虚拟 DOM 是拿不到用户输入的。

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    // 创建一个 ref 来存储 myTextFocus 的 DOM 元素
    this.myTextFocus = React.createRef();
    this.handerClick = this.handerClick.bind(this);
  }
  handerClick() {
    // 直接使用原生 API 使 text 输入框获得焦点
    // 通过 "current" 来访问 DOM 节点
    this.myTextFocus.current.focus();
  }
  render() {
    // 告诉 React 我们想把 <input> ref 关联到
    // 构造器里创建的 `myTextFocus` 上
    return (
      <div>
        <input type="text" ref={this.myTextFocus} />
        <input type="button" value="点击聚焦" onClick={this.handerClick} />
      </div>
    );
  }
}
ReactDOM.render(<MyComponent />, document.getElementById("root"));
```

## Demo07: this.state

[Demo](https://istaotao.com/myreact/demo/07/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/07/index.html)

- [State & 生命周期](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html)

学习如何封装真正可复用的 Clock 组件。它将设置自己的计时器并每秒更新一次。

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() }; //为 this.state 赋初值
  }

  componentDidMount() {
    // Clock初次被渲染到DOM时，为其挂载一个计时器
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    // Clock被删除时，卸载其计时器
    clearInterval(this.timerID);
  }

  tick() {
    // 使用 this.setState() 来时刻更新组件 state
    this.setState({ date: new Date() });
  }

  render() {
    return (
      <div>
        <h1>Hello, React!</h1>
        <h2>现在是北京时间：{this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));
```

## Demo08: 表单

[Demo](https://istaotao.com/myreact/demo/08/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/08/index.html)

- [表单](https://zh-hans.reactjs.org/docs/forms.html)

受控组件：渲染表单的 React 组件还控制着用户输入过程中表单发生的操作，被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

即：表单数据是由 React 组件来管理的。

```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 唯一数据源
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({
      value: event.target.value // 显示的值将随着用户输入而更新
    });
  }
  handleSubmit(event) {
    if (this.state.value) {
      alert("接受到的name值是：" + this.state.value);
    }
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input type="submit" value="提交" />
      </form>
    );
  }
}

ReactDOM.render(<NameForm />, document.getElementById("root"));
```

[非受控组件](https://zh-hans.reactjs.org/docs/uncontrolled-components.html)：表单数据将交由 DOM 节点来处理，即使用 ref 来从 DOM 节点中获取表单数据

[Demo](https://istaotao.com/myreact/demo/08-1/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/08-1/index.html)

```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    alert("接受到的name值是：" + this.input.current.value);
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref={this.input} />
        <input type="submit" value="提交" />
      </form>
    );
  }
}

ReactDOM.render(<NameForm />, document.getElementById("root"));
```

## Demo09: 组件的生命周期

[Demo](https://istaotao.com/myreact/demo/09/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/09/index.html)

- [组件的生命周期](https://zh-hans.reactjs.org/docs/react-component.html)
- [生命周期图谱速查表](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
- [React 的生命周期](https://www.yuque.com/ant-design/course/lifemethods) --- Ant Design 语雀

主要路线顺序：挂载 - 更新 - 卸载 - 错误处理

**挂载**

当组件实例被创建并插入 DOM 中时，其生命周期调用如下：

- consctructor() --- React 组件的构造函数，不初始化 state 或不进行方法绑定，则不需要
- static getDerivedStateFromProps() --- 不常用
- render() --- 唯一必须实现的方法，并且应该是纯函数
- componentDidMount() --- 依赖于 DOM 节点的初始化应该在这里

**更新**

当组件的 props 或 state 发生变化时，会触发更新：

- static getDerivedStateFromProps()
- shouldComponentUpdate()
- render()
- getSnapshotBeforeUpdate() --- 不常用
- componentDidUpdate() --- 在更新后会被立即调用

**卸载**

当组件从 DOM 中移除时：

- componentWillUnmount() --- 会在组件卸载及销毁之前直接调用

**错误处理**

当渲染过程，生命周期，或子组件的构造函数中抛出错误时：

- static getDerivedStateFromError()
- componentDidCatch()

过期的生命周期方法：

- UNSAFE_componentWillMount() --- 挂载前调用，目前使用 constructor()初始化 state
- UNSAFE_componentWillReceiveProps()
- UNSAFE_componentWillUpdate()

```javascript
class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSize: 12,
      opacity: 0.01
    };
  }
  componentDidMount() {
    this.timerID = setInterval(() => {
      let opacity = this.state.opacity;
      let fontSize = this.state.fontSize;
      opacity += 0.02;
      fontSize += 1;
      if (opacity >= 1) {
        opacity = 0.01;
      }
      if (fontSize >= 63) {
        fontSize = 12;
      }
      this.setState({
        fontSize,
        opacity
      });
    }, 100);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render() {
    return (
      <h1
        style={{ opacity: this.state.opacity, fontSize: this.state.fontSize }}
      >
        Hello, {this.props.name}
      </h1>
    );
  }
}
ReactDOM.render(<Hello name="React" />, document.getElementById("root"));
```

## Demo10: 使用 Promise 获取 Github 的数据

[Demo](https://istaotao.com/myreact/demo/10/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/10/index.html)

```javascript
ReactDOM.render(
  <ReportList
    promise={$.getJSON(
      "https://api.github.com/search/repositories?q=javascript&sort=stars"
    )}
  />,
  document.getElementById("root")
);
```

从 Github 的 API 抓取数据，然后将 Promise 对象作为属性，传给 ReportList 组件。

如果 Promise 对象正在抓取数据（pending 状态），组件显示"loading..."；

如果 Promise 对象报错（rejected 状态），组件显示报错信息；

如果 Promise 对象抓取数据成功（fulfilled 状态），组件显示获取的数据。

[在这里查看完整 Demo](https://istaotao.com/myreact/demo/10/)/[源码](https://github.com/yangtao2o/myreact/blob/master/demo/10/index.html) --- 谷歌浏览器有时候会报跨域的问题，可以使用火狐等浏览器试看

## Demo11: Todo List

[Demo](https://istaotao.com/myreact/demo/11/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/11/index.html)

- [React todo list](https://codepen.io/marekdano/pen/bVNYpq)

主要练习使用 `props` 和 `state`，使用 state 保存现有的待办事项列表及用户的一些操作（删除、完成）等。

```javascript
class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.doneItem = this.doneItem.bind(this);
  }

  addItem(item) {
    const newItem = {
      text: item.text,
      id: Date.now(),
      done: false
    };
    this.setState({
      items: this.state.items.concat(newItem)
    });
  }

  deleteItem(index) {
    this.state.items.splice(index, 1);
    this.setState({
      items: this.state.items
    });
  }

  doneItem(index) {
    const items = this.state.items;
    const todo = items[index];
    items.splice(index, 1);
    todo.done = !todo.done;
    todo.done ? items.unshift(todo) : items.push(todo);
    this.setState({ items });
  }

  render() {
    return (
      <div className="container">
        <h1>TODO</h1>
        <TodoList
          items={this.state.items}
          deleteClick={this.deleteItem}
          doneClick={this.doneItem}
        />
        <TodoForm addItem={this.addItem} items={this.state.items} />
      </div>
    );
  }
}
```

## Demo12: 井字棋（Tic Tac Toe）

[Demo](https://istaotao.com/myreact/demo/12/) / [Source](https://github.com/yangtao2o/myreact/blob/master/demo/12/index.html)

- [Tic Tac Toe](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)
- [井字棋游戏教程文档](https://zh-hans.reactjs.org/tutorial/tutorial.html#inspecting-the-starter-code)
- [React 的井字过三关](https://www.bbsmax.com/A/8Bz8kVodxg/)

### tic-tac-toe(三连棋)游戏的功能

- 能够判定玩家何时获胜
- 能够记录游戏进程
- 允许玩家查看游戏的历史记录，也可以查看任意一个历史版本的游戏棋盘状态
- 在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)
- 在历史记录列表中加粗显示当前选择的项目
- 当无人获胜时，显示一个平局的消息
- x 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）
- x 添加一个可以升序或降序显示历史记录的按钮
- x 每当有人获胜时，高亮显示连成一线的 3 颗棋子

## 学习资料

- [React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html) --- 阮一峰
- [react-demos](https://github.com/ruanyf/react-demos)
