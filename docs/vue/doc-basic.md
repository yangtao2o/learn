# Vue 基础理论

## Vue 的单向数据流

所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。

这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。

子组件想修改时，只能**通过 `$emit` 派发一个自定义事件**，父组件接收到后，由父组件修改。

有两种常见的试图改变一个 prop 的情形 :

prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。 在这种情况下，最好定义一个本地的 data 属性并将这个 prop 用作其初始值：

```js
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
```

prop 以一种原始的值传入且需要进行转换。 在这种情况下，最好使用这个 prop 的值来定义一个计算属性

```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

## SPA 优缺点是什么

**SPA（ single-page application ）** 仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。

一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。

### 优点

- **用户体验好、快**，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
- 基于上面一点，**SPA 相对对服务器压力小**；
- **前后端职责分离，架构清晰**，前端进行交互逻辑，后端负责数据处理；

### 缺点

- **初次加载耗时多**：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
- **前进后退路由管理**：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
- **SEO 难度较大**：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。

## Class 与 Style 如何动态绑定

Class 可以通过对象语法和数组语法进行动态绑定：

```js
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>

data: {
  isActive: true,
  hasError: false
}
```

Style 也可以通过对象语法和数组语法进行动态绑定：

```js
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<div v-bind:style="[styleColor, styleSize]"></div>

data: {
  activeColor: 'red',
  fontSize: 30
  styleColor: {
    color: 'red'
  },
  styleSize:{
    fontSize:'23px'
  }
}
```

## Vue 生命周期

Vue 实例有一个完整的生命周期：

1. 开始创建
1. 初始化数据
1. 编译模版
1. 挂载 Dom -> 渲染
1. 更新 -> 渲染
1. 卸载

这一系列过程，我们称这是 Vue 的生命周期。

![Vue Lifecycle](https://cn.vuejs.org/images/lifecycle.png)

### beforeCreate

new Vue()之后触发的第一个钩子，在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问。

### created

在实例创建完成后发生，当前阶段已经完成了数据观测，也就是可以使用数据，更改数据，在这里更改数据不会触发 updated 函数。可以做一些初始数据的获取，在当前阶段无法与 Dom 进行交互，如果非要想，可以通过 `vm.$nextTick` 来访问 Dom。

### beforeMounted

发生在挂载之前，在这之前 template 模板已导入渲染函数编译。而当前阶段虚拟 Dom 已经创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发 updated。

### mounted

在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点，使用 `$ref` 属性对 Dom 进行操作。

### beforeUpdate

发生在更新之前，也就是响应式数据发生更新，虚拟 dom 重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染。

### updated

发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新。

### beforeDestroy

发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器。

### destroyed

发生在实例销毁之后，这个时候只剩下了 dom 空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁。

### activated

keep-alive 组件激活时调用，该钩子在服务器端渲染期间不被调用。

### deactivated

keep-alive 组件停用时调用，该钩子在服务器端渲染期间不被调用。

### errorCaptured

当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

你可以在此钩子中修改组件的状态。因此在模板或渲染函数中设置其它内容的短路条件非常重要，它可以防止当一个错误被捕获时该组件进入一个无限的渲染循环。

### 注意点

在使用生命周期时有几点注意事项需要我们牢记。

1. 除了 beforeCreate 和 created 钩子之外，其他钩子均在服务器端渲染期间不被调用，所以接口请求一般放在 mounted 中，但是服务端渲染需要放到 created 中。
2. 上文曾提到过，在 updated 的时候千万不要去修改 data 里面赋值的数据，否则会导致死循环。
3. Vue 的所有生命周期函数都是自动绑定到 this 的上下文上。所以，你这里使用箭头函数的话，就会出现 this 指向的父级作用域，就会报错。

### 学习资料

- [从源码解读 Vue 生命周期，让面试官对你刮目相看](https://juejin.im/post/5d1b464a51882579d824af5b)
- [「面试题」20+Vue 面试题整理 🔥(持续更新)](https://juejin.im/post/5e649e3e5188252c06113021)

## Vue 组件生命周期调用顺序

- 组件的调用顺序都是 **先父后子**，渲染完成的顺序是 **先子后父**。
- 组件的销毁操作是 **先父后子**，销毁完成的顺序是 **先子后父**。

### 加载渲染过程

1. 父 beforeCreate
1. 父 created
1. 父 beforeMount
1. 子 beforeCreate
1. 子 created
1. 子 beforeMount
1. 子 mounted
1. 父 mounted

### 子组件更新过程

1. 父 beforeUpdate
1. 子 beforeUpdate
1. 子 updated
1. 父 updated

### 父组件更新过程

1. 父 beforeUpdate
1. 父 updated

### 销毁过程

1. 父 beforeDestroy
1. 子 beforeDestroy
1. 子 destroyed
1. 父 destroyed

## 在哪个生命周期内调用异步请求

可以在钩子函数 **created、beforeMount、mounted** 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

但推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面  loading 时间；
- **ssr  不支持 beforeMount 、mounted 钩子函数**，所以放在 created 中有助于一致性；

## 在什么阶段才能访问操作 DOM

在**钩子函数 mounted** 被调用前，Vue 已经将编译好的模板挂载到页面上。

所以在 mounted 中可以访问操作 DOM。

## 父组件可以监听到子组件的生命周期吗

比如有父组件 Parent 和子组件 Child，如果父组件监听到子组件挂载 mounted 就做一些逻辑处理，可以通过以下写法实现：

```js
// Parent.vue
<Child @mounted="doSomething"/>

