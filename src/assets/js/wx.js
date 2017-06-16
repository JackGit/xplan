import { IMAGE_URLS } from '@/assets/js/constants'
const JSAPI_CONFIG_URL = 'http://wx-service.yotta-tech.cn/jsapi/config'

export function initWX () {
  fetch(`${JSAPI_CONFIG_URL}?url=${encodeURIComponent(window.location.href)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    mode: 'cors'
  }).then(
    r => r.json()
  ).then(r => {
    configWX(r.appId, r.timestamp, r.nonceStr, r.signature)
  })
}

export function configWX (appId, timestamp, nonceStr, signature) {
  window.wx.config({
    debug: false,
    appId: appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
  })

  setShareInfo()
}

export function setShareInfo () {
  let title = '地球上最漂亮的H5'
  let link = 'http://xplan.jackyang.me'
  let imgUrl = IMAGE_URLS.wxShareImg
  let wx = window.wx

  wx.ready(() => {
    wx.onMenuShareTimeline({
      title,
      link,
      imgUrl
    })

    wx.onMenuShareAppMessage({
      title,
      desc: '这不是xplan官方链接，是来自外籍杰克的最强山寨版 -_-',
      link,
      imgUrl
    })
  })
}
