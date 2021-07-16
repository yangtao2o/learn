# React-native 使用记录

## 文档指南

- [React Made Native Easy](https://www.reactnative.guide/index.html)

## MacOs 环境安装

### Android

#### Java Development Kit

```sh
brew install adoptopenjdk/openjdk/adoptopenjdk8
```

Version

```sh
javac -version
# javac 1.8.0_282
```

#### Android Studio

[Android Studio](https://developer.android.google.cn/studio/)

#### 运行

```sh
yarn android
```

## 常用库

- [React Native Elements](https://reactnativeelements.com/docs)
- [React Navigation](https://reactnavigation.org/) - Routing and navigation for your React Native apps
- [react-native-modal](https://github.com/react-native-modal/react-native-modal)
- [@react-native-clipboard/clipboard](https://github.com/react-native-clipboard/clipboard)

## 启动页

- 安卓：react-native-splash-screen
- IOS： or systems config

## Webview

- [react-native-webview](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md)
- [【Web 技术】 275- 理解 WebView](https://cloud.tencent.com/developer/article/1471962?from=article.detail.1471821)

### Basic URL Source

```js
This is the most common use-case for WebView.

import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class MyWeb extends Component {
  render() {
    return <WebView source={{ uri: 'https://reactnative.dev/' }} />;
  }
}
```

### Communicating between JS and Native

You will often find yourself wanting to send messages to the web pages loaded by your webviews and also receiving messages back from those web pages.

To accomplish this, React Native WebView exposes three different options:

- React Native -> Web: The `injectedJavaScript` prop
- React Native -> Web: The `injectJavaScript` method
- Web -> React Native: The `postMessage` method and `onMessage` prop

### postMessage 不起作用 怎么调用 js 方法

```js
// In index.html
window.addEventListener('message', function (event) {
  alert('message received: ' + event.data)
})

// In app.js
const generateOnMessageFunction = (data: any) =>
  `(function() {
    window.dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(
      data
    )}}));
  })()`

webViewRef.current.injectJavaScript(generateOnMessageFunction(message))
```

- [[Documentation] Clarify migration path for this.webView.postMessage removal](https://github.com/react-native-webview/react-native-webview/issues/809)

## 获取设备信息组件

`react-native-device-info`

## 获取网络信息

`@react-native-community/netinfo`

```js
import NetInfo, { useNetInfo } from '@react-native-community/netinfo'

// 获取网络信息等
const netInfo = useNetInfo()
if (!netInfo.isConnected) {
  return showToast('请检查网络或稍后重试')
}

// 监听网络状态
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    const { isConnected } = state
    if (!isConnected) {
      showToast('请检查网络或稍后重试', 4)
    }
  })

  // Unsubscribe
  return unsubscribe
}, [])
```

如果是 web 端，该如何处理呢？见这里：[如何处理浏览器的断网情况？](https://juejin.cn/post/6953868764362309639)，主要依赖于 navigator 对象。

## How to clear react-native cache?

- [How to clear react-native cache?](https://stackoverflow.com/questions/46878638/how-to-clear-react-native-cache)

## 手动修改安装包版本号

### Android

修改`android/app/build.gradle`中的 `versionName`:

```
defaultConfig {
  versionName "1.0.2"
}
```

### IOS

用 xcode 打开`PROJECT_NAME.xcodeproj`,修改`PROJECT_NAME/Info.plist`的`Bundle versions string, short`

## Andriod 下设置阴影

```js
style: {
  shadowOffset: {width: 0, height: 5},
  shadowOpacity: 0.5,
  shadowRadius: 5,
  shadowColor: '#ddd',
  //让安卓拥有灰色阴影
  elevation: 4,
}
```

## Andriod 监听返回事件

使用`BackHandler`API:

```js
import React, { useEffect } from 'react'
import { Text, View, StyleSheet, BackHandler, Alert } from 'react-native'

const App = () => {
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ])
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Click Back button!</Text>
    </View>
  )
}
```

但是对于 Modal 是无效的，所以需要传递参数去判断当前情况：

```js
// visible: modal是否打开
useEffect(() => {
  const backAction = () => {
    if (visible) {
      handleVisible()
    }

    return visible ? true : false
  }

  BackHandler.addEventListener('hardwareBackPress', backAction)

  return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
}, [visible])
```

## react-native App 更新方案

### rn-fetch-blob

用于访问管理文件与请求传输数据。正好存在集下载、通知与自动安装 apk 的 api

### react-native-fs

实现了 react native 的访问本地文件系统，支持文件的创建、删除、查看、上传、下载

### 参考资料

- [rn-fetch-blob](https://github.com/joltup/rn-fetch-blob) --- 停止维护
- [react-native-fs](https://github.com/itinance/react-native-fs) --- 停止维护
- [react-native-blob-util](https://github.com/RonRadtke/react-native-blob-util) ---继续维护
- [React-Native 原生 APP 更新](https://www.cnblogs.com/Grewer/p/14518357.html)
- [react-native App 更新方案](https://www.jianshu.com/p/77e5bd98a7f1)
- [react-native install download apk file](https://blog.csdn.net/u011149565/article/details/100575218)
- [React-Native 安卓 自动下载 APK 文件并安装](https://blog.csdn.net/weixin_42284466/article/details/84898859)
- [React-Native 安卓 自动下载 APK 文件并安装 兼容 8.0 以上](https://www.jianshu.com/p/bd9495425d7f)

## 安卓设置状态栏和 iOS 保持一致

```js
import { StatusBar } from 'react-native'
```

主要是 translucent 属性：指定状态栏是否透明。设置为 true 时，应用会延伸到状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。

```js
<StatusBar
  backgroundColor={'transparent'}
  barStyle={'dark-content'}
  translucent
/>
```

## URLSearchParams 'Error: not implemented'

### iOS 10 + other platforms bug

In case you'd like to replace the broken global native constructor, you can check some well known issue before including this polyfill on your project/page.

### node-libs-react-native

This package provides React Native compatible implementations of Node core modules like stream and http. This is a fork of node-libs-browser with a few packages swapped to be compatible in React Native.

### 解决

在根目录 index.js 添加如下，完成之后，重新编译：

```sh
yarn add node-libs-react-native
yarn add url-search-params
```

```js
import 'node-libs-react-native/globals'
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions'

polyfillGlobal('URLSearchParams', () => require('url-search-params'))
```

解决方案：['Error: not implemented'](https://github.com/facebook/react-native/issues/23922#issuecomment-490639903)

## Warning: Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle

主要原因：循环引用了包，如：A->B->A。消除之间的循环即可。

- [Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle](https://stackoverflow.com/questions/55664673/require-cycles-are-allowed-but-can-result-in-uninitialized-values-consider-ref)

## Warning: Function components cannot be given refs

可以通过`forwardRef`包裹函数组件来解决。

官方文档例子：https://zh-hans.reactjs.org/docs/forwarding-refs.html

```js
import React, { forwardRef, useImperativeHandle } from 'react'
import { Text } from 'react-native'

const LoadMorePages = (props, ref) => {
  useImperativeHandle(ref, () => ({
    loadMoreFunc,
  }))

  // 滑动加载
  const loadMoreFunc = () => true

  return <Text>111</Text>
}

export default forwardRef(LoadMorePages)
```

引入使用：

```js
import React, { useRef } from 'react'
import LoadMorePages from './load-more-pages'

export default function Home(props) {
  const loadMoreRef = useRef()
  // 调用
  const onClick = () => loadMoreRef?.current?.loadMoreFunc()
  return <LoadMorePages ref={loadMoreRef} />
}
```

## Warning: VirtualizedLists should never be nested inside plain ScrollViews

```js
import React from 'react'
import { FlatList } from 'react-native'

export default function VirtualizedView(props) {
  return (
    <FlatList
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => 'dummy'}
      renderItem={null}
      ListHeaderComponent={() => (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    />
  )
}
```

- [How to Fix 'VirtualizedLists should never be nested inside plain ScrollViews' Warning](https://nyxo.app/fixing-virtualizedlists-should-never-be-nested-inside-plain-scrollviews)
- [RN 解决警告：VirtualizedLists should never be nested inside plain ScrollViews](https://blog.csdn.net/gang544043963/article/details/106525516)

## Warning: Failed child context type: Invalid child context `virtualizedCell.cellKey` of type `number` supplied to `CellRenderer`, expected `string`.

大致意思就是希望获取到字符串，实际获取到的是数字类型。

将`keyExtractor={item => item.id}`改成`keyExtractor={item => '' + item.id}`

```js
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={item => '' + item.id}
  extraData={selectedId}
  horizontal
/>
```

## 适配

```js
import { Dimensions, StatusBar, Platform } from 'react-native'
import { getModel } from 'react-native-device-info'

// 设计图上的比例，宽度
const basePx = 375

export const width = Dimensions.get('window').width
export const height = Dimensions.get('window').height

// 设计样式转换
export function px2dp(px) {
  return (px * width) / basePx
}

export const statusBarHeight = getStatusBarHeight()

export function isIphoneX() {
  const X_WIDTH = 375
  const X_HEIGHT = 812
  return Platform.OS == 'ios' && height == X_HEIGHT && width == X_WIDTH
}

//状态栏的高度
export function getStatusBarHeight() {
  const model = ['iPhone 8', 'iPhone 7', 'iPhone 6', 'iPhone 5']
  if (Platform.OS === 'ios') {
    if (model.some(item => getModel().indexOf(item) !== -1)) {
      return 20
    }
    return 44
  }
  return StatusBar.currentHeight
}
```

## FlatList 使用

主要内容：下拉刷新、页面滑动至顶部、设置下拉刷新样式等

```js
import React, { useState, useEffect, useRef } from 'react'
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
} from 'react-native'
import { Pagination } from '@ant-design/react-native'
import { EmptyStatus } from '../../components/empty'

const locale = {
  prevText: '上一页',
  nextText: '下一页',
}

const height = Dimensions.get('window').height

export const LoadMorePages = props => {
  const { data, isLoading, onUpdateHandle, FolderItemCom, FileItemCom } = props
  const [details, setDetails] = useState([])
  const [current, setCurrent] = useState(1)
  const [pages, setPages] = useState({
    total: 0,
    pageSize: 0,
    lastPage: 0,
  })

  const flatListRef = useRef()

  useEffect(() => {
    if (data && data.data) {
      const { total, per_page, current_page, last_page } = data
      setDetails(data.data)
      setCurrent(current_page)
      setPages({
        total,
        pageSize: per_page,
        lastPage: last_page,
      })
    }
  }, [data])

  // 页面滑动至顶部
  const scrollToTop = () => flatListRef.current.scrollToOffset({ offset: 0 })

  // 页数更新
  const handlePageChange = page => {
    scrollToTop()
    setTimeout(() => {
      setCurrent(page)
      onUpdateHandle({ page })
    }, 0)
  }

  const renderItem = ({ item, index }) => {
    return item?.item_type == '2' ? (
      <FolderItemCom
        index={index}
        listData={item}
        key={item.file_guid}
        {...props}
      />
    ) : (
      <FileItemCom
        index={index}
        listData={item}
        key={item.file_guid}
        {...props}
      />
    )
  }

  const listFooter = () => {
    return pages.lastPage > 1 ? (
      <View style={{ marginHorizontal: 18, marginVertical: 30 }}>
        <Pagination
          current={+current}
          total={pages.lastPage}
          locale={locale}
          onChange={handlePageChange}
        />
      </View>
    ) : null
  }

  const listEmpty = () => {
    return !isLoading && details.length <= 0 ? (
      <EmptyStatus style={{ height: height / 2 }} />
    ) : null
  }

  return (
    <FlatList
      ref={flatListRef}
      data={details}
      style={styles.container}
      automaticallyAdjustContentInsets={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => '' + item.file_guid}
      renderItem={renderItem}
      //设置下拉刷新样式
      refreshControl={
        <RefreshControl
          title={'正在加载'} //android中设置无效
          colors={['#666']} //android
          tintColor={'#666'} //ios
          titleColor={'#666'}
          refreshing={isLoading}
          onRefresh={() => onUpdateHandle({ page: current })}
        />
      }
      ListFooterComponent={() => listFooter()}
      ListEmptyComponent={() => listEmpty()}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
```

ListHeaderComponent 内容、下拉更新、上滑加载更多：

```js
import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'
import {
  Text,
  StyleSheet,
  FlatList,
  Linking,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { SpaceItem } from './space-item'
import { TextButton } from '../button'
import { px2dp } from '../platfrom-tool'
import { EmptyStatus } from '../../components/empty'

const LoadMorePages = (props, ref) => {
  const {
    data,
    isLoading,
    isReset,
    handleReset,
    onUpdateHandle,
    navigation,
    ListHeaderComponent,
  } = props

  const [details, setDetails] = useState([])
  const [current, setCurrent] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isLoadMore, setLoadMore] = useState(false)
  const [isRefresh, setRefresh] = useState(false)

  // useImperativeHandle(ref, () => ({
  //   flatListRef,
  // }))

  // Reset props
  useEffect(() => {
    if (isReset) {
      setDetails([])
      setCurrent(0)
      setHasMore(true)
      handleReset(false)
    }
  }, [isReset])

  // Loading status from load more and request data
  useEffect(() => {
    setLoading(isLoading)
    if (!isLoading) {
      setRefresh(false)
    }
  }, [isLoading])

  // How to refresh data
  useEffect(() => {
    if (data && data.data) {
      if (current === 0 || isRefresh) {
        setDetails(data.data)
      } else if (isLoadMore) {
        setDetails([...details, ...data.data])
      }
    }
    setLoadMore(false)
    setRefresh(false)
  }, [data && data.data])

  // 下拉加载
  const refreshFunc = () => {
    setRefresh(true)
    setCurrent(0)
    onUpdateHandle({ page: 1 })
  }

  // 滑动加载
  const loadMoreFunc = () => {
    const { current_page, last_page } = data
    setLoading(true)
    setCurrent(current_page)
    if (current_page >= last_page) {
      setHasMore(false)
      setLoading(false)
      return
    }
    if (current_page !== current) {
      onUpdateHandle({ page: +current_page + 1 })
      setLoadMore(true)
    }
  }

  const handleOpenUrl = useCallback(async url => {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert('请使用浏览器打开此链接', url)
    }
  }, [])

  const listFooter = () => {
    if (loading) {
      return <ActivityIndicator style={styles.footer} color="#999" />
    }
    if (details.length > 0 && !loading && !hasMore) {
      return <Text style={styles.footer}>没有更多了</Text>
    }
    return null
  }

  const listEmpty = () => {
    if (!loading && details.length < 1) {
      return (
        <EmptyStatus
          style={styles.emptyStatus}
          title="没找到想要的模板？"
          view={
            <TextButton
              value="去建议"
              containerStyle={styles.adviceBtn}
              style={{ fontSize: 12, color: '#fff' }}
              onPress={() =>
                handleOpenUrl('https://wj.qq.com/s2/8213118/9b21/')
              }
            />
          }
        />
      )
    }
    return null
  }

  return (
    <FlatList
      ref={ref}
      style={styles.container}
      data={details}
      numColumns={2}
      horizontal={false}
      automaticallyAdjustContentInsets={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => '' + item.id}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={listFooter}
      ListEmptyComponent={listEmpty}
      renderItem={({ item }) => (
        <SpaceItem navigation={navigation} key={item.id} listData={item} />
      )}
      onEndReachedThreshold={0.1}
      onEndReached={loadMoreFunc}
      refreshControl={
        <RefreshControl
          title={'正在加载'}
          colors={['#666']} //android
          tintColor={'#666'} //ios
          titleColor={'#666'}
          refreshing={isRefresh}
          onRefresh={refreshFunc}
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFE',
  },
  footer: {
    textAlign: 'center',
    marginTop: px2dp(30),
    marginBottom: px2dp(50),
    color: '#999',
    fontSize: 12,
  },
  adviceBtn: {
    marginTop: px2dp(10),
    paddingHorizontal: px2dp(15),
    paddingVertical: px2dp(8),
    backgroundColor: '#12bb37',
    borderRadius: 4,
  },
  emptyStatus: {
    marginTop: px2dp(20),
  },
})

export default forwardRef(LoadMorePages)
```

## 本地存储

### Async-storage

```sh
yarn add @react-native-async-storage/async-storage
```

```js
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
async function loadString(key = '') {
  try {
    return await AsyncStorage.getItem(key)
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
async function saveString(key = '', value = '') {
  try {
    await AsyncStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
async function load(key = '') {
  try {
    const almostThere = await AsyncStorage.getItem(key)
    return JSON.parse(almostThere)
  } catch {
    return null
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
async function save(key = '', value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
async function remove(key = '') {
  try {
    await AsyncStorage.removeItem(key)
  } catch {}
}

/**
 * Burn it all to the ground.
 */
async function clear() {
  try {
    await AsyncStorage.clear()
  } catch {}
}

// 设置本地存储
export const localStorageHandle = {
  setString: saveString,
  getString: loadString,
  set: save,
  get: load,
  remove,
  clear,
}
```

- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/docs/install)
