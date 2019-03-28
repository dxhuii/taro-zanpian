import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'

import { detailActor } from '@/store/actions/actor'
import { getDetailActor } from '@/store/reducers/actor'

import A from '@/components/A'

import { isNumber, formatPic } from '@/utils'

import './style.scss'

@connect(
  (state, props) => ({
    info: getDetailActor(state, props.no)
  }),
  dispatch => ({
    detailActor: bindActionCreators(detailActor, dispatch)
  })
)
class DetailActor extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    detailActor: PropTypes.func,
    actor: PropTypes.string,
    no: PropTypes.any
  }

  componentDidMount() {
    console.log(this.props, 'detailactor')
    const { info, detailActor, no, actor } = this.props
    if (!info || !info.data) {
      detailActor({
        actor,
        no
      })
    }
  }

  render() {
    const {
      info: { data = [], loading }
    } = this.props
    if (loading) {
      Taro.showLoading()
    } else {
      Taro.hideLoading()
    }
    return (
      <View className='d-item'>
        {data.map(item => (
          <View key={item.id}>
            <A url={`/pages/subject/index?id=${item.id}`}>
              <Image className='load-demand' src={formatPic(item.pic, 'orj360')} alt={item.title} />
              <Text>{item.title}</Text>
            </A>
            <A url={`/pages/play/index?id=${item.id}&pid=${item.pid}`}>
              {isNumber(item.status) ? (
                item.isDate ? (
                  <Text className='today'>更新至{item.status}话</Text>
                ) : (
                  <Text>更新至{item.status}话</Text>
                )
              ) : item.isDate ? (
                <Text className='today'>{item.status}</Text>
              ) : (
                <Text>{item.status}</Text>
              )}
            </A>
          </View>
        ))}
      </View>
    )
  }
}

export default DetailActor
