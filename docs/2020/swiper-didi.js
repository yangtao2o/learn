// https://www.didiglobal.com/

;(this.swiperInstance = new C('.home-content', {
  direction: 'vertical',
  autoHeight: !0,
  speed: 800,
  noSwiping: !0,
  mousewheel: {
    releaseOnEdges: !0,
    eventsTarged: '.swiper-wrapper.home-page-swiper',
  },
  simulateTouch: !1,
  forceToAxis: !0,
  preloadImages: !1,
  preventIntercationOnTransition: !0,
  on: {
    init: function () {
      window.addEventListener('wheel', e.controlMousewheel, !1),
        window.addEventListener('touchend', e.controlMousewheel, !1),
        e.setState(
          {
            isLoading: !1,
          },
          function () {
            if (!window.gtag || !window.didiOpenTime) return !1
            var e = new Date() - window.didiOpenTime
            window.gtag('event', 'timing_complete', {
              name: 'homepage',
              value: e,
              event_category: 'website-usable',
            })
          }
        )
    },
    onSlideChangeEnd: function () {
      this.update()
    },
    slideChange: function () {
      var t = this.activeIndex,
        i = {
          differBg: !1,
          activeIndex: t,
        },
        n = !1
      ;(2 !== t && 5 !== t) || (i.differBg = !0),
        0 === t ? ((i.firstCopyright = !0), (n = !0)) : 2 === t || (i.firstCopyright = !1),
        e.setState(i),
        setTimeout(function () {
          n !== e.showOne &&
            e.setState({
              showOne: n,
            })
        }, 400)
    },
  },
})),
  (this.swiperFooter = new C('.swiper-footer', {
    direction: 'vertical',
    slidesPerView: 'auto',
    mousewheel: !0,
    freeMode: !0,
    freeModeMomentumVelocityRatio: 1,
    nested: !0,
    freeModeMomentumBounce: !1,
  }))
