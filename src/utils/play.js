const tudou = pv => {
  const data = pv.split(',')
  const len = data.length
  if (len === 1) {
    youku(pv)
  } else if (len === 2) {
    return '/'
  } else if (len >= 3) {
    youku(data[2])
  }
}

const youku = pv => {
  const data = pv.split(',')
  return `https://v.youku.com/v_show/id_${data.length === 3 ? data[2] : pv}.html`
}
const iqiyi = pv => {
  const plus = '&tvid='
  const data = pv.split(/,|&tvid=|_/)
  const vid = pv.indexOf(',') !== -1 || pv.indexOf('_') !== -1 ? data[1] + plus + data[0] : data[0] + plus + data[1]
  return `https://m.iqiyi.com/shareplay.html?vid=${vid}&coop=coop_117_9949&cid=qc_105102_300452&bd=1&autoplay=1&fullscreen=1`
}
const letv = pv => {
  const data = pv.split(',')
  return data.length === 2 ? '/' : 'https://www.le.com/ptv/vplay/' + data[0] + '.html'
}
const sohu = pv => {
  return 'https://tv.sohu.com/upload/static/share/share_play.html#' + pv.split('_')[0]
}
const pptv = pv => {
  return 'https://m.pptv.com/show/' + pv.split(',')[0] + '.html'
}
const qq = pv => {
  return 'https://v.qq.com/iframe/player.html?vid=' + pv + '&tiny=0&auto=1'
}
const bilibili = pv => {
  const data = pv.split(',')
  return pv.indexOf('http') !== -1 ? pv : data.length === 2 ? 'https://www.bilibili.com/video/av' + data[0] + '/?p=' + data[1] : 'https://www.bilibili.com/video/av' + pv + '/'
}
const acfun = pv => {
  let vid = ''
  let data = []
  if (pv.indexOf('ab') !== -1) {
    data = pv.split('ab')
    const ab = data[1].split(',')
    if (ab.length === 2) {
      vid = ab[0] + '_' + ab[1]
    } else {
      vid = data[1]
    }
  } else {
    data = pv.split(',')
    const len = data.length
    if (len === 2) {
      vid = data[0] + '_' + data[1]
    } else {
      vid = pv
    }
  }
  return 'https://m.acfun.cn/v/?' + (pv.indexOf('ab') !== -1 ? 'ab' : 'ac') + '=' + vid
}

const jump = (name, pv) => {
  let url = ''
  switch (name) {
    case 'youku':
      url = youku(pv)
      break
    case 'tudou':
      url = tudou(pv)
      break
    case 'iqiyi':
      url = iqiyi(pv)
      break
    case 'viqiyi':
      url = iqiyi(pv)
      break
    case 'letv':
      url = letv(pv)
      break
    case 'sohu':
      url = sohu(pv)
      break
    case 'pptv':
      url = pptv(pv)
      break
    case 'qq':
      url = qq(pv)
      break
    case 'bilibili':
      url = bilibili(pv)
      break
    case 'acfun':
      url = acfun(pv)
      break
    default:
      url = pv
      break
  }
  return url
}

const isPlay = (name, pv) => {
  let url = '',
    type = ''
  const playStyle = /acku|sina|letvsaas|weibo|miaopai|letvyun|bit/.test(name)
  if (playStyle) {
    url = '/'
    type = 'http'
  } else if (name === 'full') {
    url = pv.replace('http://', 'https://').replace('ikanfan.cn', 'acgnz.cn')
    type = 'http'
  } else {
    if (/.mp4|.m3u8/.test(pv)) {
      url = pv
      type = 'mp4'
    } else if (name === 'qqq') {
      url = `https://quan.qq.com/video/1098_${pv}`
      type = 'mp4'
    } else if (name === 'yunpan') {
      url = pv
      type = 'yunpan'
    } else if (/.html|.shtml|.htm|https:\/\/|http:\/\//.test(pv)) {
      url = pv
      type = 'http'
    } else if (/bilibili|acfun|youku|tudou|iqiyi|pptv|letv|qq|sohu|viqiyi/.test(name)) {
      url = jump(name, pv)
      type = 'http'
    } else {
      url = pv
      type = 'http'
    }
  }
  return { url, type }
}

export default (playname, vid) => {
  let name = playname
  let pv = vid
  if (pv.indexOf('@@') !== -1) {
    const data = pv.split('@@')
    name = data[1]
    pv = data[0]
  }
  return isPlay(name, pv)
}
