# 常用代码模板-八月

## 处理常见问题版块列表数据

```js
/* 处理常见问题版块列表数据
 * @param{String} target - id
 * @param{Object} detail
 * @param{Number} item - 每组数据的条数
 */
var dealwithLists = function (target, detail, item) {
  if (!target && !detail) {
    throw new Error('参数有误')
  }
  var opts = {
    $swiper: $(target),
    detail: detail,
    item: item || 5,
    wrapStart: '<div class="swiper-slide">',
    wrapEnd: '</div>',
  }
  var title

  // 获取匹配规则的数据：每 5 条一组
  var getData = function () {
    var data = []
    var lists = opts.detail.lists
    var slide = parseInt(Math.ceil(lists.length / opts.item))
    title = opts.detail.title

    for (var i = 0; i < slide; i++) {
      data[i] = lists.splice(0, opts.item)
    }

    return data
  }

  // render
  var render = function () {
    var html = ''
    var lists = getData()
    var slide = lists.length

    for (var i = 0; i < slide; i++) {
      var len = lists[i].length

      html += opts.wrapStart
      for (var j = 0; j < len; j++) {
        var item = lists[i][j]
        var index = j + i * opts.item + 1
        html += `<a href="/article${title.link}/${item.id}">${index}.${item.title}</a>`
      }

      html += opts.wrapEnd
    }

    return html
  }

  opts.$swiper.append(render())
}

var toggleSwiper = (function () {
  var handler = function () {
    var _this = $(this)
    var $box = _this.next()
    if (!$box.html()) return

    if ($box.is(':visible')) {
      $box.slideUp(100)
      _this.removeClass('up')
    } else {
      $box.slideDown(100)
      _this.addClass('up')
    }
  }
  return function (target, className) {
    if (className) {
      $(className).not('.up').next('.box-wrap').hide()
    }
    $(target).on('click', className, handler)
  }
})()
```

## 视频相关配置

```js
// 设置视频属性
var videoSet = (function () {
  function SetVideo(video) {
    this.PLAY = 'play'
    this.ENDED = 'ended'
    this.PAUSE = 'pause'
    this.isPlay = false
    this.video = video
    this.$modal = $(video).next('.modal')

    // Setting attribute
    this.video.setAttribute('webkit-playsinline', true) // 视窗内全屏
    this.video.setAttribute('playsinline', true)
    this.video.setAttribute('x-webkit-airplay', true)
    this.video.setAttribute('x5-video-orientation', 'h5')
    this.video.setAttribute('x5-video-player-type', 'h5') // 启用H5播放器,是wechat安卓版特性
    this.video.setAttribute('x5-video-player-fullscreen', true)
    this.video.setAttribute('preload', 'auto')
    this.video.setAttribute('controls', false)
  }

  SetVideo.prototype.clickEvent = function () {
    var _this = this
    var listener = function (e) {
      _this.video.addEventListener(
        e,
        function () {
          if (e === _this.PLAY) {
            _this.isPlay = true
          } else if (e === _this.ENDED || e === _this.PAUSE) {
            $(_this.video).css({ width: '0' })
            _this.isPlay = false
          }
        },
        false
      )
    }

    // Listener event
    listener(this.PLAY)
    listener(this.ENDED)
    listener(this.PAUSE)

    var clickEvent = (function () {
      // Play click
      _this.$modal.click(function () {
        $(_this.video).css({ width: '100%' })
        _this.video.play()
      })
      // Other click
      document.addEventListener(
        'touchstart',
        function (e) {
          if (_this.isPlay) {
            if (e.target.className !== _this.$modal[0].className && e.target.className !== 'video') {
              _this.video.pause()
            }
          }
        },
        false
      )
    })()
  }
  // 实例化
  var $videos = $('#videoSwiper .video')
  $.each($videos, function (i, item) {
    new SetVideo(item).clickEvent()
  })
})()

var videoHandler = function () {
  var run_time = [5 * 1000, 9.05 * 1000, 16.04 * 1000]
  var steps_gif = ['1.mp4', '2.mp4', '3.mp4']
  var index = 0
  var timer = null
  var $videoBox = $('#videoWrap').find('.video')
  var $content = $('#videoWrap').find('.content')
  var handler = function () {
    if (index < steps_gif.length) {
      index++
    } else {
      index = 0
    }
    $content.css({ top: -0.24 * index + 'rem' })
    $videoBox.attr('src', steps_gif[index])
    autoPlay()
  }

  // Auto play
  var autoPlay = function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(handler, run_time[index])

    $videoBox.attr('src', steps_gif[index])
  }

  var scrollHandler = function () {
    var s = $(this).scrollTop()
    var h = $(window).height()
    var top = $videoBox.offset().top
    if (s > top - h) {
      if (!timer) {
        autoPlay()
      }
    }
  }

  scrollHandler()

  $(window).scroll(throttle(scrollHandler, 600, true))
}
```

## 复制粘贴

