import { combineReducers } from 'redux'
import counter from './counter'
import page from './page'

export default combineReducers({
  counter,
  page: page()
})
