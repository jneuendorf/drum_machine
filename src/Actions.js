import Enum from "./utils/Enum"
import {ListActions} from './reducers/ListReducer'


export const ActionTypes = Enum([
    'SET_STORE_STATE',
    'DISPLAY_STORE_STATE',

    'ADD_EMPTY_MEASURE',
    'ADD_CLONED_MEASURE',
    'ADD_MEASURE_FROM_TEMPLATE',
    'TOGGLE_NOTE',
    'SET_VOLUME',
    'ADD_TUPLET',
    'REMOVE_TUPLET',
    'SET_VOLUMES',
    'SET_BPM',
    'SET_NUMBER_OF_BEATS',
    'SET_NOTE_VALUE',
    'SET_MIN_NOTE_VALUE',
    'CLEAR_MEASURE',
    'REMOVE_MEASURE',

    'CREATE_MEASURE_TEMPLATE',
    'SET_CURRENT_MENU_INTERACTION',
    'CONTINUE_NOTE_PATTERN',

    'START_LOADING_DRUMKIT',
    'DONE_LOADING_DRUMKIT',

    'SET_CURRENT_PLAY_POS',
    'SET_PLAYING_STATE',
    'TOGGLE_LOOP_STATE',
    'TOGGLE_FREEZE_UI_WHILE_PLAYING_STATE',
])


export const setStoreState = state => ({
    type: ActionTypes.SET_STORE_STATE,
    state,
})

export const displayStoreState = state => ({
    type: ActionTypes.DISPLAY_STORE_STATE,
    state,
})


export const addEmptyMeasure = measure => ({
    type: ActionTypes.ADD_EMPTY_MEASURE,
    measure,
    meta: ListActions.append(measure),
})

export const addClonedMeasure = () => ({
    type: ActionTypes.ADD_CLONED_MEASURE,
    meta: ListActions.append(),
})

export const addMeasureFromTemplate = ({measure}) => ({
    type: ActionTypes.ADD_MEASURE_FROM_TEMPLATE,
    meta: ListActions.append(measure),
})

export const toggleNote = (measure, instrument, noteIndex, tupletNoteIndex) => ({
    type: ActionTypes.TOGGLE_NOTE,
    instrument, noteIndex, tupletNoteIndex,
    meta: ListActions.update(measure),
})

export const setVolume = (...args) => {
    let measure, instrument, noteIndex, tupletNoteIndex, volume
    if (args.length === 4) {
        [measure, instrument, noteIndex, volume] = args
    }
    else if (args.length === 5) {
        [measure, instrument, noteIndex, tupletNoteIndex, volume] = args
    }
    else {
        throw new Error('Invalid arguments.')
    }
    return {
        type: ActionTypes.SET_VOLUME,
        instrument, noteIndex, tupletNoteIndex, volume,
        meta: ListActions.update(measure),
    }
}

export const setVolumes = (measure, instrument, volume) => ({
    type: ActionTypes.SET_VOLUMES,
    measure, instrument, volume,
    meta: ListActions.update(measure),
})

export const addTuplet = (measure, instrument, noteIndex, notesToReplace, notesInTuplet) => ({
    type: ActionTypes.ADD_TUPLET,
    measure, instrument, noteIndex, notesToReplace, notesInTuplet,
    meta: ListActions.update(measure),
})

export const removeTuplet = (measure, instrument, noteIndex) => ({
    type: ActionTypes.REMOVE_TUPLET,
    measure, instrument, noteIndex,
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

export const clearMeasure = measure => ({
    type: ActionTypes.CLEAR_MEASURE,
    meta: ListActions.update(measure),
})

export const removeMeasure = measure => ({
    type: ActionTypes.REMOVE_MEASURE,
    meta: ListActions.remove(measure),
})


export const createMeasureTemplate = (name, measure) => ({
    type: ActionTypes.CREATE_MEASURE_TEMPLATE,
    name, measure
})

export const setCurrentMenuInteraction = (currentInteraction) => ({
    type: ActionTypes.SET_CURRENT_MENU_INTERACTION,
    currentInteraction
})

export const continueNotePattern = (measure, instrument) => ({
    type: ActionTypes.CONTINUE_NOTE_PATTERN,
    measure, instrument,
    meta: ListActions.update(measure),
})


export const loadDrumkit = function(drumkitName, howl) {
    return (dispatch, getState) => {
        dispatch(startLoadingDrumkit(drumkitName))
        howl.once('loaderror', function() {
            console.log('error')
        }).once('load', function() {
            dispatch(finishLoadingDrumkit(drumkitName))
            // // TODO: remove
            // howl.play("Hi-hat")
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


export const setCurrentPlayPos = (measureIndex, time) => ({
    type: ActionTypes.SET_CURRENT_PLAY_POS,
    measureIndex, time,
})

export const setPlayingState = playingState => ({
    type: ActionTypes.SET_PLAYING_STATE,
    playingState,
})

export const toggleLoopState = () => ({
    type: ActionTypes.TOGGLE_LOOP_STATE,
})

export const toggleFreezeUiWhilePlaying = () => ({
    type: ActionTypes.TOGGLE_FREEZE_UI_WHILE_PLAYING_STATE,
})
