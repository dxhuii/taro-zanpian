import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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
// import Modal from '@/components/Modal'
// import Sign from '@/components/Sign'
import A from '@/components/A'

import { isNumber, formatPic, globalData } from '@/utils'

console.log(globalData)

// import './style.scss'

@connect(
  state => ({
    info: getDetail(state, globalData.extraData.id),
    userinfo: getUserInfo(state),
    cmScore: getScore(state, globalData.extraData.id)
  }),
  dispatch => ({
    detail: bindActionCreators(detail, dispatch),
    like: bindActionCreators(like, dispatch),
    score: bindActionCreators(score, dispatch),
    hits: bindActionCreators(hits, dispatch)
  })
)
class Bangumi extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    detail: PropTypes.func.isRequired,
    score: PropTypes.func.isRequired,
    sid: PropTypes.number,
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

  componentDidMount() {
    console.log(this.$router)
    const {
      params: { id }
    } = this.$router
    const {
      info,
      detail,
      score,
      sid = 1,
      userinfo: { userid },
      cmScore,
      hits
    } = this.props
    if (!info || !info.data) {
      detail({ id })
    }
    if (!cmScore || !cmScore.data) {
      score({ id, sid, uid: userid })
    }
    hits({ id, sid })
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

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  onType = isSign => {
    this.setState({
      isSign,
      visible: true
    })
  }

  closeModal = () => {
    this.setState({
      visible: false
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
    const { visible, isSign } = this.state
    const {
      params: { id }
    } = this.$router
    const {
      info: { data = {}, loading },
      userinfo: { userid },
      cmScore = {},
      score
    } = this.props
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
      <View>
        <div className='warp-bg'>
          <div className='detail'>
            <div className='detail-blur' style={{ backgroundImage: `url(${rePic})` }} />
            <div className='detail-con' className='wp clearfix'>
              <div className='detail-pic'>{pic ? <img src={rePic} /> : null}</div>
              <div className='detail-info'>
                <div className='detial-title'>
                  <h1>{title}</h1>
                  <span>
                    <Link to={`/type/${this.getName(cid)}/-/-/-/-/-/-/`}>{listName}</Link>
                    {mcid.length > 0
                      ? mcid.map(item =>
                          item.title ? (
                            <Link key={item.id} to={`/type/${this.getName(cid)}/${item.id}/-/-/-/-/-/`}>
                              {item.title}
                            </Link>
                          ) : null
                        )
                      : null}
                  </span>
                </div>
                {aliases ? <p>别名：{aliases}</p> : null}
                <ul className='detail-info__count'>{/* <li>热度<span>{hits}</span></li> */}</ul>
                {filmtime || status || total ? (
                  <p>
                    {filmtime ? <span>{filmtime} 播出</span> : <span>{year}年</span>}
                    {isNumber(status) ? <span> 更新至{status}话</span> : <span> {status}</span>}
                    {tvcont ? <span>，{tvcont}</span> : null}
                    {total ? <span>，共{total}话</span> : null}
                  </p>
                ) : null}
                <p>
                  {language ? <span style={{ marginRight: 30 }}>语言：{language}</span> : null}
                  {area ? <span>地区：{area}</span> : null}
                </p>
                <p className='detail-update'>更新时间：{updateDate}</p>
                <div className='detail-tool'>
                  <div className={`detail-tool__on ${remindid ? 'active' : ''}`} onClick={() => this.addMark('remind', id, cid, userid)}>
                    <i className='iconfont'>&#xe6bd;</i>
                    {remindid ? '已追番' : '追番'}
                  </div>
                  <div className={`detail-tool__on ${loveid ? 'active' : ''}`} onClick={() => this.addMark('love', id, cid, userid)}>
                    <i className='iconfont'>&#xe66a;</i>
                    {loveid ? '已收藏' : '收藏'}
                  </div>
                </div>
              </div>
              {/* {star ? (
                <div className="detail-score">
                  <Tating data={star} id={id} uid={userid} sid={1} score={score} />
                </div>
              ) : null} */}
            </div>
          </div>
          <div className='detail-nav'>
            <div className='wp'>
              <ul>
                <li className='active'>
                  <a>作品详情</a>
                </li>
                {newsTextlist.length || newsPiclist.length ? (
                  <li>
                    <A url={`/subject/${id}/news`}><Text>新闻花絮</Text></A>
                  </li>
                ) : null}
                {actorId ? (
                  <li>
                    <a>演员角色</a>
                  </li>
                ) : null}
                {storyId ? (
                  <li>
                    <A url={`/episode/${storyId}`}><Text>分集剧情</Text></A>
                  </li>
                ) : null}
                <li>
                  <A url={`/time/${id}`}><Text>播出时间</Text></A>
                </li>
                <View onClick={this.copyPan.bind(this, pan)}><Text>网盘下载</Text></View>
              </ul>
            </div>
          </div>
        </div>
        <PlayList vid={id} />
        <div className='mt20 clearfix wp' className='detail-bottom'>
          <div className='fl box pb20 left'>
            {newsTextlist.length > 0 ? (
              <div className='mt10'>
                <div className='title'>
                  <h2>预告片·OP·ED·BGM·MAD·CM·特典 · · · · · ·</h2>
                </div>
                <NewsText data={newsTextlist} />
              </div>
            ) : null}
            {content ? (
              <div className='mt10'>
                <div className='title'>
                  <h2>简介</h2>
                </div>
                <div className='detail-content' className='mt10'>
                  {content}
                </div>
              </div>
            ) : null}
            {storyId && storylist.length > 0 ? (
              <div className='ep'>
                <div className='title'>
                  <h2>分集剧情</h2>
                </div>
                <EpList vid={storyId} data={storylist} />
              </div>
            ) : null}
            {newsPiclist.length > 0 ? (
              <div className="mt10">
                <div className="title">
                  <h2>新闻花絮</h2>
                </div>
                <NewsPic data={newsPiclist} />
              </div>
            ) : null}
            <div className={`${!(newsTextlist.length > 0 && storyId && newsPiclist.length > 0) ? 'mt10' : 'mt20'}`}>
              <div className='title'>
                <h2>相关动漫</h2>
              </div>
              {id && actor.length > 0 ? <DetailActor actor={actor.map(item => item.title).join(',')} no={id} /> : null}
            </div>
            <div className='mt20'>
              <div className='title'>
                <h2>评论</h2>
              </div>
              <Comment data={comment} />
            </div>
          </div>
        </div>
        {/* <Modal visible={visible} showModal={this.showModal} closeModal={this.closeModal}>
          <Sign isSign={isSign} onType={val => this.onType(val)} />
        </Modal> */}
      </View>
    )
  }
}

export default Bangumi
