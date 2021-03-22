# events（事件触发器）

## Node.js 事件循环

Node.js 是单进程单线程应用程序，但是因为 V8 引擎提供的异步执行回调接口，通过这些接口可以处理大量的并发，所以性能非常高。

Node.js 几乎每一个 API 都是支持回调函数的。

Node.js 基本上所有的事件机制都是用设计模式中观察者模式实现。

Node.js 单线程类似进入一个while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数.

`EventEmitter` 提供了多个属性，如` on `和` emit `。

`on` 函数用于绑定事件函数，`emit` 属性用于触发一个事件。

```js
const events = require('events')
// 创建 eventEmitter 对象
const eventEmitter = new events.EventEmitter()

// 绑定 connection 事件处理程序
eventEmitter.on('connection', () => {
  console.log('建立连接...')
  // 触发 dataReceived 事件
  eventEmitter.emit('dataReceived')
})

// 绑定 dataReceived 事件处理程序
eventEmitter.on('dataReceived', () => {
  console.log('接收数据中...')
})

// 触发 connection 事件
eventEmitter.emit('connection')
console.log("数据接收完毕！");
```

```bash
➜ node 02-event.js
建立连接...
接收数据中...
数据接收完毕！
```

EventEmitter 类写法：

```js
const EventEmitter = require('events');
// class 继承
class MyEmitter extends EventEmitter {}
// 实例化
const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('触发事件');
});
myEmitter.emit('event');
```

## EventEmitter 类

Node.js 所有的异步 I/O 操作在完成时都会发送一个事件到事件队列。

Node.js 里面的许多对象都会分发事件：一个 `net.Server` 对象会在每次有新连接时触发一个事件， 一个 `fs.readStream` 对象会在文件被打开的时候触发一个事件。 所有这些产生事件的对象都是 `events.EventEmitter` 的实例。

EventEmitter 类由 events 模块定义：

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
```

`EventEmitter` 的每个事件由一个事件名和若干个参数组成，事件名是一个字符串，通常表达一定的语义。

对于每个事件，`EventEmitter` 支持 若干个事件监听器。

当事件触发时，注册到这个事件的事件监听器被依次调用，事件参数作为回调函数参数传递。

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// 第一个监听器。
myEmitter.on('event', function firstListener() {
  console.log('第一个监听器');
});
// 第二个监听器。
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`第二个监听器中的事件有参数 ${arg1}、${arg2}`);
});
// 第三个监听器
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`第三个监听器中的事件有参数 ${parameters}`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);
```

myEmitter 为事件 event 注册了三个个事件监听器，然后触发 event 事件，输出：

```bash
第一个监听器
第二个监听器中的事件有参数 1、2
第三个监听器中的事件有参数 1, 2, 3, 4, 5
```

`EventEmitter` 提供了多个属性，初了绑定事件函数的` on `和触发事件函数的` emit `，还有如下一些属性：

* addListener(event, listener) 
为指定事件添加一个监听器到监听器数组的尾部，`emitter.on(eventName, listener)` 的别名。

*	once(event, listener) 
为指定事件注册一个单次监听器，即 监听器最多只会触发一次，触发后立刻解除该监听器

* removeListener(event, listener) 
移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器

* removeAllListeners([event]) 
移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器

* setMaxListeners(n)
默认情况下， EventEmitters 如果你添加的监听器超过 10 个就会输出警告信息。 setMaxListeners 函数用于提高监听器的默认限制的数量。

* listeners(event)
返回名为 eventName 的事件的监听器数组的副本

* on(event, listener)
为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数

* off(eventName, listener)
`removeListener()` 的别名

* emit(event, [arg1], [arg2], [...])
按监听器的顺序执行执行每个监听器，如果事件有注册监听返回 true，否则返回 false

* listenerCount(eventName)
返回正在监听的名为 eventName 的事件的监听器的数量

练习下：

```js
const EventEmitter = require('events')
const myEmitter = new EventEmitter()

const listener1 = () => {
  console.log('监听器1启动')
}
const listener2 = () => {
  console.log('监听器2启动')
}

myEmitter.on('event', listener1)
myEmitter.on('event', listener2)

let listeners = myEmitter.listenerCount('event')
console.log(`现在有${listeners}个监听器正在监听事件`)

myEmitter.emit('event')

myEmitter.off('event', listener1)
console.log('监听器1已被移除')

myEmitter.emit('event')

listeners = myEmitter.listenerCount('event')
console.log(`现在有 ${listeners} 个监听器正在监听事件`)

console.log('End!')
```

输出：

```bash
[nodemon] starting `node 04-event.js`
现在有2个监听器正在监听事件
监听器1启动
监听器2启动
监听器1已被移除
监听器2启动
现在有 1 个监听器正在监听事件
End!
```

## 错误事件

当 EventEmitter 实例出错时，应该触发 'error' 事件。 这些在 Node.js 中被视为特殊情况。

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('错误信息')); 
```

如果没有为 'error' 事件注册监听器，则当 'error' 事件触发时，会抛出错误、打印堆栈跟踪、并退出 Node.js 进程。

所以最佳实践是，应该始终为 'error' 事件注册监听器：

```js
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('错误信息');
});
myEmitter.emit('error', new Error('错误'));
// 打印: 错误信息
```

## Node 应用程序是如何工作的

创建一个 input.txt ,文件内容如：`www.runoob.com`

```js
const fs = require('fs')

// 阻塞
// 在文件读取完后才执行完程序
const getData = fs.readFileSync('test/input.txt')

console.log(getData.toString())
console.log('阻塞程序运行结束')

// 非阻塞
// 不需要等待文件读取完，这样就可以在读取文件时同时执行接下来的代码，大大提高了程序的性能
fs.readFile('test/input.txt', (err, data) => {
  if(err) {
    return console.error(err)
  }
  console.log(data.toString())
})

console.log('非阻塞程序运行结束')
```

如果没发生错误，readFileSync 或者 readFile 跳过 err 对象的输出，文件内容就通过回调函数输出：

```bash
www.runoob.com
阻塞程序运行结束
非阻塞程序运行结束
www.runoob.com
```

接下来我们删除 input.txt 文件，执行结果如下所示：

```bash
{ [Error: ENOENT: no such file or directory, open 'input.txt'] errno: -2, code: 'ENOENT', syscall: 'open', path: 'input.txt' }
```

## 学习资料

* 菜鸟教程之 [Node.js 学习](https://www.runoob.com/nodejs/nodejs-event.html)
* 官方文档之 [events（事件触发器）](http://nodejs.cn/api/events.html)
