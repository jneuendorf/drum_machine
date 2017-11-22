import {ActionTypes} from '../Actions'


const initialState = {
    playingState: 'stop',
    currentPlayPos: [-1,-1],
}

export const soundControls = function(state=initialState, action) {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_PLAY_POS: {
            const {measureIndex, time} = action
            return Object.assign({}, state, {
                currentPlayPos: [measureIndex, time]
            })
        }
        case ActionTypes.SET_PLAYING_STATE: {
            const {playingState} = action
            return Object.assign({}, state, {playingState})
        }
        default:
            return state
    }
}

export default soundControls
