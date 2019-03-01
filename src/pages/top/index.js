import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { TopList } from '@/store/actions/page'
import { getTopList } from '@/store/reducers/page'

import styles from './style.module.scss'

@connect(
  (state, props) => ({
    day: getTopList(state, 'hits_day'),
    week: getTopList(state, 'hits_week'),
    month: getTopList(state, 'hits_month'),
    all: getTopList(state, 'hits')
  }),
  dispatch => ({
    TopList: bindActionCreators(TopList, dispatch)
  })
)
class TopPage extends Component {
  static propTypes = {
    day: PropTypes.object,
    week: PropTypes.object,
    month: PropTypes.object,
    all: PropTypes.object,
    TopList: PropTypes.func
  }

  componentDidMount() {
    const { day, week, month, all, TopList } = this.props
    if (!day.data) {
      TopList({ order: 'hits_day' })
    }
    if (!week.data) {
      TopList({ order: 'hits_week' })
    }
    if (!month.data) {
      TopList({ order: 'hits_month' })
    }
    if (!all.data) {
      TopList({ order: 'hits' })
    }
  }

  go(id) {
    Taro.navigateTo({
      url: `/subject/${id}`
    })
  }

  render() {
    const { day, week, month, all } = this.props
    const dayData = day.data || []
    const weekData = week.data || []
    const monthData = month.data || []
    const allData = all.data || []
    return (
      <View>
        <View className={styles.top}>
          <View className='box'>
            <View>
              <Text>总</Text>
            </View>
            <View className={styles.toplist}>
              {allData.map((item, index) => (
                <View key={item.id} onClick={this.go.bind(this, item.id)}>
                  <Text className={`${styles.num} ${index <= 2 ? styles.on : ''}`}>{index + 1}</Text>
                  <Text>{item.title}</Text>
                  <Text>{item.glod}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className='box'>
            <View>
              <Text>月</Text>
            </View>
            <View className={styles.toplist}>
              {monthData.map((item, index) => (
                <View key={item.id} onClick={this.go.bind(this, item.id)}>
                  <Text className={`${styles.num} ${index <= 2 ? styles.on : ''}`}>{index + 1}</Text>
                  <Text>{item.title}</Text>
                  <Text>{item.glod}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className='box'>
            <View>
              <Text>周</Text>
            </View>
            <View className={styles.toplist}>
              {weekData.map((item, index) => (
                <View key={item.id} onClick={this.go.bind(this, item.id)}>
                  <Text className={`${styles.num} ${index <= 2 ? styles.on : ''}`}>{index + 1}</Text>
                  <Text>{item.title}</Text>
                  <Text>{item.glod}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className='box'>
            <View>
              <Text>日</Text>
            </View>
            <View className={styles.toplist}>
              {dayData.map((item, index) => (
                <View key={item.id} onClick={this.go.bind(this, item.id)}>
                  <Text className={`${styles.num} ${index <= 2 ? styles.on : ''}`}>{index + 1}</Text>
                  <Text>{item.title}</Text>
                  <Text>{item.glod}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default TopPage
