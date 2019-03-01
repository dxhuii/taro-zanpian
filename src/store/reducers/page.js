export default function() {
  let initialState = {}
  return function page(state = initialState, action = {}) {
    const { data, name } = action
    switch (action.type) {
      case 'GET_TOP_LIST':
        state[name] = data
        return Object.assign({}, state, {})
      case 'CLEAN':
        return {}
      default:
        return state
    }
  }
}

export const getTopList = (state, order) => {
  return state.page[order] ? state.page[order] : {}
}
