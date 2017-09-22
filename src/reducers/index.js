import {combineReducers} from 'redux'
import {reducer as ui} from 'redux-ui'

// import menu from './menu'
import tab from './tab'
import drumkits from './drumkits'
// import ui from './ui'



export default combineReducers({
    // menu,
    tab,
    drumkits,
    ui,
})
