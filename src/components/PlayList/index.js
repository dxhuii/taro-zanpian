import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'
import PropTypes from 'prop-types'

import A from '@/components/A'
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'

import { playlist } from '@/store/actions/playlist'
import { getPlayList } from '@/store/reducers/playlist'

import { firstNumber } from '@/utils'

import './style.scss'

@connect(
  (state, props) => ({
    play: getPlayList(state, props.match.params.id)
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

  static propTypes = {
    id: PropTypes.number,
    play: PropTypes.object,
    playlist: PropTypes.func,
    match: PropTypes.object
  }

  componentDidMount() {
    const {
      play,
      playlist,
      match: {
        params: { id }
      }
    } = this.props
    if (!play || !play.data) {
      playlist({ id })
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
      match: {
        params: { id, pid }
      }
    } = this.props
    const { isReverse, isAll } = this.state
    return (
      <Block>
        {data.length ? (
          <View styleName='playlistbox'>
            {loading && data.length ? <div>loading...</div> : null}
            <div styleName={`moblie-list ${isAll ? 'showAll' : ''}`}>
              <div styleName='moblie-title'>
                <h2>分集</h2>
                <span onClick={this.onReverse}>{isReverse ? '倒序' : '正序'}</span>
                {isAll ? (
                  <i className='iconfont' onClick={this.isAll}>
                    &#xe610;
                  </i>
                ) : null}
              </div>
              <ul>
                {(isReverse ? data.reverse() : data).map(item => (
                  <li styleName={+pid === +item.episode ? 'active' : ''} key={item.episode}>
                    <A url={`/play/${id}/${item.episode}`}>{firstNumber(item.title)}</A>
                  </li>
                ))}
              </ul>
            </div>
          </View>
        ) : null}
      </Block>
    )
  }
}

export default PlayList
