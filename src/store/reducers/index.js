import { combineReducers } from 'redux'
import page from './page'
import week from './week'

export default combineReducers({
  page: page(),
  week: week()
})
