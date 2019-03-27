import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import A from '@/components/A'

import './style.scss'

export default class NewsText extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  static defaultProps = {
    data: []
  }

  render() {
    const { data } = this.props
    return (
      <View className='d-yugao'>
        <li className='top'>
          <span className='time'>发布时间</span>
          <span className='name'>视频名称</span>
          <span className='clarity'>清晰度</span>
          <span className='play'>播放</span>
          <span className='source'>来源</span>
        </li>
        {data.map(item => (
          <li key={item.id}>
            <span className='time'>{item.addtime}</span>
            <span className='name'>
              <A url={`/article/${item.id}`} title={item.title}>
                <Text>{item.title}</Text>
              </A>
              <Text>{item.playtime}</Text>
            </span>
            <span className='clarity'>{item.clarity}</span>
            <span className='play'>
              <A url={`/article/${item.id}`} title={item.title}>
                <Text>播放</Text>
              </A>
            </span>
            <span className='source'>
              <i className={`playicon ${item.playname}`} />
            </span>
          </li>
        ))}
      </View>
    )
  }
}
