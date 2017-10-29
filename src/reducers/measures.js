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



const getNextId = (function() {
    let id = 0
    return function() {
        return id++
    }
})()

const setNextId = function(measure) {
    measure.id = getNextId()
    return measure
}

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
        id: getNextId(),
        numberOfBeats,
        noteValue,
        minNoteValue,
        drumkit,
        notes: notesByInstrument,
        bpm,
    }
}

const cloneMeasure = function(measure) {
    return setNextId(cloneDeep(measure))
}

const measure = function(state, action, meta) {
    switch (action.type) {
        case ActionTypes.ADD_EMPTY_MEASURE: {
            let lastMeasure = last(meta.list)
            if (lastMeasure) {
                return Object.assign(cloneMeasure(lastMeasure), {
                    notes: dict(Object.entries(lastMeasure.notes).map(
                        ([instrument, notes]) =>
                            [instrument, notes.map(note => 0)]
                    ))
                })
            }
            return createMeasure()
        }
        case ActionTypes.ADD_CLONED_MEASURE: {
            const lastMeasure = last(meta.list)
            return lastMeasure ? cloneMeasure(lastMeasure) : createMeasure()
        }
        case ActionTypes.ADD_MEASURE_FROM_TEMPLATE:
            return cloneMeasure(state)
        case ActionTypes.TOGGLE_NOTE: {
            const {instrument, noteIndex, tupletNoteIndex} = action
            const {notes} = state
            return setNextId(Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: notes[instrument].map((note, index) => {
                        if (index !== noteIndex) {
                            return note
                        }
                        if (!Array.isArray(note)) {
                            // toggle between 0 and 1
                            return note^1
                        }
                        return [
                            note[0],
                            ...note.slice(1).map((tupletNote, index) => {
                                if (index !== tupletNoteIndex) {
                                    return tupletNote
                                }
                                return tupletNote^1
                            })
                        ]
                    })
                }
            }))
        }
        case ActionTypes.SET_VOLUME: {
            const {instrument, noteIndex, tupletNoteIndex, volume: newVolume} = action
            const {notes} = state
            return setNextId(Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: notes[instrument].map((note, index) => {
                        if (index !== noteIndex) {
                            return note
                        }

                        if (!Array.isArray(note)) {
                            return newVolume
                        }
                        return [
                            note[0],
                            ...note.slice(1).map((tupletNote, index) => {
                                if (index !== tupletNoteIndex) {
                                    return tupletNote
                                }
                                return newVolume
                            })
                        ]
                    })
                }
            }))
        }
        case ActionTypes.SET_VOLUMES: {
            const {instrument, volume: newVolume} = action
            const {notes} = state
            return setNextId(Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: notes[instrument].map(volume => newVolume)
                }
            }))
        }
        case ActionTypes.ADD_TUPLET: {
            const {instrument, noteIndex, notesToReplace, notesInTuplet} = action
            const {notes} = state
            const instrumentNotes = notes[instrument]
            debugger
            return setNextId(Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: [
                        notesToReplace,
                        ...instrumentNotes.slice(0, noteIndex > 0 ? noteIndex - 1 : 0),
                        filledArray(notesInTuplet, 1),
                        ...instrumentNotes.slice(noteIndex + notesToReplace)
                    ]
                }
            }))
        }
        case ActionTypes.SET_BPM: {
            const {bpm} = action
            return setNextId(Object.assign({}, state, {bpm}))
        }
        case ActionTypes.SET_NUMBER_OF_BEATS: {
            const {numberOfBeats} = action
            return setNextId(Object.assign({}, state, {numberOfBeats}))
        }
        case ActionTypes.SET_NOTE_VALUE: {
            const {noteValue} = action
            return setNextId(Object.assign({}, state, {noteValue}))
        }
        case ActionTypes.SET_MIN_NOTE_VALUE: {
            const {minNoteValue} = action
            const {numberOfBeats, noteValue, notes: oldNotes} = state
            const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
            const notes = {}
            for (const [instrument, instrumentNotes] of Object.entries(oldNotes)) {
                notes[instrument] = arrayChangedSize(instrumentNotes, numberOfNotes, 0)
            }
            return setNextId(Object.assign({}, state, {minNoteValue, notes}))
        }
        case ActionTypes.CLEAR_MEASURE: {
            const {notes: oldNotes} = state
            const notes = {}
            for (const [instrument, instrumentNotes] of Object.entries(oldNotes)) {
                notes[instrument] = instrumentNotes.map(item => 0)
            }
            return setNextId(Object.assign({}, state, {notes}))
        }
        default:
            return state
    }
}


const measures = listReducer(measure)

export default measures
