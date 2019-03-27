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
    return (
      <View styleName='d-yugao'>
        <li styleName='top'>
          <span styleName='time'>发布时间</span>
          <span styleName='name'>视频名称</span>
          <span styleName='clarity'>清晰度</span>
          <span styleName='play'>播放</span>
          <span styleName='source'>来源</span>
        </li>
        {data.map(item => (
          <li key={item.id}>
            <span styleName='time'>{item.addtime}</span>
            <span styleName='name'>
              <A url={`/article/${item.id}`} title={item.title}>
                <Text>{item.title}</Text>
              </A>
              <Text>{item.playtime}</Text>
            </span>
            <span styleName='clarity'>{item.clarity}</span>
            <span styleName='play'>
              <A url={`/article/${item.id}`} title={item.title}>
                <Text>播放</Text>
              </A>
            </span>
            <span styleName='source'>
              <i className={`playicon ${item.playname}`} />
            </span>
          </li>
        ))}
      </View>
    )
  }
}
