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
import Modal from '@/components/Modal'
import Sign from '@/components/Sign'

import { isNumber, formatPic } from '@/utils'

import './style.scss'

@connect(
  (state, props) => ({
    info: getDetail(state, props.match.params.id),
    userinfo: getUserInfo(state),
    cmScore: getScore(state, props.match.params.id, 1, getUserInfo(state).userid || 0)
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
    match: PropTypes.object.isRequired,
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
    const {
      match: {
        params: { id }
      },
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

  onShareAppMessage (res) {
    const {
      info: { data = {} }
    } = this.props
    const {
      id,
      title,
      pic = '',
    } = data
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      imageUrl: pic,
      path: `/pages/play?id=${id}`
    }
  }

  render() {
    const { visible, isSign } = this.state
    const {
      info: { data = {}, loading },
      match: { url },
      userinfo: { userid },
      cmScore = {},
      score
    } = this.props
    const {
      id,
      cid,
      title,
      content = '',
      listName,
      listNameBig,
      pic = '',
      actor,
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
        <div className="warp-bg">
          <div styleName="detail">
            <div styleName="detail-blur" style={{ backgroundImage: `url(${rePic})` }} />
            <div styleName="detail-con" className="wp clearfix">
              <div styleName="detail-pic">{pic ? <img src={rePic} /> : null}</div>
              <div styleName="detail-info">
                <div styleName="detial-title">
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
                <ul styleName="detail-info__count">{/* <li>热度<span>{hits}</span></li> */}</ul>
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
                <p styleName="detail-update">更新时间：{updateDate}</p>
                <div styleName="detail-tool">
                  <div styleName={`detail-tool__on ${remindid ? 'active' : ''}`} onClick={() => this.addMark('remind', id, cid, userid)}>
                    <i className="iconfont">&#xe6bd;</i>
                    {remindid ? '已追番' : '追番'}
                  </div>
                  <div styleName={`detail-tool__on ${loveid ? 'active' : ''}`} onClick={() => this.addMark('love', id, cid, userid)}>
                    <i className="iconfont">&#xe66a;</i>
                    {loveid ? '已收藏' : '收藏'}
                  </div>
                </div>
              </div>
              {star ? (
                <div styleName="detail-score">
                  <Tating data={star} id={id} uid={userid} sid={1} score={score} />
                </div>
              ) : null}
            </div>
          </div>
          <div styleName="detail-nav">
            <div className="wp">
              <ul>
                <li styleName="active">
                  <a>作品详情</a>
                </li>
                {newsTextlist.length || newsPiclist.length ? (
                  <li>
                    <Link to={`/subject/${id}/news`}>新闻花絮</Link>
                  </li>
                ) : null}
                {actorId ? (
                  <li>
                    <a>演员角色</a>
                  </li>
                ) : null}
                {storyId ? (
                  <li>
                    <Link to={`/episode/${storyId}`}>分集剧情</Link>
                  </li>
                ) : null}
                <li>
                  <Link to={`/time/${id}`}>播出时间</Link>
                </li>
                <li>
                  <a href={pan} target="_blank" rel="noopener noreferrer">
                    网盘下载
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <PlayList key="playlist" />
        <div className="mt20 clearfix wp" styleName="detail-bottom">
          <div className="fl box pb20 left">
            {newsTextlist.length > 0 ? (
              <div className="mt10">
                <div styleName="title">
                  <h2>预告片·OP·ED·BGM·MAD·CM·特典 · · · · · ·</h2>
                </div>
                <NewsText data={newsTextlist} />
              </div>
            ) : null}
            {content ? (
              <div className="mt10">
                <div styleName="title">
                  <h2>简介</h2>
                </div>
                <div styleName="detail-content" className="mt10">
                  {content}
                </div>
              </div>
            ) : null}
            {storyId && storylist.length > 0 ? (
              <div styleName="ep">
                <div styleName="title">
                  <h2>分集剧情</h2>
                </div>
                <EpList id={storyId} data={storylist} />
              </div>
            ) : null}
            {newsPiclist.length > 0 ? (
              <div className="mt10">
                <div styleName="title">
                  <h2>新闻花絮</h2>
                </div>
                <NewsPic data={newsPiclist} />
              </div>
            ) : null}
            <div className={`${!(newsTextlist.length > 0 && storyId && newsPiclist.length > 0) ? 'mt10' : 'mt20'}`}>
              <div styleName="title">
                <h2>相关动漫</h2>
              </div>
              {id ? <DetailActor actor={actor ? actor.map(item => item.title).join(',') : ''} no={id} /> : null}
            </div>
            <div className="mt20">
              <div styleName="title">
                <h2>评论</h2>
              </div>
              <Comment data={comment} />
            </div>
          </div>
        </div>
        <Modal visible={visible} showModal={this.showModal} closeModal={this.closeModal}>
          <Sign isSign={isSign} onType={val => this.onType(val)} />
        </Modal>
      </View>
    )
  }
}

const Bangumis = props => {
  const {
    match: {
      params: { id }
    }
  } = props
  return <Bangumi {...props} key={id} />
}

Bangumis.propTypes = {
  match: PropTypes.object
}

export default Bangumis
