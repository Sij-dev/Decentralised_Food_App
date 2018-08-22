import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import campaignReducer from './user/campaignReducer'
import web3Reducer from './util/web3/web3Reducer'
import {reducer as formReducer } from 'redux-form'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  web3: web3Reducer,
  form: formReducer,
  campaign:campaignReducer
})

export default reducer
