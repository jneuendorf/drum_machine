import {combineReducers} from 'redux'

import {ActionTypes} from '../Actions'
import measures from './measures'


const isLoading = function(state=false, action) {
    switch (action.type) {
        case ActionTypes.SET_LOADING: {
            return action.isLoading
        }
        default:
            return state
    }
}

export const tab = combineReducers({
    measures,
    isLoading,
})
export default tab
