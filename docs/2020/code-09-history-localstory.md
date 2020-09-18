# 使用 localStorage 记录搜索历史

```js
// 搜索模块
var searchEvent = (function () {
  var COOKIE_NAME = 'pdf_recently_searches'
  var $navBox = $('#navBox')
  var $formSearch = $('#formSearch')
  var $wrap = $formSearch.parent()
  var $input = $formSearch.find('input')
  var $dropdown = $wrap.find('.search-dropdown')
  var $hideBtn = $dropdown.find('.hide-btn')

  var dropdownHide = function () {
    $wrap.removeClass('search-wrap-active')
    $dropdown.hide()
    setTimeout(function () {
      $navBox.show()
    }, 200)
  }

  // 搜索动作
  $input.focus(function () {
    $navBox.hide()
    $dropdown.show()
    $wrap.addClass('search-wrap-active')
  })

  $hideBtn.click(dropdownHide)

  // 判断是否消失
  $('body').click(function (e) {
    var node = e.target.nodeName.toLowerCase()
    if (node === 'body' && $dropdown.is(':visible')) {
      dropdownHide()
    }
  })

  // 搜索记录模块
  var searchHistory = function (name) {
    if (!name) throw new Error('The name is undefined')

    var $hWrap = $('#historyWrap')
    var historyListJson = localStorage.getItem(name) || '[]'
    var historyListArr = JSON.parse(historyListJson)

    // 提交
    $formSearch.submit(function () {
      var value = $.trim($input.val())
      if (!value) return false
      setHistoryItems(value)
    })

    // 热门搜索
    $('#hotkeywordList').on('click', 'a', function (e) {
      var value = $.trim(e.target.text)
      setHistoryItems(value)
    })

    // 获取用户最近搜索记录
    if (historyListArr.length > 0) {
      render()
    }

    function render() {
      var origin = window.location.origin
      var $html = '<div class="history">'
      $html += '<div class="header">搜索记录<span class="clear-btn"><i class="icon-delete"></i>清空</span></div>'
      $html += '<ul class="list">'
      for (var i = 0; i < historyListArr.length; i++) {
        $html +=
          '<li class="item"><a href="' +
          origin +
          '?s=' +
          historyListArr[i] +
          '">' +
          historyListArr[i] +
          '</a><i class="close-btn" data-index="' +
          i +
          '"></i></li>'
      }
      $html += '</ul>'
      $html += '</div>'
      $hWrap.html($html)

      var $history = $hWrap.find('.history')
      var $clearBtn = $history.find('.clear-btn')
      var $historyLists = $history.find('.item')

      // 清除某一条
      $historyLists.on('click', '.close-btn', function () {
        var index = $(this).data('index')

        // 删除数组内的指定位置数据
        historyListArr.splice(index, 1)

        setHistoryStorage(name, historyListArr)
        if (historyListArr.length < 1) {
          $hWrap.html('')
        } else {
          render()
        }
      })
      // 清除全部
      $clearBtn.click(function () {
        $hWrap.html('')
        localStorage.removeItem(name)
        window.location.reload()
      })
    }

    function setHistoryItems(value) {
      var maxNum = 5
      // 判断去重，如果相同，更新至顶部
      $.each(historyListArr, function (i, item) {
        if (item === value) {
          return historyListArr.splice(i, 1)
        }
      })

      historyListArr.unshift(value)

      if (historyListArr.length >= maxNum) {
        historyListArr = historyListArr.splice(0, maxNum)
      }

      render()
      setHistoryStorage(name, historyListArr)
    }

    // 保存更新追加的数据到json数据中
    function setHistoryStorage(name, data) {
      localStorage.setItem(name, JSON.stringify(data))
    }
  }

  searchHistory(COOKIE_NAME)
})()
```
