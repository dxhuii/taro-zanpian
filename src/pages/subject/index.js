import Taro, { Component } from '@tarojs/taro'

import Detail from '@/components/Subject/Detail'

export default class Subject extends Component {
  render() {
    const {
      params: { id }
    } = this.$router
    return <Detail vid={id} />
  }
}
