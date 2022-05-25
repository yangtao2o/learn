# 页面暗黑模式

## package

- antd-theme-webpack-plugin
- antd-theme-generator

## css 一键切换

```css
.dark {
  filter: invert(1) hue-rotate(180deg);
}

/* 图片反转 */
.dark img {
  filter: invert(1) hue-rotate(180deg);
}

/* 切换过渡 */
* {
  transition: filter 300ms linear;
  -webkit-transition: filter 300ms linear;
  filter: invert(0) hue-rotate(0deg);
}
```

## AntdDesign

```js
import { ConfigProvider } from 'antd'
import 'antd/dist/antd.variable.min.css'

ConfigProvider.config({
  theme: {
    primaryColor: 'red',
  },
})

// <ConfigProvider>
//   <Page />
// </ConfigProvider>
```

## 参考资料

- [个人实践几种 React 在线主题切换方案](https://juejin.cn/post/7003315163625422879)
- [暗黑模式的实践\_React, CSS, DarkMode](https://www.w3cplus.com/css/practice-the-dark-mode.html)
- [CSS 一键设置页面暗黑模式、哀悼模式](https://blog.csdn.net/weixin_36491343/article/details/109027784)
