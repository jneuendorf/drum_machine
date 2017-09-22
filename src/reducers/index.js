import {combineReducers} from 'redux'
import {reducer as ui} from 'redux-ui'

import tab from './tab'
import drumkits from './drumkits'


export default combineReducers({
    tab,
    drumkits,
    ui,
})
