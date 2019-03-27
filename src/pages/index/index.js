import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import Week from '@/components/Week'
import A from '@/components/A'

import './index.scss'
import styles from './style.module.scss'

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

  render() {
    return (
      <View className='index'>
        <A url='/pages/top/index'>
          <Text>去top</Text>
        </A>
        <A url='/pages/subject/index?id=33600'>
          <Text>去详情</Text>
        </A>
        <A url='/pages/top/index'>
          <Text>去play</Text>
        </A>
        {/* <Week type={1} />
        <Week type={0} /> */}
      </View>
    )
  }
}

export default Index
