import {ActionTypes} from '../Actions'


const initialState = {
    playingState: 'stop',
    currentPlayPos: [0, -1],
    loop: false,
    freezeUiWhilePlaying: false,
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
        case ActionTypes.TOGGLE_LOOP_STATE: {
            return Object.assign({}, state, {loop: !state.loop})
        }
        case ActionTypes.TOGGLE_FREEZE_UI_WHILE_PLAYING_STATE: {
            return Object.assign({}, state, {freezeUiWhilePlaying: !state.freezeUiWhilePlaying})
        }
        default:
            return state
    }
}

export default soundControls
