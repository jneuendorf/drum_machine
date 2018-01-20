import Enum from "./utils/Enum"
import {ListActions} from './reducers/ListReducer'


export const ActionTypes = Enum([
    'SET_STORE_STATE',
    'DISPLAY_STORE_STATE',

    'ADD_EMPTY_MEASURE',
    'ADD_CLONED_MEASURE',
    'ADD_COMMENT',
    'ADD_MEASURE_FROM_TEMPLATE',
    'TOGGLE_NOTE',
    'SET_VOLUME',
    'ADD_TUPLET',
    'REMOVE_TUPLET',
    'SET_VOLUMES',
    'SET_NAME',
    'SET_BPM',
    'SET_NUMBER_OF_BEATS',
    'SET_NOTE_VALUE',
    'SET_MIN_NOTE_VALUE',
    'CLEAR_MEASURE',
    'REMOVE_MEASURE',
    'SET_SHOW_SETTINGS',

    'CREATE_MEASURE_TEMPLATE',
    'SET_CURRENT_MENU_INTERACTION',
    'CONTINUE_NOTE_PATTERN',

    'SET_LOADING',

    'START_LOADING_DRUMKIT',
    'DONE_LOADING_DRUMKIT',

    'SET_CURRENT_PLAY_POS',
    'SET_PLAYING_STATE',
    'TOGGLE_LOOP_STATE',
    'TOGGLE_FREEZE_UI_WHILE_PLAYING_STATE',
    'GO_TO_MEASURE',
])


export const setStoreState = state => ({
    type: ActionTypes.SET_STORE_STATE,
    state,
})

export const displayStoreState = state => ({
    type: ActionTypes.DISPLAY_STORE_STATE,
    state,
})


export const addEmptyMeasure = () => ({
    type: ActionTypes.ADD_EMPTY_MEASURE,
    meta: ListActions.append(null),
})

export const addClonedMeasure = () => ({
    type: ActionTypes.ADD_CLONED_MEASURE,
    meta: ListActions.append(null),
})

export const addComment = comment => ({
    type: ActionTypes.ADD_COMMENT,
    comment,
    meta: ListActions.append(null),
})

export const addMeasureFromTemplate = ({name, measures}) => ({
    type: ActionTypes.ADD_MEASURE_FROM_TEMPLATE,
    name,
    meta: ListActions.append(...measures),
})

export const toggleNote = (measureIndex, instrument, noteIndex, tupletNoteIndex) => ({
    type: ActionTypes.TOGGLE_NOTE,
    instrument, noteIndex, tupletNoteIndex,
    meta: ListActions.updateAt(measureIndex),
})

export const setVolume = (...args) => {
    let measureIndex, instrument, noteIndex, tupletNoteIndex, volume
    if (args.length === 4) {
        [measureIndex, instrument, noteIndex, volume] = args
    }
    else if (args.length === 5) {
        [measureIndex, instrument, noteIndex, tupletNoteIndex, volume] = args
    }
    else {
        throw new Error('Invalid arguments.')
    }
    return {
        type: ActionTypes.SET_VOLUME,
        instrument, noteIndex, tupletNoteIndex, volume,
        meta: ListActions.updateAt(measureIndex),
    }
}

export const setVolumes = (measureIndex, instrument, volume) => ({
    type: ActionTypes.SET_VOLUMES,
    instrument, volume,
    meta: ListActions.updateAt(measureIndex),
})

export const addTuplet = (measureIndex, instrument, noteIndex, notesToReplace, notesInTuplet) => ({
    type: ActionTypes.ADD_TUPLET,
    instrument, noteIndex, notesToReplace, notesInTuplet,
    meta: ListActions.updateAt(measureIndex),
})

export const removeTuplet = (measureIndex, instrument, noteIndex) => ({
    type: ActionTypes.REMOVE_TUPLET,
    instrument, noteIndex,
    meta: ListActions.updateAt(measureIndex),
})

export const setName = (measure, name) => ({
    type: ActionTypes.SET_NAME,
    name,
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

export const setShowSettings = (measureIndex, showSettings) => ({
    type: ActionTypes.SET_SHOW_SETTINGS,
    showSettings,
    meta: ListActions.updateAt(measureIndex),
})


export const createMeasureTemplates = (name, measures) => ({
    type: ActionTypes.CREATE_MEASURE_TEMPLATE,
    name, measures
})

export const setCurrentMenuInteraction = (currentInteraction) => ({
    type: ActionTypes.SET_CURRENT_MENU_INTERACTION,
    currentInteraction
})

export const continueNotePattern = (measureIndex, instrument) => ({
    type: ActionTypes.CONTINUE_NOTE_PATTERN,
    instrument,
    meta: ListActions.updateAt(measureIndex),
})


export const setLoading = isLoading => ({
    type: ActionTypes.SET_LOADING,
    isLoading,
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
