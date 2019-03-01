export default function() {
  let initialState = {}
  return function week(state = initialState, action = {}) {
    const { data } = action
    switch (action.type) {
      case 'GET_WEEK':
        state = data
        return Object.assign({}, state, {})
      case 'CLEAN':
        return {}

      default:
        return state
    }
  }
}

export const getWeek = state => {
  return state.week ? state.week : {}
}
