import {combineReducers} from 'redux'

import menu from './menu'
import tab from './tab'
import drumkits from './drumkits'



export default combineReducers({
    menu,
    tab,
    drumkits,
})
