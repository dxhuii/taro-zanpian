import config from '@/utils/config'
import Ajax from '@/common/ajax'
import Taro from '@tarojs/taro'

export default ({ api, params, method = 'get', callback = () => {} }) => {
  return new Promise(async (resolve, reject) => {
    let [err, data] = await Ajax({
      method,
      url: config.api[api],
      data: params
    })

    if (err) {
      resolve([null, data])
      callback([null, data])
      return
    }
    if (data.rcode === 1) {
      resolve([null, data])
      callback([null, data])
    } else {
      Taro.showToast({ title: data.msg })
    }
  })
}
