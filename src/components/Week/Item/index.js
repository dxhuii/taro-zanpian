import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'

import { isNumber, formatPic } from '@/utils'

import '../style.scss'

export default class Item extends Component {
  static defaultProps = {
    data: []
  }
  static propTypes = {
    data: PropTypes.array
  }
  handleClick = url => {
    Taro.navigateTo({
      url
    })
  }
  render() {
    const { data } = this.props
    return (
      <View className='week-list'>
        {data.map(item => (
          <View className='week-box' key={item.id} onClick={this.handleClick.bind(this, `/play/${item.id}/${item.pid}`)}>
            <View className='pic'>
              <Image className='img' src={formatPic(item.smallPic || item.pic, 'thumb150')} alt={item.title} />
            </View>
            <Text className='title'>{item.title}</Text>
            <Text className={`status ${item.isDate ? 'today' : ''}`}>{isNumber(item.status) ? `第${item.status}话` : item.status}</Text>
          </View>
        ))}
      </View>
    )
  }
}
