# Vue 高级特性

## 什么是 MVVM

**Model–View–ViewModel** （MVVM） 是一个软件架构设计模式，由微软 WPF 和 Silverlight 的架构师 Ken Cooper 和 Ted Peters 开发，是一种简化用户界面的事件驱动编程方式。由 John Gossman（同样也是 WPF 和 Silverlight 的架构师）于 2005 年在他的博客上发表。

MVVM 源自于经典的 Model–View–Controller（MVC）模式 ，MVVM 的出现促进了前端开发与后端业务逻辑的分离，极大地提高了前端开发效率。

MVVM 的核心是 ViewModel 层，它就像是一个中转站（value converter），负责转换 Model 中的数据对象来让数据变得更容易管理和使用，该层向上与视图层进行双向数据绑定，向下与 Model 层通过接口请求进行数据交互，起呈上启下作用。

### View 层

View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建。如：

```html
<div id="app">
  <p>{{message}}</p>
  <button v-on:click="showMessage()">Click me</button>
</div>
```

### Model 层

Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，对于前端来说就是后端提供的 api 接口。

### ViewModel 层

ViewModel 是由前端开发人员组织生成和维护的视图数据层。

在这一层，前端开发者对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。

需要注意的是 ViewModel 所封装出来的数据模型包括视图的**状态和行为**两部分，而 Model 层的数据模型是只包含状态的，比如页面的这一块展示什么，而页面加载进来时发生什么，点击这一块发生什么，这一块滚动时发生什么这些都属于视图行为（交互），视图状态和行为都封装在了 ViewModel 里。

这样的封装使得 ViewModel 可以完整地去描述 View 层。

```js
var app = new Vue({
  el: "#app",
  data: {
    // 用于描述视图状态
    message: "Hello Vue!",
  },
  methods: {
    // 用于描述视图行为
    showMessage() {
      let vm = this;
      alert(vm.message);
    },
  },
  created() {
    let vm = this;
    // Ajax 获取 Model 层的数据
    ajax({
      url: "/your/server/data/api",
      success(res) {
        vm.message = res;
      },
    });
  },
});
```

MVVM 框架实现了双向绑定，这样 ViewModel 的内容会实时展现在 View 层，前端开发者再也不必低效又麻烦地通过操纵 DOM 去更新视图，MVVM 框架已经把最脏最累的一块做好了，我们开发者只需要处理和维护 ViewModel，更新数据视图就会自动得到相应更新。

这样 View 层展现的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 层交互，这就完全解耦了 View 层和 Model 层，这个解耦是至关重要的，它是前后端分离方案实施的重要一环。

## 如何实现 MVVM 数据双向绑定

MVVM 数据双向绑定主要是指：数据变化更新视图，视图变化更新数据。

通过实现以下 4 个步骤，来实现数据的双向绑定：

1. 实现一个**监听器** Observer，用来劫持并监听所有属性，如果属性发生变化，就通知订阅者；
1. 实现一个**订阅器** Dep，用来收集订阅者，对监听器 Observer 和 订阅者 Watcher 进行统一管理；
1. 实现一个**订阅者** Watcher，可以收到属性的变化通知并执行相应的方法，从而更新视图；
1. 实现一个**解析器** Compile，可以解析每个节点的相关指令，对模板数据和订阅器进行初始化。

