import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class A extends Component {
  handleClick = url => Taro.navigateTo({ url })

  render() {
    const { url } = this.props
    return <View onClick={this.handleClick.bind(this, url)}>{this.props.children}</View>
  }
}
