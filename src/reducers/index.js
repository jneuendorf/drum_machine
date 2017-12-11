import {combineReducers} from 'redux'
import {reducer as ui} from 'redux-ui'
import {fromJS} from 'immutable'

import {ActionTypes} from '../Actions'
import tab from './tab'
import menu from './menu'
import drumkits from './drumkits'
import soundControls from './soundControls'
import {resetIdGenerator} from '../utils/measure'


const app = combineReducers({
    tab,
    menu,
    drumkits,
    soundControls,
    ui,
})

export default function(Player) {
    return function(state, action) {
        switch (action.type) {
            case ActionTypes.SET_STORE_STATE: {
                const serializedState = action.state || '{}'
                let stateToImport
                try {
                    stateToImport = JSON.parse(serializedState)
                    stateToImport.ui = fromJS(stateToImport.ui)
                    if (stateToImport.tab && stateToImport.tab.measures) {
                        if (stateToImport.tab.measures.length > 0) {
                            resetIdGenerator(
                                Math.max(
                                    ...stateToImport.tab.measures
                                    .filter(measure => typeof(measure) !== 'string')
                                    .map(measure => measure.id)
                                )
                            )
                        }
                        else {
                            resetIdGenerator(-1)
                        }
                    }
                    Player.invalidateCache()
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
}