资料：[0 到 1 掌握：Vue 核心之数据双向绑定](https://juejin.im/post/5d421bcf6fb9a06af23853f1)

## nextTick

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 `Promise.then、MutationObserver 和 setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替。

但是如果你想基于更新后的 DOM 状态来做点什么，nextTick 就会有用武之地了。

`vm.$nextTick( [callback] )`将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。

- 异步渲染，待 DOM 渲染完成后再回调
- 页面渲染会将 data 进行整合，多次渲染只会发生一次

```js
// 修改数据
vm.msg = "Hello";
// DOM 还没有更新
Vue.nextTick(function() {
  // DOM 更新了
});

// 作为一个 Promise 使用
Vue.nextTick().then(function() {
  // DOM 更新了
});

// 实例
new Vue({
  // ...
  methods: {
    // ...
    example: function() {
      // 修改数据
      this.message = "changed";
      // DOM 还没有更新
      this.$nextTick(function() {
        // DOM 现在更新了
        // `this` 绑定到当前实例
        this.doSomethingElse();
      });
    },
  },
});
```

## slot 是什么

Vue 实现了一套内容分发的 API，将 `<slot>` 元素作为承载分发内容的出口。

- 具名插槽：`<slot>` 元素有一个特殊的 `attribute：name`，可以用来定义额外的插槽
- 作用域插槽：插槽内容能够访问子组件中的数据

`v-slot:header`也可以缩写：`#header`，而且`v-slot`指令只能与`template`绑定，一个不带 name 的 `<slot>` 出口会带有隐含的名字`“default”`。

```js
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

## keep-alive 组件有什么作用

如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。

对于 keep-alive 组件来说，它拥有两个独有的生命周期钩子函数，分别为 **activated** 和 **deactivated**。

用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

`<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 `<transition>` 相似，`<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

当组件在 `<keep-alive>` 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>

<!-- 多个条件判断的子组件 -->
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>

<!-- 和 `<transition>` 一起使用 -->
<transition>
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
</transition>
```

## Vue 如何异步加载组件

- 加载大组件
- 异步路由

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。

Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

当使用局部注册的时候，你也可以直接提供一个返回 Promise 的函数：

```js
new Vue({
  // ...
  components: {
    "my-component": () => import("./my-async-component"),
  },
});
```

## 混入 mixin

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

```js
// 定义一个混入对象
var myMixin = {
  created: function() {
    this.hello();
  },
  methods: {
    hello: function() {
      console.log("hello from mixin!");
    },
  },
};

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin],
});

var component = new Component(); // => "hello from mixin!"
```

选项合并：

- 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先
- 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用
- 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对

注意：`Vue.extend()` 也使用同样的策略进行合并。

## Vue 中的 key 有什么作用

key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速。

Vue 的 diff 过程可以概括为：oldCh 和 newCh 各有两个头尾的变量 oldStartIndex、oldEndIndex 和 newStartIndex、newEndIndex，它们会新节点和旧节点会进行两两对比。

即一共有 4 种比较方式：

- newStartIndex 和 oldStartIndex
- newEndIndex 和 oldEndIndex
- newStartIndex 和 oldEndIndex
- newEndIndex 和 oldStartIndex

如果以上 4 种比较都没匹配，如果设置了 key，就会用 key 再进行比较，在比较的过程中，遍历会往中间靠，一旦 StartIdx > EndIdx 表明 oldCh 和 newCh 至少有一个已经遍历完了，就会结束比较。

所以 Vue 中 key 的作用是：**key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速**。

- 更准确：因为带 key 就不是就地复用了，在 sameNode 函数  `a.key === b.key` 对比中可以避免就地复用的情况。所以会更加准确。
- 更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快。

源码如下：

```js
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}
```

## Vue 中的 key 为什么不能用 index

主要原因：

- 导致性能损耗
- 在删除子节点的场景下还会造成更严重的错误

用组件唯一的 id（一般由后端返回）作为它的 key，实在没有的情况下，可以在获取到列表的时候通过某种规则为它们创建一个 key，并保证这个 key 在组件整个生命周期中都保持稳定。

如果你的列表顺序会改变，别用 index 作为 key，和没写基本上没区别，因为不管你数组的顺序怎么颠倒，index 都是 0, 1, 2 这样排列，导致 Vue 会复用错误的旧子节点，做很多额外的工作。

千万别用随机数作为 key，不然旧节点会被全部删掉，新节点重新创建。

详细解读：[为什么 Vue 中不要用 index 作为 key？（diff 算法详解）](https://juejin.im/post/5e8694b75188257372503722)

## 虚拟 DOM 的优缺点

优点：

- **保证性能下限：** 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；
- **无需手动操作 DOM：** 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
- **跨平台：** 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

缺点:

- **无法进行极致优化**： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。

## 虚拟 DOM 实现原理

虚拟 DOM 的实现原理主要包括以下 3 部分：

- 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
- diff 算法 — 比较两棵虚拟 DOM 树的差异；
- pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

学习资料：[深入剖析：Vue 核心之虚拟 DOM](https://juejin.im/post/5d36cc575188257aea108a74)
