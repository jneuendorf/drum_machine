import {ActionTypes} from '../Actions'
import {defineDrumkit} from '../utils'


export const initialDrumkits = {
    // drumkits.default.howl.play('Bass')
    default: defineDrumkit(
        'default',
        ['kits/default.mp3', 'kits/default.ogg', 'kits/default.m4a'],
        {
            'snare': [
                0, 269.9546485260771
            ],
            'hi-hat': [
                2000, 271.2698412698411
            ],
            'kick': [
                4000, 141.54195011337833
            ],
            'crash1': [
                6000, 1364.897959183674
            ],
            'crash2': [
                9000, 1352.3356009070292
            ],
            'ride': [
                12000, 1381.5873015873024
            ],
            'tom1': [
                15000, 2201.1111111111104
            ],
            'tom2': [
                19000, 1700.725623582766
            ],
            'tom3': [
                22000, 875.3514739229012
            ],
        },
        {
            preload: true
        }
    )
}

export const drumkits = function(state=initialDrumkits, action) {
    switch (action.type) {
        case ActionTypes.START_LOADING_DRUMKIT: {
            const {name} = action
            const {
                [name]: drumkit,
                ...otherDrumkits
            } = state
            return Object.assign({}, state, {
                [name]: {
                    ...drumkit,
                    loadingState: 'loading'
                },
                ...otherDrumkits
            })
        }
        case ActionTypes.DONE_LOADING_DRUMKIT: {
            const {name} = action
            const {
                [name]: drumkit,
                ...otherDrumkits
            } = state
            return Object.assign({}, state, {
                [name]: {
                    ...drumkit,
                    loadingState: 'loaded'
                },
                ...otherDrumkits
            })
        }
        default:
            return state
    }
}

export default drumkits
