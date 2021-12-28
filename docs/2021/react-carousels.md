# React Carousel Components

## 卡片层叠式轮播图

目前参考了这个[原生 js 之堆叠卡片轮播图（另一种实现方式）](https://blog.csdn.net/weilongjj/article/details/105384266)

```js
import { useState, useEffect, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import details from '@/data/home'

const SHOW_NUM = 6
const OFFSET = 190
const TIMEOUT = 3500
const IS_MOVE = true
const lists = details.cards

const getStyle = (value = OFFSET, scale = 1, zIndex = 5) => {
  return {
    transform: `translateX(${value}px) scale(${scale})`,
    zIndex,
  }
}

// 初始化各个卡片样式
const moveStyleInit = [
  getStyle(-OFFSET * 1.65, 0.8, 1),
  getStyle(-OFFSET, 0.9, 2),
  getStyle(0),
  getStyle(OFFSET, 0.9, 2),
  getStyle(OFFSET * 1.65, 0.8, 1),
  getStyle(0, 0.5, 0),
]

// 获取每一条的属性
const getSlides = (styles, target) => {
  const locSlides = []
  target.forEach((item, index) => {
    const slideobject = {
      src: item,
      style: index < SHOW_NUM ? styles[index] : getStyle(0, 0.5, 0),
    }
    locSlides.push(slideobject)
  })

  return locSlides
}

export function CardsCarousel(props) {
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState([])
  const [moveStyle, setMoveStyle] = useState(moveStyleInit)

  const handlers = useSwipeable({
    onSwipedLeft: () => handleClick(current, 'right'),
    onSwipedRight: () => handleClick(current, 'left'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  const timer = useRef()

  // 切换更新 View
  useEffect(() => {
    if (moveStyle.length > 0 && lists.length > 0) {
      setSlides(getSlides(moveStyle, lists))
    }
  }, [moveStyle, lists])

  // 自动切换
  useEffect(() => {
    if (IS_MOVE && current > -1) {
      const handle = () => {
        handleClick(current, 'right')
        clearTimeout(timer.current)
        timer.current = setTimeout(handle, TIMEOUT)
      }
      // timer.current = setTimeout(handle, TIMEOUT)
    }
    return () => clearTimeout(timer.current)
  }, [IS_MOVE, current])

  const handleClick = (index, arrow = 'right') => {
    const styles = [...moveStyle]
    const length = lists.length
    let current = index

    if (arrow === 'right') {
      const res = styles.pop()
      styles.unshift(res)
      current = index + 1 === length ? 0 : index + 1
    } else {
      const res = styles.shift()
      styles.push(res)
      current = index - 1 < 0 ? length - 1 : index - 1
    }
    console.log('styles', styles)
    setMoveStyle(styles)
    setCurrent(current)
  }

  return (
    <div className="card-carousels" {...handlers}>
      <div className="wrapper">
        <div
          className="btn-prev"
          onClick={() => handleClick(current, 'left')}
        ></div>
        <div
          className="btn-next"
          onClick={() => handleClick(current, 'right')}
        ></div>
        <div className="inner">
          <div className="swiper">
            {slides.map((item, index) => (
              <div className="swiper-item" key={index} style={item.style}>
                <img src={item.src} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card-dot-wrap">
        {slides.map((item, index) => (
          <i key={index} className={current === index ? 'active' : ''}>
            {index}
          </i>
        ))}
      </div>
    </div>
  )
}
```

```css
.card-carousels {
  .wrapper {
    margin: 30px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .btn-prev,
    .btn-next {
      @include flex();
      position: absolute;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      z-index: 9;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: center;
      transition: transform 0.3s;
      &:hover {
        transform: scale(1.05);
        transition: all 0.3s;
      }
    }
    .btn-prev {
      left: -10px;
      background-image: url('/static/img/home/icon_left.svg');
    }
    .btn-next {
      right: -10px;
      background-image: url('/static/img/home/icon_right.svg');
    }
    .inner {
      width: 595px;
      height: 374px;
      position: relative;

      .swiper,
      .swiper .swiper-item {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        font-size: 50px;
        text-align: center;
        line-height: 150px;
        // opacity: 0;
      }
      .swiper .swiper-item {
        @include flex();
        transition: all 0.5s ease-in-out;
        img {
          border-radius: 20px;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          user-drag: none;
          -webkit-touch-callout: none;
        }
      }
    }
  }
  .card-dot-wrap {
    @include flex();
    i {
      width: 28px;
      height: 4px;
      margin: 6px;
      background: #eef0f4;
      border-radius: 3px;
      color: transparent;
      transition: background 0.5s;
      &.active {
        background: #848bef;
        transition: all 0.5s;
      }
    }
  }
}
```

## CSS 实现的无限轮播

```css
@keyframes infiniteScroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes infiniteScrollBack {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

.long-carousels {
  margin-bottom: 40px;
  position: relative;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 80px;
    height: 100%;
    z-index: 1;
  }
  &::before {
    left: 0;
    background: linear-gradient(
      270deg,
      rgba(255, 255, 255, 0) 0%,
      #ffffff 100%
    );
  }
  &::after {
    right: 0;
    background: linear-gradient(
      270deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .item {
    display: block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    font-size: 0;
    img {
      max-width: none;
      margin: 8px;
      display: inline-block;
      animation: infiniteScroll 20s linear infinite;
    }
    &:nth-child(2) {
      img {
        animation-name: infiniteScrollBack;
      }
    }
  }
}
```

```js
const lists = [
  'http://sw.xuank.top/img/indexs/scroll-top1.svg',
  'http://sw.xuank.top/img/indexs/scroll-top2.svg',
  'http://sw.xuank.top/img/indexs/scroll-top3.svg',
]

export function LongCarousel(props) {
  return (
    <div className="long-carousels">
      {lists.map((item, index) => (
        <a key={index} className="item" href="/templates" target="_blank">
          <img src={item} />
          <img src={item} />
        </a>
      ))}
    </div>
  )
}
```

## 参考资料

- [14 Top React Carousel Components [2021]](https://alvarotrigo.com/blog/react-carousels/)
- [CSS 实现的无限轮播](https://juejin.cn/post/6941242335443288077)
