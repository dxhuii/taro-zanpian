import { combineReducers } from 'redux'
import counter from './counter'
import page from './page'
import week from './week'

export default combineReducers({
  counter,
  page: page(),
  week: week()
})
