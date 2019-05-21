import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'

import { playerLoad, getPlayUrl } from '@/store/actions/player'
import { digg } from '@/store/actions/mark'
import { hits } from '@/store/actions/hits'
import { addplaylog } from '@/store/actions/history'
import { getPlayerList } from '@/store/reducers/player'
import { getUserInfo } from '@/store/reducers/user'

import PlayList from '@/components/PlayList'
import DetailActor from '@/components/DetailActor'
import A from '@/components/A'
import Ar from '@/components/Ar'

import '@/utils/base64.min'
import authcode from '@/utils/authcode'
import playing from '@/utils/play'

import './style.scss'

@connect(
  (state, props) => ({
    userinfo: getUserInfo(state),
    player: state.player
  }),
  dispatch => ({
    playerLoad: bindActionCreators(playerLoad, dispatch),
    digg: bindActionCreators(digg, dispatch),
    addplaylog: bindActionCreators(addplaylog, dispatch),
    hits: bindActionCreators(hits, dispatch),
    getPlayUrl: bindActionCreators(getPlayUrl, dispatch)
  })
)
class Play extends Component {
  constructor(props) {
    super(props)
    this.state = {
      play: '',
      type: '',
      title: '',
      subTitle: '',
      playHtml: '',
      up: 0,
      down: 0,
      mInfo: {},
      list: []
    }
  }

  static propTypes = {
    playerLoad: PropTypes.func,
    digg: PropTypes.func,
    addplaylog: PropTypes.func,
    hits: PropTypes.func,
    player: PropTypes.object,
    match: PropTypes.object,
    userinfo: PropTypes.object
  }

