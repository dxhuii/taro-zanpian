import Taro, { Component } from '@tarojs/taro'

import Detail from '@/components/Detail'

class Bangumi extends Component {
  render() {
    const {
      params: { id }
    } = this.$router
    return <Detail vid={id} />
  }
}

export default Bangumi
