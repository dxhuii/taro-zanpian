import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import A from '@/components/A'

import './style.scss'

export default class EpList extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    vid: PropTypes.number.isRequired
  }

  static defaultProps = {
    data: []
  }

  render() {
    const { vid, data } = this.props
    return (
      <View className='eplist mt20'>
        {data.map(item => (
          <View key={item.pid}>
            <A url={`/episode/${vid}/${item.pid ? item.pid : 1}`}>
              <Text>
                {item.name} {item.title}
              </Text>
            </A>
            <Text>{item.content}</Text>
          </View>
        ))}
      </View>
    )
  }
}
