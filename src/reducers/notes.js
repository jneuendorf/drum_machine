import {ActionTypes} from '../Actions'


const initialNotes = {
    inTupletMode: false,
}


export const notes = function(state=initialNotes, action) {
    switch (action.type) {
        case ActionTypes.SET_TUPLET_MODE: {
            const {inTupletMode} = action
            return Object.assign({}, state, {inTupletMode})
        }
        default:
            return state
    }
}

export default notes
