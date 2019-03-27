import Taro, { Component } from '@tarojs/taro'
import { Block } from '@tarojs/components'

class A extends Component {
  handleClick = url => Taro.navigateTo({ url })

  render() {
    const { url } = this.props
    return <Block onClick={this.handleClick.bind(this, url)}>{this.props.children}</Block>
  }
}

export default A