```js
// 复制并提示
var methods = {
  copyCode() {
    let clipboard = new ClipboardJS('#copyCodeBtn')
    clipboard.on('success', e => {
      this.toast('复制成功')
      clipboard.destroy()
    })
    clipboard.on('error', e => {
      this.toast('复制失败')
      clipboard.destroy()
    })
  },
  toast(str) {
    var $target = $('#toast')
    $target.text(str).fadeIn(100)
    setTimeout(function () {
      $target.fadeOut(100)
    }, 2000)
  },
}
```

## Swiper 可拖动切换

```js
var swiper1 = new Swiper('#dealStepSwiper', {
  slidesPerView: 'auto',
  freeMode: true,
})

// 可拖动切换
var swiperNav = new Swiper('#swiperNav', {
  slidesPerView: 3,
  watchSlidesProgress: true,
  watchSlidesVisibility: true,
  on: {
    tap: function () {
      swiperBox.slideTo(swiperNav.clickedIndex)
    },
  },
})

var swiperBox = new Swiper('#swiperBox', {
  spaceBetween: 20,
  autoHeight: true,
  on: {
    slideChangeTransitionStart: function () {
      updateNavPosition()
    },
  },
})

function updateNavPosition() {
  $('#swiperNav .active').removeClass('active')
  var activeNav = $('#swiperNav .swiper-slide').eq(swiperBox.activeIndex).addClass('active')

  if (!activeNav.hasClass('swiper-slide-visible')) {
    if (activeNav.index() > swiperNav.activeIndex) {
      var thumbsPerNav = Math.floor(swiperNav.width / activeNav.width()) - 1
      swiperNav.slideTo(activeNav.index() - thumbsPerNav)
    } else {
      swiperNav.slideTo(activeNav.index())
    }
  }
}
```

## 常规事件处理

```js
$(function () {
  CommonHandler.headerNavEvent()
  CommonHandler.rightNavEvent()
  CommonHandler.toTopEvent($('#navToTop'))
})

var CommonHandler = (function () {
  // Setting Copyright Year
  var copyrightYear = {
    $target: $('#footerSetYear'),
    handler: function () {
      this.$target.text(new Date().getFullYear())
    },
  }

  var getTarget = function (classname) {
    return $('#headerNav').find('.' + classname)
  }

  // Header nav open and close event
  var headerNav = {
    $open: getTarget('menu'),
    $close: getTarget('menu-close'),
    $content: getTarget('nav'),
    handler: function (target, fadeInTarget, slideDownTarget) {
      var that = this
      $(target).fadeOut(function () {
        $(fadeInTarget).fadeIn()
        if ($(fadeInTarget)[0] === $(that.$open)[0]) {
          $(slideDownTarget).hide()
        } else {
          $(slideDownTarget).show()
        }
      })
    },
    clickEvent: function () {
      var that = this
      this.$open.click(function () {
        that.handler($(this), that.$close, that.$content)
      })
      this.$close.click(function () {
        that.handler($(this), that.$open, that.$content)
      })
    },
  }

  // Right nav click
  var rightNav = {
    $target: $('#navContact'),
    handler: function () {
      var $box = $('#navContact').children()
      if ($box.is(':visible')) {
        $box.fadeOut(100)
      }
    },
    clickEvent: function () {
      var that = this
      var $box = this.$target.children()

      document.addEventListener(
        'touchstart',
        function (e) {
          if ($box.is(':visible')) {
            $box.fadeOut(100)
          } else if (e.target.id === that.$target.get(0).id) {
            $box.fadeIn(100)
          }
        },
        false
      )

      $(window).scroll(throttle(that.handler, 600, true))
    },
  }

  // Right Nav of toTop
  var toTopHandler = function (target) {
    var minHeight = $(window).height() / 2
    var handler = function () {
      var s = $(this).scrollTop()
      if (s > minHeight) {
        $(target).slideDown(100)
      } else {
        $(target).slideUp(100)
      }
    }

    handler()

    $(window).scroll(throttle(handler, 600, true))

    $(target).click(function () {
      $('html, body').animate({ scrollTop: 0 }, 600)
    })
  }

  return {
    copyrightYear: copyrightYear.handler(),
    headerNavEvent: function () {
      return headerNav.clickEvent()
    },
    rightNavEvent: function () {
      return rightNav.clickEvent()
    },
    toTopEvent: function (target) {
      return toTopHandler(target)
    },
  }
})()

function throttle(fn, delay, immediate, debounce) {
  var curr = +new Date(),
    last_call = 0,
    last_exec = 0,
    timer = null,
    diff,
    context,
    args,
    exec = function () {
      last_exec = curr
      fn.apply(context, args)
    }
  return function () {
    curr = +new Date()
    ;(context = this), (args = arguments), (diff = curr - (debounce ? last_call : last_exec) - delay)
    clearTimeout(timer)
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay)
      } else if (diff >= 0) {
        exec()
      }
    } else {
      if (diff >= 0) {
        exec()
      } else if (immediate) {
        timer = setTimeout(exec, -diff)
      }
    }
    last_call = curr
  }
}

function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this,
      args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
```
