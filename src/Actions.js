import Enum from "./utils/Enum"
import {ListActions} from './reducers/ListReducer'


export const ActionTypes = Enum([
    'ADD_MEASURE',
    'ADD_CLONED_MEASURE',
    'TOGGLE_NOTE',
    'SET_VOLUME',
    'SET_BPM',
    'SET_NUMBER_OF_BEATS',
    'SET_NOTE_VALUE',
    'SET_MIN_NOTE_VALUE',
    'CLEAR_MEASURE',
    'REMOVE_MEASURE',

    'START_LOADING_DRUMKIT',
    'DONE_LOADING_DRUMKIT',

    'SELECT_MENU_ITEM',
])


export const addMeasure = (measure) => ({
    type: ActionTypes.ADD_MEASURE,
    measure,
    meta: ListActions.append(measure),
})

export const addClonedMeasure = () => ({
    type: ActionTypes.ADD_CLONED_MEASURE,
    meta: ListActions.append(),
})

export const toggleNote = (measure, instrument, noteIndex) => ({
    type: ActionTypes.TOGGLE_NOTE,
    instrument, noteIndex,
    meta: ListActions.update(measure),
})

export const setVolume = (measure, instrument, noteIndex, volume) => ({
    type: ActionTypes.SET_VOLUME,
    instrument, noteIndex, volume,
    meta: ListActions.update(measure),
})

export const setBpm = (measure, bpm) => ({
    type: ActionTypes.SET_BPM,
    bpm,
    meta: ListActions.update(measure),
})

export const setNoteValue = (measure, noteValue) => ({
    type: ActionTypes.SET_NOTE_VALUE,
    noteValue,
    meta: ListActions.update(measure),
})

export const setNumberOfBeats = (measure, numberOfBeats) => ({
    type: ActionTypes.SET_NUMBER_OF_BEATS,
    numberOfBeats,
    meta: ListActions.update(measure),
})

export const setMinNoteValue = (measure, minNoteValue) => ({
    type: ActionTypes.SET_MIN_NOTE_VALUE,
    minNoteValue,
    meta: ListActions.update(measure),
})

export const clearMeasure = (measure) => ({
    type: ActionTypes.CLEAR_MEASURE,
    meta: ListActions.update(measure),
})

export const removeMeasure = (measure) => ({
    type: ActionTypes.REMOVE_MEASURE,
    meta: ListActions.remove(measure),
})



export const loadDrumkit = function(drumkitName, howl) {
    return (dispatch, getState) => {
        dispatch(startLoadingDrumkit(drumkitName))
        howl.once('loaderror', function() {
            console.log('error');
        }).once('load', function() {
            dispatch(finishLoadingDrumkit(drumkitName))
            // TODO: remove
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
