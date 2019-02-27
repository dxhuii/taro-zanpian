import Taro, { PureComponent } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
import { connect } from '@tarojs/redux'
import { TopList } from '@/store/actions/page'
import { getTopList } from '@/store/reducers/page'

import styles from './style.module.scss'

import Shell from '@/components/Shell'

@Shell
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
class TopPage extends PureComponent {
  static propTypes = {
    day: PropTypes.object,
    week: PropTypes.object,
    month: PropTypes.object,
    all: PropTypes.object,
    TopList: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {}
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
            <h2>总</h2>
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
            <h2>月</h2>
            <ul styleName='toplist'>
              {monthData.map((item, index) => (
                <li key={item.id}>
                  <Text styleName={`num ${index <= 2 ? 'on' : ''}`}>{index + 1}</Text>
                  <a href={`/subject/${item.id}`}>{item.title}</a>
                  <Text>{item.hits}</Text>
                </li>
              ))}
            </ul>
          </View>
          <View className='box'>
            <h2>周</h2>
            <ul styleName='toplist'>
              {weekData.map((item, index) => (
                <li key={item.id}>
                  <span styleName={`num ${index <= 2 ? 'on' : ''}`}>{index + 1}</span>
                  <a href={`/subject/${item.id}`}>{item.title}</a>
                  <span>{item.hits}</span>
                </li>
              ))}
            </ul>
          </View>
          <View className='box'>
            <h2>日</h2>
            <ul styleName='toplist'>
              {dayData.map((item, index) => (
                <li key={item.id}>
                  <span styleName={`num ${index <= 2 ? 'on' : ''}`}>{index + 1}</span>
                  <a href={`/subject/${item.id}`}>{item.title}</a>
                  <span>{item.hits}</span>
                </li>
              ))}
            </ul>
          </View>
        </View>
      </View>
    )
  }
}

export default TopPage
