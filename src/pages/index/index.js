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
    console.log(Taro.useState)
    return (
      <View className='index'>
        <A url='/pages/top/index'>
          <View className={styles.red}>
            <Text>去top</Text>
          </View>
          <View className='blue'>1111</View>
        </A>
        {/* <Week type={1} />
        <Week type={0} /> */}
      </View>
    )
  }
}

export default Index
