import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import SignIn from './SignIn'
import SignUp from './SignUp'

import './style.scss'

class Sign extends Component {
  static propTypes = {
    isSign: PropTypes.string,
    onType: PropTypes.func
  }

  onType = (e, isSign) => {
    e.stopPropagation()
    this.props.onType(isSign)
  }

  render() {
    const { isSign } = this.props
    return (
      <View styleName='user'>
        <View styleName='logo' />
        <View>{isSign === 'signIn' ? '登录' : '注册'}，可以发现更多</View>
        {isSign === 'signIn' ? <SignIn /> : <SignUp />}
        <View styleName='user-reg' className='mt20'>
          {isSign === 'signIn' ? (
            <Text onClick={e => this.onType(e, 'signUp')}>还没有账号？去注册</Text>
          ) : (
            <Text onClick={e => this.onType(e, 'signIn')}>已有账号？去登录</Text>
          )}
        </View>
      </View>
    )
  }
}

export default Sign
