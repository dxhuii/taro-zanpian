import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'

import { playerLoad, yunpan } from '@/store/actions/player'
import { digg } from '@/store/actions/mark'
import { hits } from '@/store/actions/hits'
import { addplaylog } from '@/store/actions/history'
import { getPlayerList } from '@/store/reducers/player'
import { getUserInfo } from '@/store/reducers/user'

import PlayList from '@/components/PlayList'
import DetailActor from '@/components/DetailActor'

import { globalData } from '@/utils'
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
    yunpan: bindActionCreators(yunpan, dispatch)
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
      if (data) {
        this.addHistory() // 增加观看记录
        this.getData()
      }
    } else {
      this.getData()
      this.addHistory() // 增加观看记录
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
    const { player, yunpan } = this.props
    const data = (player[`${id}-${pid}`] || {}).data || {}
    const { play, type } = this.state
    const { list = [] } = data
    const other = this.getOther(list) || {}
    const danmu = `${id}_${pid}`
    const isA = other.length > 0
    const { playName, vid, playTitle } = isA ? other[0] : list[0]
    let playData = ''
    if (play) {
      playData = playing(type, play)
    } else {
      playData = playing(playName, vid)
    }
    const mInfo = { playName, vid, playTitle }
    console.log(play, playData, isA, 'getdata')
    if (playData.type === 'yunpan') {
      let [err, data] = await yunpan({ name: playData.url })
      this.setState({
        url: data
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

  getName(id) {
    let name = ''
    switch (id) {
      case 201:
        name = 'tv'
        break
      case 202:
        name = 'ova'
        break
      case 203:
        name = 'juchang'
        break
      case 4:
        name = 'tebie'
        break
      case 204:
        name = 'zhenren'
        break
      case 35:
        name = 'qita'
        break
      default:
        name = 'list'
        break
    }
    return name
  }

  async onDigg(type, id) {
    const { digg } = this.props
    let [, res] = await digg({ type, id })
    if (res.rcode === 1) {
      const num = res.data.split(':')
      this.up.querySelectorAll('span')[0].innerText = num[0]
      this.down.querySelectorAll('span')[0].innerText = num[1]
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

  render() {
    const {
      params: { id, pid }
    } = this.$router
    const { player } = this.props
    const data = (player[`${id}-${pid}`] || {}).data || {}
    const { type, url, mInfo } = this.state
    const { listName, listId, listNameBig, list = [], pic, title, pan, subTitle, actor = '', up, down, prev, next, mcid = [] } = data
    return (
      <Block>
        <View className='player'>
          <View className='wp pt20'>
            <View className='player-box'>
                --{url} {type}--
                <Video
                  src={url}
                  controls={true}
                  autoplay={false}
                  poster='https://ww1.sinaimg.cn/large/87c01ec7gy1fqhvm91iodj21hc0u046d.jpg'
                  initialTime='0'
                  id='video'
                  loop={false}
                  muted={false}
                />
            </View>
            <View className='player-info'>
              <View className='player-title'>
                <h1>
                  <Link to={`/subject/${id}`}>{title}</Link>：
                </h1>
                <h4>{subTitle}</h4>
              </View>
              <View className='playlist'>
                {list.map(item => (
                  <li key={item.playName} onClick={() => this.onPlay(item.vid, item.playName)}>
                    <i className={`playicon ${item.playName}`} />
                    {item.playTitle}
                  </li>
                ))}
              </View>
              <div className='m-play-name'>
                <i className={`playicon ${mInfo.playName}`} />
                {mInfo.playTitle}
              </div>
              <div className='play-next'>
                {prev ? <Link to={`/play/${id}/${prev}`}>上一集</Link> : null}
                {next ? <Link to={`/play/${id}/${next}`}>下一集</Link> : null}
              </div>
            </View>
            <View className='play-tool'>
              <View className='digg' onClick={() => this.onDigg('up', id)} ref={e => (this.up = e)}>
                <i className='iconfont'>&#xe607;</i>
                <span>{up}</span>
              </View>
              <View className='digg' onClick={() => this.onDigg('down', id)} ref={e => (this.down = e)}>
                <i className='iconfont'>&#xe606;</i>
                <span>{down}</span>
              </View>
              <View className='mcid'>
                {mcid.map(item => {
                  return item.title ? (
                    <Link key={item.id} to={`/type/${this.getName(listId)}/${item.id}/-/-/-/-/-/`}>
                      {item.title}
                    </Link>
                  ) : null
                })}
                {pan ? (
                  <a href={pan} target='_blank' rel='noopener noreferrer'>
                    网盘下载
                  </a>
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <PlayList vid={id} pid={pid} />
        {/* <div className='wp clearfix'>
          <div className='fl left box'>
            <div className='mt20'>
              <div className='title'>
                <h2>相关动漫</h2>
              </div>
              {id ? <DetailActor actor={actor} no={id} /> : null}
            </div>
          </div>
        </div> */}
      </Block>
    )
  }
}

export default Play
