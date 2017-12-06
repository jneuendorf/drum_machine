import {ActionTypes} from '../Actions'


const initialMenu = {
    measureTemplates: [],
    currentInteraction: null,
}


export const menu = function(state=initialMenu, action) {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_MENU_INTERACTION: {
            const {currentInteraction} = action
            return Object.assign({}, state, {currentInteraction})
        }
        case ActionTypes.CREATE_MEASURE_TEMPLATE: {
            const {name, measures} = action
            return Object.assign({}, state, {
                measureTemplates: state.measureTemplates.concat([{name, measures}])
            })
        }
        default:
            return state
    }
}

export default menu
