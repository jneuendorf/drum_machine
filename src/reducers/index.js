import {combineReducers} from 'redux'
import {reducer as ui} from 'redux-ui'

import tab from './tab'
import drumkits from './drumkits'
import soundControls from './soundControls'


export default combineReducers({
    tab,
    drumkits,
    soundControls,
    ui,
})
