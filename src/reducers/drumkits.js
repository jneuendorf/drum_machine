import {ActionTypes} from '../Actions'
import {Howl} from 'howler'


const defineDrumkit = function(name, sourceFiles, sprite, options={}) {
    const instruments = Object.keys(sprite)
    // In this case we skip the is 'isLoading' state because drumkits should
    // load before the user can hit 'play' or 'manage drumkits'
    const loadingState = options.preload === true ? 'loaded' : 'unloaded'
    return {
        howl: new Howl({
            preload: false,
            ...options,
            src: sourceFiles,
            sprite: sprite,
        }),
        name,
        instruments,
        // same as howl.state() but this prop is changed by actions
        loadingState,
        formattedInstruments: formatInstruments(instruments),
    }
}

const formatInstruments = function(instruments) {
    return instruments.map(name => {
        return `${name.charAt(0).toUpperCase()}${name.slice(1)}`.replace(/(\d+)$/g, ' $1')
    })
}


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
