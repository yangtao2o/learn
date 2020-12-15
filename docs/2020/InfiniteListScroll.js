import { useState, useEffect } from 'react'
import { Spin, message } from 'antd'
// import InfiniteScroll from 'react-infinite-scroller'

function InfiniteListScroll(props) {
  const { data, isLoading, onUpdateHandle, FileItemCom } = props

  const [hasMore, setHasMore] = useState(true)
  const [onLoad, setOnLoad] = useState(false)
  const [details, setDetails] = useState([])

  // 判断如何加载数据
  useEffect(() => {
    if (data && data.data) {
      console.log('data1')
      if (!onLoad) {
        // 初始值，以及各个点击操作
        setDetails(data.data)
        setHasMore(true)
      } else {
        // 滑动加载
        let loadData = details
        loadData = loadData.concat(data.data)
        console.log('data-more', loadData)
        setDetails(loadData)
        setOnLoad(false)
      }
    } else {
      setDetails([])
    }
  }, [data])
  console.log('details->', details)
  // 加载更新
  const loadMoreHandle = () => {
    console.log('加载更新')
    if (hasMore) {
      setOnLoad(true)
    }
    // 获取页数相关信息
    if (data) {
      let { current_page, last_page } = data
      if (current_page >= last_page) {
        setOnLoad(false)
        setHasMore(false)
        return setTimeout(() => {
          message.success({
            content: '已加载全部文件',
            key: 'load',
            duration: 2,
          })
        }, 400)
      }
      if (typeof onUpdateHandle === 'function') {
        return onUpdateHandle({ page: +current_page + 1 })
      }
    }
  }

  return <div>234</div>
}
export default React.memo(InfiniteListScroll)
