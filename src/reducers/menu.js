import {ActionTypes} from '../Actions'
import {cloneDeep} from '../utils'


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

export const menu = function(state=initialMenu, action) {
    switch (action.type) {
        case ActionTypes.SELECT_MENU_ITEM: {
            const {label} = action
            const clonedState = cloneDeep(state)
            selectMenuItem(clonedState, label)
            return clonedState
        }
        default:
            return state
    }
}
export default menu
