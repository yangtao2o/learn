# 移动端适配 vw + rem 技术方案

## 理论要点

- 用 rem 来做字体的适配
- 用 srcset 来做图片的响应式
- 宽度可以用 rem，flex，栅格系统等来实现响应式
- 然后可能还需要利用媒体查询来作为响应式布局的基础

```scss
// 默认根元素大小基准值375,即设计图尺寸（蓝湖Web）宽375px
// 不同页面设计图尺寸不同，在页面css头部重新初始化并重新定义html根元素的font-size

$baseFontSize: 37.5;
$baseDesign: 375;

// 根元素大小使用 vw 单位
html {
  font-size: ($baseFontSize / $baseDesign) * 100vw;

  @media screen and (orientation: landscape) {
    font-size: ($baseFontSize / $baseDesign) * 100vh;
  }

  // 同时，通过Media Queries 限制根元素最大最小值
  @media screen and (max-width: 320px) {
    font-size: 32px;
  }
  @media screen and (min-width: 540px) {
    font-size: 54px;
  }
  //横屏下ipad等平板font-size最大限制
  @media screen and (min-width: 813px) {
    font-size: 108px;
  }
}
body {
  max-width: 540px;
  min-width: 320px;
}
img {
  display: inline-block;
  max-width: 100%;
  height: auto;
}

// Mixins
@mixin flexStyle($direction: row, $justify: center, $align: center, $flex-wrap: wrap) {
  display: -webkit-flex;
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
  flex-wrap: $flex-wrap;
}
// 实现1物理像素的下边框线
@mixin border1px($color) {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    pointer-events: none;
    background-color: $color;
    height: 1px;
    left: 0;
    right: 0;
    top: 0;

    @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
      -webkit-transform: scaleY(0.5);
      -webkit-transform-origin: 50% 0;
      transform: scaleY(0.5);
      transform-origin: 50% 0;
    }
  }
}

// Methods
@function rem($px) {
  @return ($px / $baseFontSize) * 1rem;
}

@function vw($px) {
  @return ($px / 375) * 100vw;
}
```

## 实践操作

### 开票项目

Gitlab 地址：[fapiao.aunbox.cn](http://gitlab.kxhz.cc/AunboxFE/software-store/fapiao.aunbox.cn)

背景：全新项目，使用 Vant 框架，使用 SASS

使用 `"postcss-pxtorem": "^5.1.1"`:

package.json:

```json
{
  "postcss": {
    "plugins": {
      "postcss-pxtorem": {
        "rootValue": 100,
        "propList": ["*"]
      }
    }
  }
}
```

scss:

```scss
// 设计稿尺寸
$baseDesign: 375;
html {
  font-size: (100 / $baseDesign) * 100vw;

  @media screen and (orientation: landscape) {
    font-size: (100 / $baseDesign) * 100vh;
  }
  // 注意Px单位不要被转换为rem
  @media screen and (min-width: 769px) {
    max-width: 540px;
    min-height: 100%;
    margin: 0 auto;
    font-size: 110px;
  }
}
```

这样设置之后，通过 scss 编写的 px 单位会被 postcss 自动转换成 px,除了大写的 PX 或者 Px 单位。

### 数据恢复大师官网移动站

地址：[huifu.hgs.cn](https://huifu.hgs.cn/)

Gitlab 地址：[huifu.hgs.cn](http://gitlab.kxhz.cc/AunboxFE/next-site/huifu.hgs.cn)

背景：建立在 PC 基础上，所以需要避免 PC 的 px 单位转换，依旧使用的 SASS

package.json: 设置 exclude 以排除此目录下的转换功能

```json
{
  "postcss": {
    "plugins": {
      "postcss-pxtorem": {
        "rootValue": 100,
        "propList": ["*"],
        "selectorBlackList": [],
        "exclude": ["/assets/sass/pc"]
      }
    }
  }
}
```

scss：

```scss
$baseDesign: 375;

html {
  font-size: (100 / $baseDesign) * 100vw;

  @media screen and (orientation: landscape) {
    font-size: (100 / $baseDesign) * 100vh;
  }
}
```

## 总结

鉴于实际项目的使用心得，使用方法如下：

下载：[PostCSS](https://www.npmjs.com/package/postcss)

```sh
postcss
postcss-pxtorem
```

配置：

```json
{
  "postcss": {
    "plugins": {
      "autoprefixer": {},
      "postcss-pxtorem": {
        "rootValue": 100,
        "propList": ["*"],
        "selectorBlackList": [],
        "exclude": ["/assets/sass/pc"]
      }
    }
  }
}
```

Sass 设置：

```scss
$baseDesign: 375;

html {
  font-size: (100 / $baseDesign) * 100vw;

  @media screen and (orientation: landscape) {
    font-size: (100 / $baseDesign) * 100vh;
  }
}
```

## 参考资料

- [前端响应式布局原理与方案（详细版）](https://juejin.im/post/6844903814332432397#heading-7) —— rem + vw 方案
- [关于移动端适配，你必须要知道的](https://juejin.im/post/6844903845617729549) —— 详细介绍，值得反复阅读
- [移动端 H5 解惑-页面适配（二）](https://juejin.im/post/6844903651245293582) —— 早期兼容方式，主要是兼容 PC、移动，现不推荐，但是理论概念值得学习
- [从网易与淘宝的 font-size 思考前端设计稿与工作流](https://www.cnblogs.com/lyzg/p/4877277.html) —— 理解大厂的逻辑，站在大厂的角度想问题
