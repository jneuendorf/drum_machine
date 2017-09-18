import {combineReducers} from 'redux'

import {defineDrumkit} from '../utils'
import {ActionTypes} from '../Actions'


const initialTab = {
    measures: [],
    // {kitname => {instrumentName => sound, loadingState: "unloaded|loaded|loading"}}
    drumkits: {
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
}

const tab = function(state=initialTab, action) {
    switch (action.type) {
        case ActionTypes.ADD_MEASURE:
            return Object.assign({}, state, {
                measures: [
                    ...state.measures,
                    action.measure
                ]
            })
        case ActionTypes.START_LOADING_DRUMKIT:
            {
                const {name} = action
                const {
                    [name]: drumkit,
                    ...otherDrumkits
                } = state.drumkits
                // drumkit = Object.assign({}, drumkit, {loadingState: 'loading'})
                return Object.assign({}, state, {
                    drumkits: {
                        [name]: {
                            ...drumkit,
                            loadingState: 'loading'
                        },
                        ...otherDrumkits
                    }
                })
            }
        case ActionTypes.DONE_LOADING_DRUMKIT:
            {
                const {name} = action
                const {
                    [name]: drumkit,
                    ...otherDrumkits
                } = state.drumkits
                // drumkit = Object.assign({}, drumkit, {loadingState: 'loading'})
                return Object.assign({}, state, {
                    drumkits: {
                        [name]: {
                            ...drumkit,
                            loadingState: 'loaded'
                        },
                        ...otherDrumkits
                    }
                })
            }
        default:
            return state
    }
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
    }
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


export default combineReducers({tab, menu})
