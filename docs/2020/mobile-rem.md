# 移动端适配 vw + rem

## 要点

- 用 rem 来做字体的适配，
- 用 srcset 来做图片的响应式，
- 宽度可以用 rem，flex，栅格系统等来实现响应式，
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
  /* @media screen and (min-width: 813px) {
    font-size: 108px;
  }*/
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
@mixin fontDpr($font-size) {
  font-size: $font-size;

  [data-dpr='2'] & {
    font-size: $font-size * 2;
  }

  [data-dpr='3'] & {
    font-size: $font-size * 3;
  }
}
@mixin flexStyle(
  $direction: row,
  $justify: center,
  $align: center,
  $flex-wrap: wrap
) {
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

## 参考资料

- [前端响应式布局原理与方案（详细版）](https://juejin.im/post/6844903814332432397#heading-7) —— rem + vw 方案
- [关于移动端适配，你必须要知道的](https://juejin.im/post/6844903845617729549) —— 详细介绍，值得反复阅读
- [移动端 H5 解惑-页面适配（二）](https://juejin.im/post/6844903651245293582) —— 早期兼容方式，主要是兼容 PC、移动，现不推荐，但是理论概念值得学习
- [从网易与淘宝的 font-size 思考前端设计稿与工作流](https://www.cnblogs.com/lyzg/p/4877277.html) —— 理解大厂的逻辑，站在大厂的角度想问题
