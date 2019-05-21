import loadData from '@/utils/loadData'
import Ajax from '@/common/ajax'
import config from '@/utils/config'

export function playerLoad({ id, pid }) {
  return (dispatch, getState) => {
    return loadData({
      dispatch,
      getState,
      name: `${id}-${pid}`,
      reducerName: 'player',
      actionType: 'GET_PLAYER',
      api: 'player',
      params: { id, pid }
    })
  }
}

export const getPlayUrl = ({ type, name }) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      let [err, data] = await Ajax({
        url: config.api.getplayUrl,
        data: {
          type,
          name
        },
        method: 'get'
      })

      if (err) {
        resolve([err])
      } else {
        resolve([null, data])
      }
    })
  }
}
