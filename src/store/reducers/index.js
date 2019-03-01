import { combineReducers } from 'redux'
import counter from './counter'
import page from './page'
import scroll from './scroll'
import week from './week'

export default combineReducers({
  counter,
  page: page(),
  scroll: scroll(),
  week: week()
})
