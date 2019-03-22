import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { week } from '@/store/actions/week'
import { getWeek } from '@/store/reducers/week'

import Loading from '@/components/Loading'
import Item from '@/components/Week/Item'

import './style.scss'

@connect(
  state => ({
    weekData: getWeek(state)
  }),
  dispatch => ({
    week: bindActionCreators(week, dispatch)
  })
)
class weekDay extends Component {
  static defaultProps = {
    type: 1
  }

  constructor(props) {
    super(props)
    const day = new Date().getDay()
    const today = day === 0 ? 6 : day - 1
    this.state = {
      today
    }
  }

  static propTypes = {
    weekData: PropTypes.object,
    week: PropTypes.func,
    id: PropTypes.any,
    title: PropTypes.string,
    link: PropTypes.string,
    isJp: PropTypes.array,
    type: PropTypes.number,
    linkText: PropTypes.string
  }

  componentDidMount() {
    const { weekData, week, id } = this.props
    if (!weekData.data) {
      week({ id })
    }
  }

  getArea(weekData = []) {
    let cn = []
    let jp = []
    weekData.map(item => {
      if (item.area === '日本') {
        jp.push(item)
      } else if (item.area === '大陆') {
        cn.push(item)
      }
    })
    return [cn, jp]
  }

  getEveryWeek(weekData) {
    // isCN  1 日本  其他为中国
    let data = {}
    let [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday] = [[], [], [], [], [], [], []]
    weekData.map(item => {
      const day = item.weekday
      if (day === 1) {
        Monday.push(item)
      } else if (day === 2) {
        Tuesday.push(item)
      } else if (day === 3) {
        Wednesday.push(item)
      } else if (day === 4) {
        Thursday.push(item)
      } else if (day === 5) {
        Friday.push(item)
      } else if (day === 6) {
        Saturday.push(item)
      } else if (day === 7) {
        Sunday.push(item)
      }
    })
    data.Monday = Monday
    data.Tuesday = Tuesday
    data.Wednesday = Wednesday
    data.Thursday = Thursday
    data.Friday = Friday
    data.Saturday = Saturday
    data.Sunday = Sunday
    return data
  }

  render() {
    const {
      weekData: { data = [], loading },
      type
    } = this.props
    const { today } = this.state
    const weekCn = ['一', '二', '三', '四', '五', '六', '日']
    const weekEng = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const weekType = this.getArea(data)
    const weekData = this.getEveryWeek(weekType[type], type)
    return (
      <View className='week'>
        <Text className='week-title'>{type ? '日漫' : '国漫'}</Text>
        <View className='week-tab'>
          {weekCn.map((item, index) => (
            <Text key={`week_${index}`} onClick={() => this.setState({ today: index })} className='week-li'>
              {index === today ? <Text className='active'>周{item}</Text> : <Text>周{item}</Text>}
            </Text>
          ))}
        </View>
        {loading ? <Loading /> : null}
        <Item data={weekData[weekEng[today]]} type={type} />
      </View>
    )
  }
}

export default weekDay
