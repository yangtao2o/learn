# React 数据加载组件对比

## 前言

基于 Ant Design 进行测试，涉及到的两个组件库分别是：
• [react-virtualized](https://www.npmjs.com/package/react-virtualized)
• [react-infinite-scroller](https://github.com/danbovey/react-infinite-scroller)

## 对比异同

| 特性         | react-virtualized                              | react-infinite-scroller |
| :----------- | :--------------------------------------------- | :---------------------- |
| 版本         | @9.22.2                                        | @1.2.4                  |
| 大小         | 2.27 MB                                        | 211 kB                  |
| Star         | 20k                                            | 2.5k                    |
| 周下载量     | 715,678                                        | 225,036                 |
| 文件数       | 252                                            | 14                      |
| Coverage     | 95%                                            | unknown                 |
| Contributors | 193                                            | 1                       |
| Last publish | 2 months ago                                   | 2 years ago             |
| Issues       | 314 Open 691 Closed                            | 57 Open 110 Closed      |
| 更新版本数   | 200                                            | 9                       |
| 浏览器支持   | iOS and Android，IE 9+（user-defined）         | unknown                 |
| 文档         | API 文档，example 示例                         | API 文档，example 示例  |
| 特点         | 大量的列表以及表格式数据，只加载可见区域的组件 | 滚动加载，一直到无数据  |

## react-virtualized

### Getting started

Install react-virtualized using npm.

```sh
npm install react-virtualized --save
```

### For example

```js
import { List, message, Avatar, Spin } from 'antd'

import reqwest from 'reqwest'

import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import VList from 'react-virtualized/dist/commonjs/List'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo'

const loadingStyle = {
  position: 'absolute',
  bottom: '-40px',
  left: '30%',
}

class VirtualizedExample extends React.Component {
  state = {
    data: [],
    loading: false,
  }

  loadedRowsMap = {}

  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        data: res.results,
      })
    })
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res)
      },
    })
  }

  handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    let { data } = this.state
    this.setState({
      loading: true,
    })
    for (let i = startIndex; i <= stopIndex; i++) {
      // 1 means loading
      this.loadedRowsMap[i] = 1
    }
    if (data.length > 19) {
      message.warning('Virtualized List loaded all')
      this.setState({
        loading: false,
      })
      return
    }
    this.fetchData(res => {
      data = data.concat(res.results)
      this.setState({
        data,
        loading: false,
      })
    })
  }

  isRowLoaded = ({ index }) => !!this.loadedRowsMap[index]

  renderItem = ({ index, key, style }) => {
    const { data } = this.state
    const item = data[index]
    return (
      <List.Item key={key} style={style}>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={<a href="https://ant.design">{item.name.last}</a>}
          description={item.email}
        />
        <div>Content</div>
      </List.Item>
    )
  }

  render() {
    const { data } = this.state
    const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
      <VList
        autoHeight
        height={height}
        isScrolling={isScrolling}
        onScroll={onChildScroll}
        overscanRowCount={2}
        rowCount={data.length}
        rowHeight={73}
        rowRenderer={this.renderItem}
        onRowsRendered={onRowsRendered}
        scrollTop={scrollTop}
        width={width}
      />
    )
    const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
      <AutoSizer disableHeight>
        {({ width }) =>
          vlist({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
            width,
          })
        }
      </AutoSizer>
    )
    const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
      <InfiniteLoader isRowLoaded={this.isRowLoaded} loadMoreRows={this.handleInfiniteOnLoad} rowCount={data.length}>
        {({ onRowsRendered }) =>
          autoSize({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
          })
        }
      </InfiniteLoader>
    )
    return (
      <List>
        {data.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
        {this.state.loading && <Spin style={loadingStyle} />}
      </List>
    )
  }
}

export default VirtualizedExample
```

## react-infinite-scroller

### Getting started

```sh
npm install react-infinite-scroller --save
```

How to use:

```js
import InfiniteScroll from 'react-infinite-scroller'
```

### For example

```js
import React from 'react'
import { List, message, Avatar, Spin } from 'antd'
import reqwest from 'reqwest'
import InfiniteScroll from 'react-infinite-scroller'

import style from './list.css'

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo'

class InfiniteListExample extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
  }

  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        data: res.results,
      })
    })
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res)
      },
    })
  }

  handleInfiniteOnLoad = () => {
    let { data } = this.state
    this.setState({
      loading: true,
    })
    if (data.length > 14) {
      message.warning('Infinite List loaded all')
      this.setState({
        hasMore: false,
        loading: false,
      })
      return
    }
    this.fetchData(res => {
      data = data.concat(res.results)
      this.setState({
        data,
        loading: false,
      })
    })
  }

  render() {
    return (
      <div className={style['demo-infinite-container']}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <List
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description={item.email}
                />
                <div>Content</div>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className={style['demo-loading-container']}>
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    )
  }
}

export default InfiniteListExample
```

list.css:

```css
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
```
