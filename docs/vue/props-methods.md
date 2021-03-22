# Vue 组件间通信有哪几种方式

## 前言

> Vue 组件间通信主要有 3 类通信：父子组件通信、隔代组件通信、兄弟组件通信。[Github 地址](https://github.com/yangtao2o/learn/issues/97)

## `props/$emit`父子组件通信

父组件向子组件传递数据是通过 `props`，子组件向父组件传值是通过 `events（$emit）`（事件形式）。

### 父组件向子组件传值

父组件 Parent：

```html
<template>
  <div>
    <child :msg="message"></child>
  </div>
</template>

<script>
  import Child from "./Child";

  export default {
    name: "parent",
    components: {
      Child
    },
    data: () => ({
      message: "父组件信息"
    })
  };
</script>
```

子组件 Child：

```html
<template>
  <div>我是子组件，接收：{{ msg }}</div>
</template>

<script>
  export default {
    name: "child",
    props: ["msg"]
  };
</script>
```

父组件 Parent，通过 msg 向子组件 Child 信息，Child 通过 props 接收 msg，并渲染到页面上。

```html
我是子组件，接收：父组件信息
```

### 子组件向父组件传值

子组件向父组件传值是通过 `events（$emit）`（事件形式）。

子组件 Child：

```html
<template>
  <button @click="clickHandle">点击</button>
</template>

<script>
  export default {
    name: "child",
    methods: {
      clickHandle() {
        this.$emit("myclick", "子组件数据");
      }
    }
  };
</script>
```

父组件 Parent：

```html
<template>
  <div>
    <div>这是父组件，接收：{{ message }}</div>
    <child @myclick="getChildData"></child>
  </div>
</template>

<script>
  import Child from "./Child";

  export default {
    name: "parent",
    components: {
      Child
    },
    data: () => ({
      message: ""
    }),
    methods: {
      getChildData(data) {
        this.message = data;
      }
    }
  };
</script>
```

子组件 Child 通过`this.$emit("myclick", "子组件数据");`，绑定一个自定义事件 myclick，并赋值要传递的数据。

父组件监听自定义事件 myclick，点击则触发子组件`this.$emit("myclick", "子组件数据");`，获取子组件的数据，并同时返回给父组件的 getChildData 方法。

点击触发，最终得到：`这是父组件，接收：子组件数据`。

**注意**：自定义事件名 myclick 始终使用 kebab-case 的事件名。

## `ref` 与 `$parent/$children`父子组件通信

特点：

- `ref`：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例
- `$parent` 属性可以用来从一个子组件访问父组件的实例。它提供了一种机会，可以在后期随时触达父级组件，以替代将数据以 prop 的方式传入子组件的方式。
- 这两种都是直接得到组件实例，使用后可以直接调用组件的方法或访问数据
- 无法在跨级或兄弟间通信

### ref 访问子组件实例或子元素

ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 \$refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例：

```html
<!-- `vm.$refs.p` will be the DOM node -->
<p ref="p">hello</p>

<!-- `vm.$refs.child` will be the child component instance -->
<child-component ref="child"></child-component>
```

父组件 Parent：

```html
<template>
  <div>
    <button @click="sayHi">打招呼</button><br />
    <button @click="getChildMsg">点击获取子组件信息</button>
    <button @click="getChildValue">点击获取子组件 input 值</button>
    <child ref="usernameInput"></child>
    <p>{{ message }}</p>
  </div>
</template>

<script>
  import Child from "./Child";

  export default {
    name: "parent",
    components: {
      Child
    },
    data: () => ({
      message: ""
    }),
    methods: {
      // 如果用在子组件上，引用就指向组件实例
      getChildMsg() {
        this.message = this.$refs.usernameInput.msg;
      },
      sayHi() {
        this.message = this.$refs.usernameInput.sayHello();
      },
      getChildValue() {
        this.message = this.$refs.usernameInput.$refs.input.value;
      }
    }
  };
</script>
```

子组件：

```html
<template>
  <div>
    子组件：<input
      @focus="focusHandle"
      type="text"
      ref="input"
      value="hello msg"
    />
  </div>
</template>

<script>
  export default {
    name: "child",
    data: () => ({
      msg: "子组件信息"
    }),
    methods: {
      // 用来从父级组件聚焦输入框
      focusHandle() {
        // 如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素
        this.$refs.input.focus();
      },
      sayHello() {
        return "Hello Vue!";
      }
    }
  };
</script>
```

### `$parent` 和 `$children`

父组件 Parent：

```html
<template>
  <div>
    <child></child>
  </div>
</template>

<script>
  import Child from "./Child";

  export default {
    name: "parent",
    components: {
      Child
    },
    data: () => ({
      message: "Parent say Hi"
    }),
    mounted() {
      // 注意 $children 返回的是 Array
      console.log(this.$children[0].msg); // Child say Hello
    }
  };
</script>
```

子组件 Child：

```html
<template>
  <div>Hello Boy</div>
</template>

<script>
  export default {
    name: "child",
    data: () => ({
      msg: "Child say Hello"
    }),
    mounted() {
      console.log(this.$parent.message); // Parent say Hi
    }
  };
</script>
```

节制地使用 `$parent` 和 `$children` - 它们的主要目的是作为访问组件的应急方法。更推荐用 props 和 events 实现父子组件通信。

## `$attrs/$listeners`隔代组件通信

Vue2.4 提供了$attrs , $listeners 来传递数据与事件，跨级组件之间的通讯变得更简单。

简单来说：`$attrs`与`$listeners` 是两个对象，`$attrs` 里存放的是父组件中绑定的非 Props 属性，`$listeners`里存放的是父组件中绑定的非原生事件。

- `$attrs`：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外 )，并且可以通过 `v-bind="$attrs"` 传入内部组件。通常配合 inheritAttrs 选项一起使用。

