import {ActionTypes} from '../Actions'


const initialNotes = {
    inTripletMode: false,
}


export const notes = function(state=initialNotes, action) {
    switch (action.type) {
        case ActionTypes.SET_TRIPLET_MODE: {
            const {inTripletMode} = action
            return Object.assign({}, state, {inTripletMode})
        }
        default:
            return state
    }
}

export default notes
