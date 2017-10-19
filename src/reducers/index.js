import {combineReducers} from 'redux'
import {reducer as ui} from 'redux-ui'

import {ActionTypes} from '../Actions'
import tab from './tab'
import menu from './menu'
import drumkits from './drumkits'
import soundControls from './soundControls'


const app = combineReducers({
    tab,
    menu,
    drumkits,
    soundControls,
    ui,
})

export default function(state, action) {
    switch (action.type) {
        case ActionTypes.SET_STORE_STATE:
            return Object.assign({}, state, action.state)
        default:
            return app(state, action)
    }
}
