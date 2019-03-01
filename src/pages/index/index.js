import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import Week from '@/components/Week'

import './index.scss'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleClick = url => {
    Taro.navigateTo({
      url
    })
  }

  render() {
    return (
      <View className='index'>
        <View onClick={this.handleClick.bind(this, '/pages/top/index')}>
          <Text>去top</Text>
        </View>
        <Week type={1} />
        <Week type={0} />
      </View>
    )
  }
}

export default Index
