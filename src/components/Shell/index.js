import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { saveScrollPosition, setScrollPosition } from '@/store/actions/scroll'
import { addVisitHistory } from '@/store/actions/history'

// 壳组件，用于给页面组件，套一个外壳
// 这样可以通过壳组件，给每个页面，传递参数
export default Component => {
  @connect(
    (state, props) => ({}),
    dispatch => ({
      saveScrollPosition: bindActionCreators(saveScrollPosition, dispatch),
      setScrollPosition: bindActionCreators(setScrollPosition, dispatch),
      addVisitHistory: bindActionCreators(addVisitHistory, dispatch)
    })
  )
  class Shell extends Taro.Component {
    static propTypes = {
      location: PropTypes.object,
      setScrollPosition: PropTypes.func,
      addVisitHistory: PropTypes.func,
      saveScrollPosition: PropTypes.func
    }

    constructor(props) {
      super(props)
      this.state = {
        notFoundPgae: '',
        hasError: ''
      }
    }

    // 组件加载完成
    componentDidMount() {
      const { path, search } = this.$router
      this.props.setScrollPosition(path + search)
      this.props.addVisitHistory(path + search)
    }

    // 组件被卸载
    componentWillUnmount() {
      const { path, search } = this.$router
      this.props.saveScrollPosition(path + search)
    }

    componentDidCatch(error, info) {
      console.log(error)
      console.log(info)

      // Display fallback UI
      this.setState({ hasError: error })
      // You can also log the error to an error reporting service
      // logErrorToMyService(error, info);
    }

    render() {
      const { notFoundPgae, hasError } = this.state

      if (notFoundPgae) {
        return <Text>{notFoundPgae}</Text>
      } else if (hasError) {
        return (
          <View>
            <Text>页面发生错误</Text>
            <Text>{hasError}</Text>
          </View>
        )
      } else {
        return (
          <Component
            {...this.props}
            notFoundPgae={content => {
              this.setState({ notFoundPgae: content || '404 NOT FOUND' })
            }}
          />
        )
      }
    }
  }

  return Shell
}
