import {ActionTypes} from '../Actions'


export const currentPlayPos = function(state=[-1,-1], action) {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_PLAY_POS: {
            const {measureIndex, noteIndex} = action
            return [measureIndex, noteIndex]
        }
        default:
            return state
    }
}

export default currentPlayPos
