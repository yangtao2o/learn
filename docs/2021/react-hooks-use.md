# React 常用 Hooks 整理

## useDebounce

```js
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value])

  return debouncedValue
}
```

## useWindowSize

```js
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}
```

## useEventListener

```js
export function useEventListener(type, handler) {
  const savedHandler = useRef()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const listener = e => savedHandler.current(e)

    window.addEventListener(type, listener)

    return () => {
      window.removeEventListener(type, listener)
    }
  }, [type])
}
```

## useFallbackImg

```js
import React, { useState } from 'react'

/**
 * Returns an object that can
 * be spread onto an img tag
 * @param {String} img
 * @param {String} fallback
 * @returns {Object} { src: String, onError: Func }
 */
function useFallbackImg(img, fallback) {
  const [src, setImg] = useState(img)

  function onError(e) {
    console.log('Missing img', img, e)
    // React bails out of hook renders if the state
    // is the same as the previous state, otherwise
    // fallback erroring out would cause an infinite loop
    setImg(fallback)
  }

  return { src, onError }
}

/**
 * Usage <Image src='someUrl' fallback='fallbackUrl' alt='something' />
 */
function Image({ src, fallback, ...rest }) {
  const imgProps = useFallbackImg(src, fallback)

  return <img {...imgProps} {...rest} />
}
```

## 参考资料

- [React Hooks - 30secondsofcode](https://www.30secondsofcode.org/react/t/hooks/p/1) - 常用比较小的钩子片段，直接用
- [ahooks](https://ahooks.js.org/zh-CN) - 阿里旗下的
- [react-use](https://github.com/streamich/react-use) - 全球最大的...
