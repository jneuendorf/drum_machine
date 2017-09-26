import {initialDrumkits} from './drumkits'
import {ActionTypes} from '../Actions'
import {listReducer} from './ListReducer'
import {cloneDeep, last, filledArray, arrayChangedSize} from '../utils'


console.log("arrayChangedSize", arrayChangedSize([1,2,3], 12))
console.log("arrayChangedSize", arrayChangedSize([1,2,3,4], 2))


const getNumberOfNotes = function(numberOfBeats, noteValue, minNoteValue) {
    return numberOfBeats * (minNoteValue / noteValue)
}

const createMeasure = function(numberOfBeats=4, noteValue=4, minNoteValue=8, drumkit='default', bpm=120) {
    const notesByInstrument = {}
    const measure = {
        numberOfBeats,
        noteValue,
        minNoteValue,
        drumkit,
        notes: notesByInstrument,
        bpm,
    }
    const {instruments} = initialDrumkits[drumkit]
    const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
    for (const instrument of instruments) {
        notesByInstrument[instrument] = filledArray(
            // 4/4 => 8, 6/8 => 12, 3/4 => 6
            numberOfNotes,
            0
        )
    }
    return measure
}

const measure = function(state, action, meta) {
    switch (action.type) {
        case ActionTypes.ADD_MEASURE:
            return action.measure
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
            console.warn('should not happen');
            return state
    }
}


const measures = listReducer(measure)

export default measures
