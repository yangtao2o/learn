# Next.js 升级记录

## Upgrading from version 9 to 10

```sh
yarn add next@10
```

## Upgrading from version 10 to 11

```sh
yarn add react@latest react-dom@latest
yarn add next@11
```

## Upgrading from version 11 to 12

```sh
yarn add react@latest react-dom@latest
yarn add next@12
```

- `Uncaught Error: Hydration failed because the initial UI does not match what was rendered on the server.`

- [Opted out of SWC feedback ](https://github.com/vercel/next.js/discussions/30174)

- No Script Tags In Head Component

```js
import Script from 'next/script'

const Home = () => {
  return (
    <div class="container">
      <Script src="https://third-party-script.js"></Script>
      <div>Home Page</div>
    </div>
  )
}

export default Home
```

- No Stylesheets In Head Component

```js
// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="..." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

- Viewport meta tags should not be used in \_document.js's `<Head>`

```js
// pages/_app.js
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
```

- [Warning: Text content did not match.](https://stackoverflow.com/questions/66374123/warning-text-content-did-not-match-server-im-out-client-im-in-div)

## 参考资料

- [Next.js 12 发布！迄今以来最大更新！](https://cloud.tencent.com/developer/article/1895737)