// Child.vue
mounted() {
  this.$emit("mounted");
}
```

以上需要手动通过 \$emit 触发父组件的事件，更简单的方式可以在父组件引用子组件时通过 @hook 来监听即可，如下所示：

```js
//  Parent.vue
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},

//  Child.vue
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},

// 以上输出顺序为：
// 子组件触发 mounted 钩子函数 ...
// 父组件监听到 mounted 钩子函数 ...
```

## Vue 组件间通信方式

### 父子通信 `props/$emit`

- 父向子传递数据是通过 `props`，子向父是通过 `events（$emit）`
- 通过`$parent/$children`也可以通信；`ref` 也可以访问组件实例
- `$attrs/$listeners`（信息转发）
- `provide/inject`（祖先组件传递信息给后代组件）

### 兄弟通信 `Bus`

- `vuex`
- `Bus`，通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级

**注意**：记得销毁自定义事件，否则容易造成内存泄露

### 跨级通信 `vuex`

- `vuex`（信息处理）
- `$attrs/$listeners`（信息转发）
- `provide/inject`（祖先组件传递信息给后代组件）

学习资料：[Vue 组件间通信六种方式（完整版）](https://juejin.im/post/5cde0b43f265da03867e78d3#heading-17)

## Computed 和 Watch

`Computed` 本质是一个具备缓存的 watcher，依赖的属性发生变化就会更新视图。
适用于计算比较消耗性能的计算场景。当表达式过于复杂时，在模板中放入过多逻辑会让模板难以维护，可以将复杂的逻辑放入计算属性中处理。

`Watch` 没有缓存性，更多的是观察的作用，可以监听某些数据执行回调。当我们需要深度监听对象中的属性时，可以打开 deep：true 选项，这样便会对对象中的每一项进行监听。这样会带来性能问题，优化的话可以使用字符串形式监听，如果没有写到组件中，不要忘记使用 unWatch 手动注销哦。

学习资料：

- [Vue 的计算属性真的会缓存吗？（保姆级教学，原理深入揭秘）](https://juejin.im/post/5e8fd7a3f265da47c35d7d29)
- [手把手带你实现一个最精简的响应式系统来学习 Vue 的 data、computed、watch 源码](https://juejin.im/post/5db6433b51882564912fc30f)

## 双向数据绑定 v-model

v-model 本质上不过是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

- text 和 textarea 元素使用 value 属性和 input 事件；
- checkbox 和 radio 使用 checked 属性和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。

```html
<input v-model="message" />
<!-- 相当于 -->
<input :value="message" @input="message = $event.target.value" />
```

所以，自定义组件 v-model 默认会利用名为 value 的 prop 和名为 input 的事件：

```js
// 父组件
<ChildA v-model="message" />
// 或者
<ChildA :value="message" @input="handle" />

// 子组件
<input type="text" @input="handle" />
// ...
props: ['value'],
methods: {
  handle(e) {
    this.$emit('input', e.target.value)
  }
}
```
