import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { episode } from '@/store/actions/episode'
import { getEpisode } from '@/store/reducers/episode'
import { hits } from '@/store/actions/hits'

import A from '@/components/A'
import Ar from '@/components/Ar'

import './style.scss'

@connect(
  (state, props) => ({
    info: state.episode
  }),
  dispatch => ({
    episode: bindActionCreators(episode, dispatch),
    hits: bindActionCreators(hits, dispatch)
  })
)
class Episode extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  static propTypes = {
    episode: PropTypes.func,
    info: PropTypes.object,
    hits: PropTypes.func
  }

  componentDidMount() {
    const {
      params: { id, p = 0 }
    } = this.$router
    const { episode, hits, info } = this.props
    if (!(info[`${id}${p ? `-${p}` : ''}`] || {}).data) {
      episode({ id, p })
    }
    hits({ id, sid: 4 })
  }

  epMore = () => {
    this.setState({
      epMore: !this.state.epMore
    })
  }

  showList(id, num, p) {
    let list = []
    for (let i = 1; i <= num; i++) {
      const link = <A url={`/pages/episode/${id}/${i}`}>{`${i}集`}</A>
      list.push(
        +p === i ? (
          <li key={i} styleName='active'>
            {link}
          </li>
        ) : (
          <li key={i}>{link}</li>
        )
      )
    }
    return list.map(item => item)
  }

  onShareAppMessage(res) {
    const {
      params: { id, p = 0 }
    } = this.$router
    const { info } = this.props
    const dataSource = (info[`${id}${p ? `-${p}` : ''}`] || {}).data || {}
    const { title, pic = '', name } = dataSource
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: !p ? `#${vTitle}#剧情(共${storyNum}集)_${vTitle}全集剧情` : `#${vTitle}#${name}${title ? ` ${title}` : ''}剧情_${vTitle}分集剧情`,
      imageUrl: pic,
      path: !p ? `/pages/episode/index?id=${id}` : `/pages/episode/index?id=${id}&p=${p}`
    }
  }

  render() {
    const {
      params: { id, p = 0 }
    } = this.$router
    const { info } = this.props
    const dataSource = (info[`${id}${p ? `-${p}` : ''}`] || {}).data || {}
    const { title, name, content, prev, next, vid, id, vTitle, gold, pic, storyNum, vContent, actor, year, status, mcid, pid } = dataSource
    return (
      <View styleName='article-body'>
        <View>
          <A url={`/pages/subject/index?id=${vid}`}>{vTitle}</A> {name} {title}
        </View>
        <View styleName='article-content' className='clearfix'>
          {((!p ? vContent : content) || '').replace('&nbsp; ', '').replace('&nbsp; ', '')}
        </View>
        <A url={`/pages/search/index?keyword=${vTitle}`}>#{vTitle}</A>
        {!p && storyNum <= 1 ? null : (
          <View styleName='article-context' className='mt10'>
            {prev && prev > 0 ? <Ar url={`/pages/episode/index?id=${id}&p=${prev}`}>上一集</Ar> : null}
            {next ? <Ar url={`/pages/episode/index?id=${id}&p=${next}`}>下一集</Ar> : null}
          </View>
        )}
      </View>
    )
  }
}

export default Episode
