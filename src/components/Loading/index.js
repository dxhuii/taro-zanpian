import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './style.scss'

export default class Loading extends Component {
  render() {
    return (
      <View className='loading'>
        <View className='animation'>
          <Text className='dot' />
          <Text className='dot' />
          <Text className='dot' />
          <Text className='dot' />
        </View>
      </View>
    )
  }
}
