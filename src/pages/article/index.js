import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { article } from '@/store/actions/article'
import { getArticle } from '@/store/reducers/article'
import { hits } from '@/store/actions/hits'
import A from '@/components/A'
import Ar from '@/components/Ar'

import playing from '@/utils/play'

import './style.scss'

@connect(
  (state, props) => ({
    data: state.article
  }),
  dispatch => ({
    article: bindActionCreators(article, dispatch),
    hits: bindActionCreators(hits, dispatch)
  })
)
class Article extends Component {
  static propTypes = {
    article: PropTypes.func,
    hits: PropTypes.func,
    data: PropTypes.object
  }

  async componentDidMount() {
    const {
      match: {
        params: { id }
      },
      article,
      data,
      hits
    } = this.props
    if (!data[id].data) {
      article({ id })
    }
    hits({ id, sid: 2 })
  }

  onShareAppMessage(res) {
    const {
      data: { data = {} }
    } = this.props
    const {
      params: { id }
    } = this.$router
    const { title, pic = '', name } = data
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: `${title} - ${name}`,
      imageUrl: pic,
      path: `/pages/article/index?id=${id}`
    }
  }

  render() {
    const {
      data: { data = {} }
    } = this.props
    const {
      title,
      id,
      name,
      cid,
      pic = '',
      remark,
      keywords,
      addtime,
      inputer,
      tag = [],
      prev,
      next,
      vodid,
      // newsid,
      content = '',
      playname = '',
      playurl = ''
    } = data
    const { type, url } = playing(playname, playurl)
    return (
      <View styleName='article-body'>
        <View styleName='article-head'>
          <Text>{title}</Text>
          <View styleName='article-label'>
            <Text>来源：{inputer ? inputer : '网络'}</Text>
            <Text>更新时间：{addtime}</Text>
          </View>
        </View>
        {playname ? (
          <View className='player-box'>
            {type === 'http' ? (
              <View onClick={this.copy.bind(this, url)}>
                <Text>播放地址已经生成，点击复制，使用浏览器打开观看</Text>
              </View>
            ) : (
              <Video style={{ width: '100%', height: '100%' }} src={url} poster='https://ww1.sinaimg.cn/large/87c01ec7gy1fqhvm91iodj21hc0u046d.jpg' />
            )}
          </View>
        ) : null}
        <View styleName='article-content' dangerouslySetInnerHTML={{ __html: content }} />
        {tag.map((item, index) => (
          <A to={`/pages/search/index?keyword=${item}`} key={`tag_${index}`}>
            #{item}
          </A>
        ))}
        <View styleName='article-context' className='mt20'>
          {prev ? (
            <Text>
              上一篇：<Ar to={`/pages/article/index?id=${prev.id}`}>{prev.title}</Ar>
            </Text>
          ) : null}
          {next ? (
            <Text>
              下一篇：<Ar to={`/pages/article/index?id=${next.id}`}>{next.title}</Ar>
            </Text>
          ) : null}
        </View>
      </View>
    )
  }
}

export default Article