- `$listeners`：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 `v-on="$listeners"` 传入内部组件。

例子：跨级通信

Parent：

```html
<template>
  <div>
    <child-a
      :name="name"
      :age="age"
      :job="job"
      title="This is a title"
      @click="postData"
    ></child-a>
  </div>
</template>

<script>
  import ChildA from "./ChildA";

  export default {
    name: "parent",
    components: {
      ChildA
    },
    data: () => ({
      name: "tao",
      age: "28",
      job: "worker"
    }),
    methods: {
      postData() {
        return "hello";
      }
    }
  };
</script>
```

ChildA：通过`v-bind="$attrs"`或`v-on="$listeners"`进行传递

```html
<template>
  <div>
    <child-b v-bind="$attrs" v-on="$listeners"></child-b>
  </div>
</template>

<script>
  import ChildB from "./ChildB";
  export default {
    name: "child-a",
    components: {
      ChildB
    },
    created() {
      console.log(this.$attrs);
      // {name: "tao", age: "28", job: "worker", title: "This is a title"}
      console.log(this.$listeners.click()); // hello
    }
  };
</script>
```

ChildB：

```html
<template>
  <div>
    <p>B-listeners: {{ this.$listeners.click() }}</p>
  </div>
</template>
<script>
  export default {
    props: ["name"], // name 作为props属性绑定
    inheritAttrs: false, // 可以关闭自动挂载到组件根元素上的没有在props声明的属性
    created() {
      console.log(this.$attrs);
      // {age: "28", job: "worker", title: "This is a title"}
      console.log(this.$listeners.click()); // hello
    }
  };
</script>
```

## `provide/inject`隔代组件通信

祖先组件中通过 provider 来提供变量，然后在子孙组件中通过 inject 来注入变量。

provide / inject 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。

```js
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: "bar"
  }
  // ...
};

// 子组件注入 'foo'
var Child = {
  inject: ["foo"],
  created() {
    console.log(this.foo); // => "bar"
  }
  // ...
};
```

provide 和 inject 主要在开发高阶插件/组件库时使用。并不推荐用于普通应用程序代码中。

### provide 与 inject 怎么实现数据响应式

provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。--- Vue 官方文档

一般来说，有两种办法：

provide 祖先组件的实例，然后在子孙组件中注入依赖，这样就可以在子孙组件中直接修改祖先组件的实例的属性，不过这种方法有个缺点就是这个实例上挂载很多没有必要的东西比如 props，methods。

```js
// 父级组件
var Provider = {
  provide() {
    return {
      theme: this // 提供实例
    };
  }
};

// 子组件注入
var Child = {
  inject: {
    theme: {
      default: () => ({})
    }
  },
  created() {
    console.log(this.theme);
  }
  // ...
};
```

使用 2.6 最新 API **Vue.observable** 优化响应式 provide(推荐)。

**用法**：让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。返回的对象可以直接用于渲染函数和计算属性内，并且会在发生改变时触发相应的更新。

