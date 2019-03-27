import Taro, { Component } from '@tarojs/taro'
import { View, Form, Button, Input, Image } from '@tarojs/components'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { signUp, getCode } from '@/store/actions/user'

import '../style.scss'

@withRouter
@connect(
  (state, props) => ({}),
  dispatch => ({
    signUp: bindActionCreators(signUp, dispatch),
    getCode: bindActionCreators(getCode, dispatch)
  })
)
class SignIn extends Component {
  static propTypes = {
    signUp: PropTypes.func,
    history: PropTypes.object,
    getCode: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      rand: 0,
      base64img: '',
      imgKey: ''
    }
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    this.getVerify()
  }

  getVerify = async () => {
    const { getCode } = this.props
    let [err, data] = await getCode()
    if (data.code === 0) {
      const { base64img, imgkey } = data.data
      this.setState({
        base64img,
        imgkey
      })
    }
  }
  async submit(event) {
    event.preventDefault()

    const { username, password, email, rePassword, validate } = this
    const { signUp } = this.props

    if (!username.value) {
      username.focus()
      return false
    }

    if (!email.value) {
      email.focus()
      return false
    }

    if (!password.value) {
      password.focus()
      return false
    }

    if (password.value !== rePassword.value) {
      password.focus()
      return false
    }

    if (validate.value !== validate.value) {
      password.focus()
      return false
    }

    let [err, success] = await signUp({
      username: username.value,
      password: password.value,
      email: email.value,
      validate: validate.value,
      key: this.state.imgkey
    })
    if (success) {
      setTimeout(() => {
        window.location.reload()
        return false
      }, 300)
    }
  }

  render() {
    const { base64img } = this.state
    return (
      <Form onSubmit={this.submit}>
        <Input
          type='text'
          ref={c => {
            this.username = c
          }}
          placeholder='请输入账号'
        />
        <Input
          type='text'
          ref={c => {
            this.email = c
          }}
          placeholder='请输入Email'
        />
        <Input
          type='password'
          ref={c => {
            this.password = c
          }}
          placeholder='请输入密码'
        />
        <Input
          type='password'
          ref={c => {
            this.rePassword = c
          }}
          placeholder='再输入一次密码'
        />
        <View className='validate'>
          <Input
            type='text'
            ref={c => {
              this.validate = c
            }}
            placeholder='请输入验证'
          />
          <Image src={base64img} onClick={this.getVerify} />
        </View>
        <Button type='submit'>注册</Button>
      </Form>
    )
  }
}

export default SignIn
