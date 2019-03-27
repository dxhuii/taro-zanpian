import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'

import A from '@/components/A'
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'

import { playlist } from '@/store/actions/playlist'
import { getPlayList } from '@/store/reducers/playlist'

import { firstNumber } from '@/utils'

import './style.scss'

@connect(
  (state, props) => ({
    play: getPlayList(state, props.vid)
  }),
  dispatch => ({
    playlist: bindActionCreators(playlist, dispatch)
  })
)
class PlayList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isReverse: false,
      isAll: false
    }
  }

  componentDidMount() {
    const { play, playlist } = this.props
    if (!play || !play.data) {
      playlist({ id: this.props.vid })
    }
  }

  onReverse = () => {
    this.setState({
      isReverse: !this.state.isReverse
    })
  }

  isAll = () => {
    this.setState({
      isAll: !this.state.isAll
    })
  }

  render() {
    const {
      play: { loading, data = [] },
      vid,
      pid
    } = this.props
    const { isReverse, isAll } = this.state
    if (loading && data.length) {
      Taro.showLoading()
    } else {
      Taro.hideLoading()
    }
    const cls = id => (pid === id ? 'active' : '')
    return (
      <Block>
        {data.length ? (
          <View className='playlistbox'>
            <View className={`moblie-list ${isAll ? 'showAll' : ''}`} />
            <View className='moblie-title'>
              <View>
                <Text>分集</Text>
              </View>
              <View onClick={this.onReverse}>{isReverse ? '倒序' : '正序'}</View>
              {isAll ? (
                <Text className='iconfont' onClick={this.isAll}>
                  &#xe610;
                </Text>
              ) : null}
            </View>
            <View>
              {(isReverse ? data.reverse() : data).map(item => (
                <View className={cls(item.episode)} key={item.episode}>
                  <A url={`/pages/play/index?id=${vid}&pid=${item.episode}`}>{firstNumber(item.title)}</A>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Block>
    )
  }
}

export default PlayList