  async componentDidMount() {
    const {
      params: { id, pid }
    } = this.$router
    const { player, playerLoad, hits } = this.props
    hits({ id, sid: 1 })
    // debugger
    if (!player[`${id}-${pid}`] || !player[`${id}-${pid}`].data) {
      let [, data] = await playerLoad({ id, pid })
      this.setState({
        up: data.data.up,
        down: data.data.down
      })
      if (data) {
        this.addHistory() // 增加观看记录
        this.getData()
      }
    } else {
      this.getData()
      this.addHistory() // 增加观看记录
      this.setState({
        up: data.data.up,
        down: data.data.down
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      play: ''
    })
  }

  async addHistory() {
    const {
      params: { id, pid }
    } = this.$router
    const {
      userinfo: { userid },
      player: { data = {} },
      addplaylog
    } = this.props
    const { title, subTitle, count = 0 } = data
    if (userid && title) {
      let [, data] = await addplaylog({
        uid: userid,
        vod_id: id,
        vod_pid: pid,
        vod_sid: 0,
        vod_name: title,
        url_name: subTitle,
        vod_maxnum: count
      })
      console.log(data)
    } else if (title) {
      let dataList = JSON.parse(Taro.getStorageSync('historyData') || '[]')
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          const obj = JSON.parse(dataList[i])
          if (parseInt(obj.vid) === parseInt(id)) {
            dataList.splice(i, 1)
          }
        }
      }
      if (dataList.length > 10) {
        dataList.pop()
      }
      dataList.unshift(
        JSON.stringify({
          vid: id,
          pid,
          title,
          name: subTitle,
          next: +pid < count ? +pid + 1 : 0
        })
      )
      Taro.setStorageSync('historyData', JSON.stringify([...new Set([...dataList])]))
    }
  }

  onPlay(play, type) {
    this.setState({ play, type }, () => this.getData())
  }

  getOther(data = []) {
    return data.filter(item => item.playName === 'other')
  }

  async getData() {
    const {
      params: { id, pid }
    } = this.$router
    const { player, getPlayUrl } = this.props
    const data = (player[`${id}-${pid}`] || {}).data || {}
    const { play, type } = this.state
    const { list = [], key } = data
    const other = this.getOther(list) || {}
    const danmu = `${id}_${pid}`
    const isA = other.length > 0
    const { playName, vid, playTitle } = isA ? other[0] : list[0]
    let playData = ''
    if (play) {
      playData = playing(type, authcode(atob(play), 'DECODE', key, 0))
    } else {
      playData = playing(playName, authcode(atob(vid), 'DECODE', key, 0))
    }
    const mInfo = { playName, vid, playTitle }
    console.log(play, playData, isA, 'getdata')
    if (/yunpan|360|s360|ksyun|mp4/.test(playData.type)) {
      let [err, data] = await getPlayUrl({ type: playData.type, name: playData.url })
      this.setState({
        url: data.data
      })
    } else {
      this.setState({
        url: playData.url
      })
    }
    this.setState({
      type: playData.type,
      mInfo,
      danmu
    })
  }

  async onDigg(type, id) {
    const { digg } = this.props
    let [, res] = await digg({ type, id })
    if (res.rcode === 1) {
      const num = res.data.split(':')
      this.setState({
        up: num[0],
        down: num[1]
      })
      Taro.showToast({ title: res.msg })
    }
  }

  onShareAppMessage(res) {
    const {
      info: { data = {} }
    } = this.props
    const {
      params: { id, pid }
    } = this.$router
    const { title, pic = '', subTitle } = data
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: `${title} ${subTitle}`,
      imageUrl: pic,
      path: `/pages/play/index?id=${id}&pid=${pid}`
    }
  }

  copy(data) {
    Taro.setClipboardData({
      data,
      success(res) {
        console.log(res)
      }
    })
  }

  render() {
    const {
      params: { id, pid }
    } = this.$router
    const { player } = this.props
    const data = (player[`${id}-${pid}`] || {}).data || {}
    const { type, url, up, down, mInfo } = this.state
    const { listName, listId, listNameBig, list = [], pan, actor = '', prev, next, mcid = [] } = data
    return (
      <Block>
        <View className='player'>
          <View className='wp pt20'>
            <View className='player-box'>
              {type === 'http' ? (
                <View onClick={this.copy.bind(this, url)}>
                  <Text>播放地址已经生成，点击复制，使用浏览器打开观看</Text>
                </View>
              ) : (
                <Video style={{ width: '100%', height: '100%' }} src={url} poster='https://ww1.sinaimg.cn/large/87c01ec7gy1fqhvm91iodj21hc0u046d.jpg' />
              )}
            </View>
            <View className='player-info'>
              <View className='player-title'>
                <A url={`/pages/subject/index?id=${id}`}>
                  <Text>
                    {data.title} {data.subTitle}
                  </Text>
                </A>
              </View>
              <View className='playlist'>
                {list.map(item => (
                  <View key={item.playName} onClick={() => this.onPlay(item.vid, item.playName)}>
                    <Text className={`playicon ${item.playName}`} />
                    <Text>{item.playTitle}</Text>
                  </View>
                ))}
              </View>
              <View className='play-name'>
                <Text className={`playicon ${mInfo.playName}`} />
                <Text>{mInfo.playTitle}</Text>
              </View>
              <View className='play-next'>
                {prev && (
                  <Ar url={`/pages/play/index?id=${id}&pid=${prev}`}>
                    <Text className='iconfont'>&#xe658;</Text>
                  </Ar>
                )}
                {next && (
                  <Ar url={`/pages/play/index?id=${id}&pid=${next}`}>
                    <Text className='iconfont'>&#xe65a;</Text>
                  </Ar>
                )}
              </View>
            </View>
            <View className='play-tool'>
              <View className='digg' onClick={() => this.onDigg('up', id)}>
                <Text className='iconfont'>&#xe607;</Text>
                <Text>{up}</Text>
              </View>
              <View className='digg' onClick={() => this.onDigg('down', id)}>
                <Text className='iconfont'>&#xe606;</Text>
                <Text>{down}</Text>
              </View>
              <View className='mcid'>
                {mcid.map((item, index) => {
                  return item.title && index < 3 ? (
                    <Text className='text' key={item.id}>
                      {item.title}
                    </Text>
                  ) : null
                })}
                {pan && (
                  <Text className='text' onClick={this.copy.bind(this, pan)}>
                    网盘下载
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <PlayList vid={id} pid={pid} />
        <View className='play-title mt20'>
          <Text>相关动漫</Text>
        </View>
        {id ? <DetailActor actor={actor} no={id} /> : null}
      </Block>
    )
  }
}

export default Play
