import {combineReducers} from 'redux'

import measures from './measures'
import notes from './notes'


export const tab = combineReducers({
    measures,
    notes,
})
export default tab
