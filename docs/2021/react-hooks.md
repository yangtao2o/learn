# React 常用 Hooks 整理

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