```js
// 父级组件
var Provider = {
  provide() {
    this.theme = Vue.observable({
      color: this.color
    });
    return {
      theme: this.theme
    };
  },
  methods: {
    changeColor() {
      this.theme.color = this.theme.color === "blue" ? "red" : "blue";
    }
  }
};
// 子组件注入
var Child = {
  inject: {
    theme: {
      default: () => ({})
    }
  },
  created() {
    console.log(this.theme);
  }
  // ...
};
```

## `$emit/$on`父子、隔代、兄弟组件通信

`Bus`，通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件，巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级。

**注意**：记得销毁自定义事件，否则容易造成内存泄露。

### 基本使用

具体实现方式：

```js
var Bus = new Vue();

Bus.$emit("add-todo", { text: this.newTodoText });
Bus.$on("add-todo", this.addTodo);
Bus.$off("add-todo", this.addTodo);
```

使用 [vue-bus](https://github.com/yangmingshan/vue-bus)：`npm install vue-bus --save`

```js
import Vue from "vue";
import VueBus from "vue-bus";

Vue.use(VueBus);
```

Listen and clean

```js
// ...
created() {
  this.$bus.on('add-todo', this.addTodo);
  this.$bus.once('once', () => console.log('This listener will only fire once'));
},
beforeDestroy() {
  this.$bus.off('add-todo', this.addTodo);
},
methods: {
  addTodo(newTodo) {
    this.todos.push(newTodo);
  }
}
```

Trigger

```js
// ...
methods: {
  addTodo() {
    this.$bus.emit('add-todo', { text: this.newTodoText });
    this.$bus.emit('once');
    this.newTodoText = '';
  }
}
```

### 举个栗子

假设兄弟组件有三个，分别是 A、B、C 组件，A 或 B 组件的向 C 组件发送数据。

组件 A：

```html
<template>
  <div>
    <div>{{name}}</div>
    <button @click="postData">发给C</button>
  </div>
</template>

<script>
  export default {
    name: "child-a",
    data: () => ({
      name: "AAA"
    }),
    methods: {
      postData() {
        this.$bus.emit("child-a", this.name);
      }
    }
  };
</script>
```

组件 B：

```html
<template>
  <div>
    <div>{{name}}</div>
    <button @click="postData">发给C</button>
  </div>
</template>

<script>
  export default {
    name: "child-b",
    data: () => ({
      name: "BBB"
    }),
    methods: {
      postData() {
        this.$bus.emit("child-b", this.name);
      }
    }
  };
</script>
```

组件 C：

```html
<template>
  <div>
    <div>{{ name.join(",") }}</div>
  </div>
</template>

<script>
  export default {
    name: "child-c",
    data: () => ({
      name: ["CCC"]
    }),
    created() {
      this.$bus.on("child-a", this.getData);
      this.$bus.on("child-b", this.getData);
    },
    beforeDestroy() {
      this.$bus.off("child-a", this.getData);
      this.$bus.off("child-b", this.getData);
    },
    methods: {
      getData(data) {
        this.name.push(data);
      }
    }
  };
</script>
```

`this.$bus.on` 监听了自定义事件 child-a 和 child-b，因为有时不确定何时会触发事件，一般会在 created 钩子中来监听，然后 beforeDestroy 钩子中通过`this.$bus.off`注销自定义事件。

### vue-bus 实现源码

最后看一下 [vue-bus](https://github.com/yangmingshan/vue-bus) 的源码：

```js
function VueBus(Vue) {
  var bus = new Vue();

  Object.defineProperties(bus, {
    on: {
      get: function get() {
        return this.$on.bind(this);
      }
    },
    once: {
      get: function get() {
        return this.$once.bind(this);
      }
    },
    off: {
      get: function get() {
        return this.$off.bind(this);
      }
    },
    emit: {
      get: function get() {
        return this.$emit.bind(this);
      }
    }
  });

  Object.defineProperty(Vue, "bus", {
    get: function get() {
      return bus;
    }
  });

  Object.defineProperty(Vue.prototype, "$bus", {
    get: function get() {
      return bus;
    }
  });
}
```

## Vuex 父子、隔代、兄弟组件通信

### Vuex 基本原理

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。

每一个 Vuex 应用的**核心**就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

Vuex 的**状态存储**是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

改变 store 中的状态的**唯一途径**就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

Mutation 同时提供了订阅者模式供外部插件调用获取 State 数据的更新。

而当所有异步操作(常见于调用后端接口异步获取更新数据)或批量的同步操作需要走 Action，但 Action 也是无法直接修改 State 的，还是需要通过 Mutation 来修改 State 的数据。最后，根据 State 的变化，渲染到视图上。

### 举个例子

index.js:

```js
import Vue from "vue";
import Vuex from "vuex";
import { INCREMENT } from "./mutations"; // export const INCREMENT = "INCREMENT";

Vue.use(Vuex);

export default new Vuex.Store({
  // 初始 state 对象
  state: {
    count: 0,
    todos: [
      { id: 1, text: "11111", done: true },
      { id: 2, text: "2222", done: false }
    ]
  },
  // Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
    }
  },
  // 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  // 当触发一个 mutation 时，需要以相应的 type 调用 store.commit 方法，调用此函数
  // mutation 必须同步执行
  mutations: {
    incrementBy(state) {
      state.count++;
    },
    [INCREMENT](state, payload) {
      state.count += payload.amount;
    }
  },
  // Action 类似于 mutation，不同在于：
  // - Action 提交的是 mutation，而不是直接变更状态
  // - Action 可以包含任意异步操作
  actions: {
    incrementAsnyc({ commit }) {
      setTimeout(() => {
        commit("incrementBy");
      }, 1000);
    }
  }
});
```

Counter.vue:

```html
<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="increment">Add1</button>
    <button @click="add">Add2</button>
    <p>{{ doneTodos }}</p>
  </div>
</template>

<script>
  import store from "./../store/index";
  import { mapState, mapGetters, mapActions } from "vuex";

  export default {
    name: "Counter",
    computed: {
      // 由于 Vuex 的状态存储是响应式的，
      // 从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态
      // count () {
      //   return this.$store.state.count
      // },
      ...mapState({
        count: state => state.count
      }),
      // doneTodos() {
      //   return this.$store.getters.doneTodos;
      // }
      ...mapGetters(["doneTodos"])
    },
    methods: {
      increment() {
        // this.$store.commit('increment', {
        //   amount: 5
        // })
        // 对象风格
        // store.commit({
        //   type: 'INCREMENT',
        //   amount: 5
        // })

        // actions
        store.dispatch("incrementAsnyc");
      },
      ...mapActions({
        add: "incrementAsnyc"
      })
    }
  };
</script>
```

### 各模块在流程中的功能

![vuex](https://user-gold-cdn.xitu.io/2020/4/7/17153cee622785f3?w=701&h=551&f=png&s=8112)

**Vue Components**：Vue 组件。HTML 页面上，负责接收用户操作等交互行为，执行 dispatch 方法触发对应 action 进行回应。

**dispatch**：操作行为触发方法，是唯一能执行 action 的方法。

**actions**：操作行为处理模块,由组件中的`$store.dispatch('action name', data1)`来触发。然后由`commit()`来触发 mutation 的调用 , 间接更新 state。负责处理 Vue Components 接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。

向后台 API 请求的操作就在这个模块中进行，包括触发其他 action 以及提交 mutation 的操作。该模块提供了 Promise 的封装，以支持 action 的链式触发。

**commit**：状态改变提交操作方法。对 mutation 进行提交，是唯一能执行 mutation 的方法。

**mutations**：状态改变操作方法，由 actions 中的`commit('mutation name')`来触发。是 Vuex 修改 state 的唯一推荐方法。

该方法只能进行同步操作，且方法名只能全局唯一。操作之中会有一些 hook 暴露出来，以进行 state 的监控等。

**state**：页面状态管理容器对象。集中存储 Vue components 中 data 对象的零散数据，全局唯一，以进行统一的状态管理。

页面显示所需的数据从该对象中进行读取，利用 Vue 的细粒度数据响应机制来进行高效的状态更新。

**getters**：state 对象读取方法。Getter 会暴露为 store.getters 对象，你可以以属性的形式访问这些值。

## 学习资料

- [Github 地址](https://github.com/yangtao2o/learn/issues/97)
- [Vue 组件间通信六种方式（完整版）](https://juejin.im/post/5cde0b43f265da03867e78d3#heading-17)
- [30 道 Vue 面试题，内含详细讲解（涵盖入门到精通，自测 Vue 掌握程度）](https://juejin.im/post/5d59f2a451882549be53b170)
