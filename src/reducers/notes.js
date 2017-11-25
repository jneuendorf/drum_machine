import {ActionTypes} from '../Actions'


const initialNotes = {
    inTupletMode: false,
    inRemoveTupletMode: false,
}


export const notes = function(state=initialNotes, action) {
    switch (action.type) {
        case ActionTypes.SET_TUPLET_MODE: {
            const {inTupletMode} = action
            return Object.assign({}, state, {inTupletMode})
        }
        case ActionTypes.SET_REMOVE_TUPLET_MODE: {
            const {inRemoveTupletMode} = action
            return Object.assign({}, state, {inRemoveTupletMode})
        }
        default:
            return state
    }
}

export default notes
