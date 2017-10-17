import {combineReducers} from 'redux'
import {reducer as ui} from 'redux-ui'

import tab from './tab'
import menu from './menu'
import drumkits from './drumkits'
import soundControls from './soundControls'


export default combineReducers({
    tab,
    menu,
    drumkits,
    soundControls,
    ui,
})
