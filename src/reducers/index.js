import {combineReducers} from 'redux'

import {defineDrumkit, cloneDeep, last, filledArray} from '../utils'
import {ActionTypes} from '../Actions'



const initialDrumkits = {
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
        }
    )
}

const drumkits = function(state=initialDrumkits, action) {
    switch (action.type) {
        case ActionTypes.START_LOADING_DRUMKIT: {
            const {name} = action
            const {
                [name]: drumkit,
                ...otherDrumkits
            } = state
            // drumkit = Object.assign({}, drumkit, {loadingState: 'loading'})
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



const initialTab = {
    measures: [],
}

const tab = function(state=initialTab, action) {
    switch (action.type) {
        case ActionTypes.ADD_MEASURE:
        case ActionTypes.ADD_CLONED_MEASURE:
        case ActionTypes.TOGGLE_NOTE:
        case ActionTypes.SET_VOLUME:
            return Object.assign({}, state, {
                measures: measures(state.measures, action)
            })
        default:
            return state
    }
}



const measures = function(state=[], action) {
    switch (action.type) {
        case ActionTypes.ADD_MEASURE: {
            return [
                ...state,
                action.measure
            ]
        }
        case ActionTypes.ADD_CLONED_MEASURE: {
            const {drumkit} = action
            const lastMeasure = last(state)
            const clonedMeasure = lastMeasure ? cloneDeep(lastMeasure) : createDefaultMeasure(drumkit)
            return [
                ...state,
                clonedMeasure
            ]
        }
        case ActionTypes.TOGGLE_NOTE: {
            const {measureIndex, instrument, noteIndex} = action
            const measure = state[measureIndex]
            const {notes} = measure
            const newMeasure = Object.assign({}, measure, {
                notes: {
                    ...notes,
                    [instrument]: notes[instrument].map((volume, index) => {
                        if (index !== noteIndex) {
                            return volume
                        }
                        // toggle between 0 and 1
                        return volume^1
                    })
                }
            })
            return state.slice(0, measureIndex)
                .concat([newMeasure])
                .concat(state.slice(measureIndex + 1))
        }
        case ActionTypes.SET_VOLUME: {
            const {measureIndex, instrument, noteIndex, volume: newVolume} = action
            const measure = state[measureIndex]
            const {notes} = measure
            const newMeasure = Object.assign({}, measure, {
                notes: {
                    ...notes,
                    [instrument]: notes[instrument].map((volume, index) => {
                        if (index !== noteIndex) {
                            return volume
                        }
                        return newVolume
                    })
                }
            })
            return state.slice(0, measureIndex)
                .concat([newMeasure])
                .concat(state.slice(measureIndex + 1))
        }
        default:
            return state
    }
}

const createMeasure = function(numberOfBeats, noteValue, drumkit) {
    const notesByInstrument = {}
    // TODO: use drumkit of previous measure for convenience
    const measure = {
        numberOfBeats,
        noteValue,
        drumkit: drumkit.name,
        notes: notesByInstrument,
    }
    const {instruments} = drumkit
    for (const instrument of instruments) {
        notesByInstrument[instrument] = filledArray(
            // 4/4 => 8, 6/8 => 12, 3/4 => 6
            numberOfBeats * 2,
            0
        )
    }
    return measure
}

const createDefaultMeasure = function(drumkit) {
    return createMeasure(4, 4, drumkit)
}



const initialMenu = [
    {
        label: 'General',
        children: [
            {
                label: 'Manage Drumkits',
                isActive: false,
                childComponents: [
                    'DrumkitManagementModal'
                ],
            },
        ]
    },
    {
        label: 'Sound Controls',
        children: [
            {
                label: 'Play',
                showLabel: false,
                isActive: false,
                childComponents: [
                    'PlayButton'
                ],
            },
            {
                label: 'Pause',
                showLabel: false,
                isActive: false,
                childComponents: [
                    'PauseButton'
                ],
            },
            {
                label: 'Stop',
                showLabel: false,
                isActive: false,
                childComponents: [
                    'StopButton'
                ],
            },
        ]
    },
]
const menu = function(state=initialMenu, action) {
    switch (action.type) {
        case ActionTypes.SELECT_MENU_ITEM: {
            const {label} = action
            const clonedState = JSON.parse(JSON.stringify(state))
            selectMenuItem(clonedState, label)
            return clonedState
        }
        default:
            return state
    }
}

const selectMenuItem = function(menuItems, label) {
    for (const menuItem of menuItems) {
        if (menuItem.label === label) {
            menuItem.isActive = true
        }
        else {
            menuItem.isActive = false
        }
        if (menuItem.children) {
            selectMenuItem(menuItem.children, label)
        }
    }
}


export default combineReducers({
    tab,
    drumkits,
    menu,
})
