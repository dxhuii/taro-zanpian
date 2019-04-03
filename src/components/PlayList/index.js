import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'

import Ar from '@/components/Ar'
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
      isReverse: false
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

  render() {
    const {
      play: { loading, data = [] },
      vid,
      pid
    } = this.props
    const { isReverse } = this.state
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
            <View className='moblie-title'>
              <Text className='title'>分集</Text>
              <Text onClick={this.onReverse}>{isReverse ? '倒序' : '正序'}</Text>
            </View>
            <View className='play-list'>
              {data.map(item => (
                <View className={`play-list__li ${cls(item.episode)}`} key={item.episode}>
                  <Ar url={`/pages/play/index?id=${vid}&pid=${item.episode}`}>
                    <Text className='ep'>{firstNumber(item.title)}</Text>
                  </Ar>
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
