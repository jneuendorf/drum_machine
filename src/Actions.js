import Enum from "./utils/Enum"


// action type
export const ActionTypes = Enum([
    'ADD_MEASURE',
    'ADD_CLONED_MEASURE',
    'TOGGLE_NOTE',
    'SET_VOLUME',
    'START_LOADING_DRUMKIT',
    'DONE_LOADING_DRUMKIT',
    'SELECT_MENU_ITEM',
])


// action creators
export const addMeasure = (measure) => ({
    type: ActionTypes.ADD_MEASURE,
    measure,
})

export const addClonedMeasure = (drumkit) => ({
    type: ActionTypes.ADD_CLONED_MEASURE,
    drumkit,
})

export const toggleNote = (measureIndex, instrument, noteIndex) => ({
    type: ActionTypes.TOGGLE_NOTE,
    measureIndex, instrument, noteIndex,
})

export const setVolume = (measureIndex, instrument, noteIndex, volume) => ({
    type: ActionTypes.SET_VOLUME,
    measureIndex, instrument, noteIndex, volume,
})

export const loadDrumkit = function(drumkitName, howl) {
    return (dispatch, getState) => {
        dispatch(startLoadingDrumkit(drumkitName))
        howl.once('loaderror', function() {
            console.log('error');
        }).once('load', function() {
            dispatch(finishLoadingDrumkit(drumkitName))
            howl.play("Hi-hat")
        })
        howl.load()
    }
}

export const startLoadingDrumkit = name => ({
    type: ActionTypes.START_LOADING_DRUMKIT,
    name,
})

export const finishLoadingDrumkit = name => ({
    type: ActionTypes.DONE_LOADING_DRUMKIT,
    name,
})

export const selectMenuItem = label => ({
    type: ActionTypes.SELECT_MENU_ITEM,
    label,
})

// export default {
//     addMeasure
// }