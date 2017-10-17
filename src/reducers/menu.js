import {ActionTypes} from '../Actions'


const initialMenu = {
    activeItem: null,
    measureTemplates: [],
}


export const menu = function(state=initialMenu, action) {
    switch (action.type) {
        case ActionTypes.SELECT_MENU_ITEM: {
            const {label: activeItem} = action
            return Object.assign({}, state, {activeItem})
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
