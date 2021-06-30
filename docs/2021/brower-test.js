function getBrowser() {
  var u = navigator.userAgent

  var bws = [
    {
      name: 'sgssapp',
      it: /sogousearch/i.test(u),
    },
    {
      name: 'wechat',
      it: /MicroMessenger/i.test(u),
    },
    {
      name: 'weibo',
      it: !!u.match(/Weibo/i),
    },
    {
      name: 'uc',
      it: !!u.match(/UCBrowser/i) || u.indexOf(' UBrowser') > -1,
    },
    {
      name: 'sogou',
      it: u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
    },
    {
      name: 'xiaomi',
      it: u.indexOf('MiuiBrowser') > -1,
    },
    {
      name: 'baidu',
      it: u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
    },
    {
      name: '360',
      it: u.indexOf('360EE') > -1 || u.indexOf('360SE') > -1,
    },
    {
      name: '2345',
      it: u.indexOf('2345Explorer') > -1,
    },
    {
      name: 'edge',
      it: u.indexOf('Edge') > -1,
    },
    {
      name: 'ie11',
      it: u.indexOf('Trident') > -1 && u.indexOf('rv:11.0') > -1,
    },
    {
      name: 'ie',
      it: u.indexOf('compatible') > -1 && u.indexOf('MSIE') > -1,
    },
    {
      name: 'firefox',
      it: u.indexOf('Firefox') > -1,
    },
    {
      name: 'safari',
      it: u.indexOf('Safari') > -1 && u.indexOf('Chrome') === -1,
    },
    {
      name: 'qqbrowser',
      it: u.indexOf('MQQBrowser') > -1 && u.indexOf(' QQ') === -1,
    },
    {
      name: 'qq',
      it: u.indexOf('QQ') > -1,
    },
    {
      name: 'chrome',
      it: u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
    },
    {
      name: 'opera',
      it: u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
    },
  ]

  for (var i = 0; i < bws.length; i++) {
    if (bws[i].it) {
      return bws[i].name
    }
  }

  return 'other'
}

// 系统区分
function getOS() {
  var u = navigator.userAgent
  if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
    return 'windows'
  } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
    return 'macOS'
  } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
    return 'ios'
  } else if (!!u.match(/android/i)) {
    return 'android'
  } else {
    return 'other'
  }
}
