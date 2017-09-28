import {combineReducers} from 'redux'
import {reducer as ui} from 'redux-ui'

import tab from './tab'
import drumkits from './drumkits'
import currentPlayPos from './currentPlayPos'


export default combineReducers({
    tab,
    drumkits,
    currentPlayPos,
    ui,
})
