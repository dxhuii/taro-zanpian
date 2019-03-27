import Taro, { Component } from '@tarojs/taro'
import { Form, Button, Input } from '@tarojs/components'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { signIn } from '@/store/actions/user'

import '../style.scss'

@connect(
  (state, props) => ({}),
  dispatch => ({
    signIn: bindActionCreators(signIn, dispatch)
  })
)
class SignIn extends Component {
  static propTypes = {
    signIn: PropTypes.func,
    history: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {}
    this.submit = this.submit.bind(this)
  }

  async submit(event) {
    event.preventDefault()

    const { username, password } = this
    const { signIn } = this.props

    if (!username.value) {
      username.focus()
      return false
    }

    if (!password.value) {
      password.focus()
      return false
    }

    let [err, success] = await signIn({ username: username.value, password: password.value })
    if (success) {
      setTimeout(() => {
        window.location.reload()
        return false
      }, 300)
    }
  }

  render() {
    return (
      <Form onSubmit={this.submit}>
        <Input
          type='text'
          ref={c => {
            this.username = c
          }}
          placeholder='请输入账号/邮箱'
        />
        <Input
          type='password'
          ref={c => {
            this.password = c
          }}
          placeholder='请输入密码'
        />
        <Button type='submit'>登录</Button>
      </Form>
    )
  }
}

export default SignIn
