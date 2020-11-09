import { useState } from 'react'
import { List, message, Avatar, Spin } from 'antd'

import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import VList from 'react-virtualized/dist/commonjs/List'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'

function Virtualized({ FileItem, data }) {
  console.log(data)
  const [loading, setLoading] = useState(false)

  const loadedRowsMap = {}

  const handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    let { data } = data
    setLoading(true)
    for (let i = startIndex; i <= stopIndex; i++) {
      // 1 means loading
      oadedRowsMap[i] = 1
    }
    if (data.length > 19) {
      message.warning('Virtualized List loaded all')
      setLoading(false)
      return
    }
    // this.fetchData((res) => {
    //   data = data.concat(res.results)
    //   this.setState({
    //     data,
    //     loading: false,
    //   })
    // })
  }
  const isRowLoaded = ({ index }) => !!loadedRowsMap[index]
  const renderItem = ({ index, key, style }) => {
    const item = data[index]
    return <FileItem key={key} listData={item} style={style} />
  }

  const vlist = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop,
    onRowsRendered,
    width,
  }) => (
    <VList
      autoHeight
      height={height}
      isScrolling={isScrolling}
      onScroll={onChildScroll}
      overscanRowCount={2}
      rowCount={data.length}
      rowHeight={73}
      rowRenderer={renderItem}
      onRowsRendered={onRowsRendered}
      scrollTop={scrollTop}
      width={width}
    />
  )
  const autoSize = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop,
    onRowsRendered,
  }) => (
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
  const infiniteLoader = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop,
  }) => (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={handleInfiniteOnLoad}
      rowCount={data.data.length}
    >
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
    <>
      {data?.data && data.data.length > 0 && (
        <WindowScroller>{infiniteLoader}</WindowScroller>
      )}
      {loading && <Spin className="loading" />}
      <style jsx>
        {`
          .loading {
            position: absolute;
            bottom: -40px;
            left: 50%;
          }
        `}
      </style>
    </>
  )
}

export default Virtualized
