import Taro, { Component } from '@tarojs/taro'
import Player from '@/components/Player'

export default class Play extends Component {
  render() {
    const {
      params: { id, pid }
    } = this.$router
    return <Player vodid={id} pid={pid} />
  }
}
