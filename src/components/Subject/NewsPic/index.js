import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'

import A from '@/components/A'
import { formatPic } from '@/utils'

import './style.scss'

export default class NewsPic extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  static defaultProps = {
    data: []
  }

  render() {
    const { data } = this.props
    return (
      <View className='newslist'>
        {data.map(item => (
          <View key={item.id}>
            <A to={`/article/${item.id}`}>
              <Image src={formatPic(item.pic, 'orj360')} />
              <Text className='mark'>{item.title}</Text>
            </A>
          </View>
        ))}
      </View>
    )
  }
}
