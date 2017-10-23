import {combineReducers} from 'redux'
import {reducer as ui} from 'redux-ui'
import {fromJS} from 'immutable'

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
        case ActionTypes.SET_STORE_STATE: {
            const serializedState = action.state || '{}'
            let stateToImport
            try {
                stateToImport = JSON.parse(serializedState)
                stateToImport.ui = fromJS(stateToImport.ui)
            }
            catch (e) {
                stateToImport = {}
                console.error(e)
            }
            return Object.assign({}, state, stateToImport)
        }
        default:
            return app(state, action)
    }
}
