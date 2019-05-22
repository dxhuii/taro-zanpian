import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'

import { detail, score } from '@/store/actions/detail'
import { like } from '@/store/actions/mark'
import { hits } from '@/store/actions/hits'
import { getDetail, getScore } from '@/store/reducers/detail'
import { getUserInfo } from '@/store/reducers/user'

import Comment from '@/components/Comment'
import DetailActor from '@/components/DetailActor'
import EpList from '@/components/Subject/EpList'
import NewsPic from '@/components/Subject/NewsPic'
import NewsText from '@/components/Subject/NewsText'
import PlayList from '@/components/PlayList'
import Tating from '@/components/Tating'
import A from '@/components/A'

import { isNumber, formatPic } from '@/utils'

import './style.scss'

@connect(
  (state, props) => ({
    userinfo: getUserInfo(state),
    info: getDetail(state, props.vid),
    cmScore: getScore(state, props.vid)
  }),
  dispatch => ({
    detail: bindActionCreators(detail, dispatch),
    like: bindActionCreators(like, dispatch),
    score: bindActionCreators(score, dispatch),
    hits: bindActionCreators(hits, dispatch)
  })
)
class Detail extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    detail: PropTypes.func.isRequired,
    score: PropTypes.func.isRequired,
    userinfo: PropTypes.object,
    cmScore: PropTypes.object,
    hits: PropTypes.func,
    isMeta: PropTypes.any,
    like: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      isSign: 'signIn'
    }
  }

  async componentDidMount() {
    console.log(this.props)
    const { vid } = this.props
    const {
      info,
      detail,
      score,
      userinfo: { userid },
      cmScore,
      hits
    } = this.props
    if (!info || !info.data) {
      detail({ id: vid })
    }
    if (!cmScore || !cmScore.data) {
      score({ id: vid, sid: 1, uid: userid })
    }
    hits({ id: vid, sid: 1 })
  }

  async addMark(type, id, cid, uid) {
    console.log(type, id, cid, uid)

    const {
      like,
      score,
      userinfo: { userid },
      cmScore
    } = this.props
    const csData = cmScore.data || {}
    const { loveid, remindid } = csData
    if (userid) {
      let [, data] = await like({ type, id, cid, uid })
      if (data.rcode === 1) {
        score({ id, sid: 1, uid })
        Taro.showToast({ title: type === 'remind' ? (remindid ? '取消追番' : '追番成功') : loveid ? '取消收藏' : '收藏成功' })
      }
    } else {
      this.setState({
        visible: true
      })
    }
  }

  onShareAppMessage(res) {
    const {
      info: { data = {} }
    } = this.props
    const { id, title, pic = '' } = data
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      imageUrl: pic,
      path: `/pages/subject/index?id=${id}`
    }
  }

  copyPan(data) {
    Taro.setClipboardData({
      data,
      success(res) {
        console.log(res)
      }
    })
  }

  render() {
    const {
      info: { data = {}, loading },
      userinfo: { userid },
      cmScore = {},
      vid,
      score
    } = this.props
    console.log(data, 'detail')
    const {
      cid,
      title,
      content = '',
      listName,
      listNameBig,
      pic = '',
      area,
      aliases,
      gold,
      filmtime,
      total,
      language = '',
      company,
      keywords,
      website,
      updateDate,
      // hits,
      tvcont,
      status,
      year,
      storyId,
      actorId,
      pan,
      actor = [],
      mcid = [],
      original = [],
      director = [],
      storylist = [],
      newsTextlist = [],
      newsPiclist = []
    } = data
    const rePic = formatPic(pic, 'orj360')
    const csData = cmScore.data || {}
    const { loveid, remindid, star, comment = [] } = csData
    if (loading) {
      Taro.showLoading()
    } else {
      Taro.hideLoading()
    }
    return (
      <Block>
        <View className='detail'>
          <View className='detail-blur' style={{ backgroundImage: `url(${rePic})` }} />
          <View className='detail-con'>
            <View className='detail-pic'>{pic ? <Image className='detail-pic__img' src={rePic} /> : null}</View>
            <View className='detail-info'>
              <View className='detial-title'>
                <View className='detial-title__h1'>{title}</View>
                <View className='detial-title__span'>
                  {area ? <Text>{area} / </Text> : null}
                  {language ? <Text>{language} / </Text> : null}
                  <Text className='detial-title__span-text'>{listName}</Text>
                  {mcid.length > 0 ? mcid.map(item => (item.title ? <Text key={item.id}>{item.title}</Text> : null)) : null}
                  {filmtime ? <Text>播出时间：{filmtime} / </Text> : <Text>{year}年 / </Text>}
                  {isNumber(status) ? <Text> 更新至{status}话 / </Text> : <Text> {status} / </Text>}
                  {tvcont ? <Text>{tvcont} / </Text> : null}
                  {total ? <Text>共{total}话</Text> : null}
                </View>
              </View>
              <div className='detail-tool'>
                <div className={`detail-tool__on ${remindid ? 'active' : ''}`} onClick={() => this.addMark('remind', vid, cid, userid)}>
                  <i className='iconfont'>&#xe6bd;</i>
                  {remindid ? '已追番' : '追番'}
                </div>
                <div className={`detail-tool__on ${loveid ? 'active' : ''}`} onClick={() => this.addMark('love', vid, cid, userid)}>
                  <i className='iconfont'>&#xe66a;</i>
                  {loveid ? '已收藏' : '收藏'}
                </div>
              </div>
            </View>
          </View>
        </View>
        <View className='detail-nav'>
          <View className='active'>
            <Text>详情</Text>
          </View>
          {newsTextlist.length || newsPiclist.length ? (
            <View>
              <A url={`/subject/${vid}/news`}>
                <Text>新闻</Text>
              </A>
            </View>
          ) : null}
          {storyId ? (
            <View>
              <A url={`/episode/${storyId}`}>
                <Text>剧情</Text>
              </A>
            </View>
          ) : null}
          <View>
            <A url={`/time/${vid}`}>
              <Text>时间</Text>
            </A>
          </View>
          {actorId ? (
            <View>
              <a>演员角色</a>
            </View>
          ) : null}
          <View onClick={this.copyPan.bind(this, pan)}>
            <Text>网盘下载</Text>
          </View>
        </View>
        <PlayList vid={vid} />
        {newsTextlist.length > 0 ? (
          <View className='detail-mt10'>
            <View className='title'>
              <Text>预告片·OP·ED·BGM·MAD·CM·特典 · · · · · ·</Text>
            </View>
            <NewsText data={newsTextlist} />
          </View>
        ) : null}
        {content ? (
          <View className='detail-mt10'>
            <View className='title'>
              <Text>简介</Text>
            </View>
            <View className='detail-content detail-mt10'>{content}</View>
          </View>
        ) : null}
        {storyId && storylist.length > 0 ? (
          <View className='ep'>
            <View className='title'>
              <Text>分集剧情</Text>
            </View>
            <EpList vid={storyId} data={storylist} />
          </View>
        ) : null}
        {newsPiclist.length > 0 ? (
          <View className='detail-mt10'>
            <View className='title'>
              <Text>新闻花絮</Text>
            </View>
            <NewsPic data={newsPiclist} />
          </View>
        ) : null}
        <View className={`${!(newsTextlist.length > 0 && storyId && newsPiclist.length > 0) ? 'detail-mt10' : 'mt20'}`}>
          <View className='title'>
            <Text>相关动漫</Text>
          </View>
          {vid && actor.length > 0 ? <DetailActor actor={actor.map(item => item.title).join(',')} no={vid} /> : null}
        </View>
        <View className='detail-mt10'>
          <View className='title'>
            <Text>评论</Text>
          </View>
          <Comment data={comment} />
        </View>
      </Block>
    )
  }
}

export default Detail
