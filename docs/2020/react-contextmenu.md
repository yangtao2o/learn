# React 右键菜单组件方案调研

## 前言

基于 Ant Design 进行测试，涉及到的两个组件库分别是：

- [react-contexify](https://github.com/fkhadra/react-contexify)
- [react-contextmenu](https://github.com/vkbansal/react-contextmenu/)

## React Contexify

官方文档：[REACT-CONTEXIFY](https://fkhadra.github.io/react-contexify/)

### Getting Started

下载：

```sh
yarn add react-contexify
# or
npm install --save react-contexify
```

引入：

```js
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
```

### API

- Menu, Item 两者组成了右键菜单的整体内容
- Menu 可以通过 theme, anmation 设置主题和动画，还可以监听菜单显示、消失事件
- Submenu 子菜单栏
- Item 可监听点击事件

```js
<Menu
  id="menu_id"
  theme={theme.dark}
  animation={animation.zoom}
  onShown={() => console.log('SHOWN')}
  onHidden={() => console.log('HIDDEN')}
>
  <Item onClick={onClick}>Lorem</Item>
  <Item disabled>Disabled</Item>
  <Separator />
  <Submenu label="Foobar" arrow="&gt;">
    <Item onClick={onClick}>Foo</Item>
  </Submenu>
</Menu>
```

- MenuProvider 展示可右击区域，通过 id 与 Menu 绑定

```jsx
<MenuProvider id="menu_id" component="span" event="onClick">
  <MyComponent />
</MenuProvider>
```

- contextMenu 自定义可点击区域时使用，有 show 和 hideAll 两种方法

```jsx
const handleEvent = e => {
  e.preventDefault()
  contextMenu.show({
    id: 'menu_id',
    event: e,
    props: {
      foo: 'bar',
    },
  })
}

const App = () => (
  <div>
    <div onContextMenu={handleEvent}>Right click me...</div>
    <Menu />
  </div>
)
```

- Separator 分割线
- IconFont 在 Item 中添加 Icon
- theme 可选 dark, light
- animation 可选 zoom, pop, flip, fade

### Demo

```js
import React from 'react'
import { Button } from 'antd'
import { Menu, Item, Separator, Submenu, MenuProvider, contextMenu, IconFont, theme, animation } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'

const menuId = 'menuId'
const myMenuId = 'myMenuId'

// 禁止点击Item或者Submenu的方式
const isDisabled = ({ event, props }) => true

// 菜单点击事件
const onClick = ({ event, props }) => console.log(event, props)

const onClickMenu = ({ event, props }) => {
  alert(
    JSON.stringify(
      {
        x: event.clientX,
        msg: props.msg,
      },
      null,
      2
    )
  )
}

// 创建菜单内容
const MyAwesomeMenu = () => (
  <Menu
    id={menuId}
    theme={theme.dark}
    animation={animation.zoom}
    onShown={() => console.log('SHOWN')}
    onHidden={() => console.log('HIDDEN')}
  >
    <Item onClick={onClick}>Lorem</Item>
    <Item>
      <IconFont className="fa fa-trash" />
      Delete
    </Item>
    <Separator />
    <Item disabled>Dolor1</Item>
    <Item disabled={isDisabled}>Dolor2</Item>
    <Separator />
    <Submenu label="Foobar" arrow="&gt;">
      <Item onClick={onClick}>Foo</Item>
    </Submenu>
  </Menu>
)

const MyMenu = () => (
  <Menu id={myMenuId}>
    <Item onClick={onClickMenu}>Click Me</Item>
  </Menu>
)

// 自定义菜单内容
function handleEvent(e) {
  e.preventDefault()
  contextMenu.show({
    id: myMenuId,
    event: e,
    props: {
      msg: 'hello',
    },
  })
}

class ContextMenu extends React.Component {
  render() {
    return (
      <div>
        <MenuProvider id={menuId}>
          <Button type="primary" size="large">
            使用 MenuProvider
          </Button>
        </MenuProvider>
        <MyAwesomeMenu />
        <br />
        <Button onContextMenu={handleEvent} type="primary" size="large">
          未使用 MenuProvider
        </Button>
        <MyMenu />
      </div>
    )
  }
}

export default ContextMenu
```

## React Contextmenu

### Installation

Using npm

```sh
npm install --save react-contextmenu
```

Using yarn

```sh
yarn add react-contextmenu
```

### API

完整文档：[API](https://github.com/vkbansal/react-contextmenu/blob/master/docs/api.md)

The module exports the following:

- ContextMenu, Base Contextmenu Component.
- ContextMenuTrigger, Contextmenu Trigger Component.
- MenuItem, A Simple Component for menu items.
- SubMenu, A component for using submenus within the contextmenu.

### Usage

地址：[Usage](https://github.com/vkbansal/react-contextmenu/blob/master/docs/usage.md)

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

function handleClick(e, data) {
  console.log(data.foo)
}

function MyApp() {
  return (
    <div>
      <ContextMenuTrigger id="some_unique_identifier">
        <div className="well">Right click to see the menu</div>
      </ContextMenuTrigger>

      <ContextMenu id="some_unique_identifier">
        <MenuItem data={{ foo: 'bar' }} onClick={this.handleClick}>
          ContextMenu Item 1
        </MenuItem>
        <MenuItem data={{ foo: 'bar' }} onClick={this.handleClick}>
          ContextMenu Item 2
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{ foo: 'bar' }} onClick={this.handleClick}>
          ContextMenu Item 3
        </MenuItem>
      </ContextMenu>
    </div>
  )
}

ReactDOM.render(<MyApp myProp={12} />, document.getElementById('main'))
```

## 对比异同

- [react-contexify](https://github.com/fkhadra/react-contexify)
- [react-contextmenu](https://github.com/vkbansal/react-contextmenu/)

| 特性             | react-contexify         | react-contexmenu                       |
| :--------------- | :---------------------- | :------------------------------------- |
| 版本             | @4.1.1                  | @2.14.0                                |
| 大小             | 524 kB                  | 154 kB                                 |
| 周下载量         | 8,928                   | 44,355                                 |
| 文件数           | 83                      | 30                                     |
| Coverage         | 97%                     |                                        |
| Dependencies     | 2                       | 2                                      |
| Dev Dependencies | 37                      | 36                                     |
| Last publish     | a year ago              | 3 months ago                           |
| Issues           | 33 Open 71 Closed       | 1 Open 213 Closed                      |
| 更新版本数       | 32                      | 54                                     |
| 浏览器支持       | latest                  | FireFox38+ Chrome47+ Opera34+ Safari8+ |
| IE11+            | ✅                      | ✅                                     |
| 主题、动画、Icon | ✅                      | ❌                                     |
| 文档             | Demo 操作演示，API 文档 | API 文档，example 示例                 |
| API              | 较多（8）               | 较少（4）                              |
| API PropTypes    | 较少                    | 较多                                   |
| 上手友好度       | 良好                    | 一般                                   |
