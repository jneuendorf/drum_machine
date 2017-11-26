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
            const {name, measure} = action
            return Object.assign({}, state, {
                measureTemplates: state.measureTemplates.concat([{name, measure}])
            })
        }
        default:
            return state
    }
}

export default menu
