import {initialDrumkits} from './drumkits'
import {ActionTypes} from '../Actions'
import {listReducer} from './ListReducer'
import {
    getNumberOfNotes,
    cloneDeep,
    last,
    filledArray,
    arrayChangedSize,
    dict,
} from '../utils'


const createMeasure = function(numberOfBeats=4, noteValue=4, minNoteValue=8, drumkit='default', bpm=120) {
    const notesByInstrument = {}
    const {instruments} = initialDrumkits[drumkit]
    const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
    for (const instrument of instruments) {
        notesByInstrument[instrument] = filledArray(
            // 4/4 => 8, 6/8 => 12, 3/4 => 6
            numberOfNotes,
            0
        )
    }
    return {
        numberOfBeats,
        noteValue,
        minNoteValue,
        drumkit,
        notes: notesByInstrument,
        bpm,
    }
}

const measure = function(state, action, meta) {
    switch (action.type) {
        case ActionTypes.ADD_EMPTY_MEASURE: {
            let lastMeasure = last(meta.list)
            if (lastMeasure) {
                return Object.assign(cloneDeep(lastMeasure), {
                    notes: dict(Object.entries(lastMeasure.notes).map(
                        ([instrument, notes]) =>
                            [instrument, notes.map(note => 0)]
                    ))
                })
            }
            return createMeasure()
        }
        case ActionTypes.ADD_CLONED_MEASURE: {
            // const {drumkit} = action
            // const lastMeasure = last(state)
            const lastMeasure = last(meta.list)
            return lastMeasure ? cloneDeep(lastMeasure) : createMeasure()
        }
        case ActionTypes.TOGGLE_NOTE: {
            const {instrument, noteIndex} = action
            const {notes} = state
            return Object.assign({}, state, {
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
        }
        case ActionTypes.SET_VOLUME: {
            const {instrument, noteIndex, volume: newVolume} = action
            const {notes} = state
            return Object.assign({}, state, {
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
        }
        case ActionTypes.SET_VOLUMES: {
            const {instrument, volume: newVolume} = action
            const {notes} = state
            return Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: notes[instrument].map(volume => newVolume)
                }
            })
        }
        case ActionTypes.SET_BPM: {
            const {bpm} = action
            return Object.assign({}, state, {bpm})
        }
        case ActionTypes.SET_NUMBER_OF_BEATS: {
            const {numberOfBeats} = action
            return Object.assign({}, state, {numberOfBeats})
        }
        case ActionTypes.SET_NOTE_VALUE: {
            const {noteValue} = action
            return Object.assign({}, state, {noteValue})
        }
        case ActionTypes.SET_MIN_NOTE_VALUE: {
            const {minNoteValue} = action
            const {numberOfBeats, noteValue, notes: oldNotes} = state
            const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
            const notes = {}
            for (const [instrument, instrumentNotes] of Object.entries(oldNotes)) {
                notes[instrument] = arrayChangedSize(instrumentNotes, numberOfNotes, 0)
            }
            return Object.assign({}, state, {minNoteValue, notes})
        }
        case ActionTypes.CLEAR_MEASURE: {
            const {notes: oldNotes} = state
            const notes = {}
            for (const [instrument, instrumentNotes] of Object.entries(oldNotes)) {
                notes[instrument] = instrumentNotes.map(item => 0)
            }
            return Object.assign({}, state, {notes})
        }
        default:
            console.warn('should not happen: measures reducer got action with type', action.type)
            return state
    }
}


const measures = listReducer(measure)

export default measures
