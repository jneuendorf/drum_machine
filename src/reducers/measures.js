import takeRightWhile from 'lodash.takerightwhile'

import {initialDrumkits} from './drumkits'
import {ActionTypes} from '../Actions'
import {listReducer} from './ListReducer'
import {
    cloneDeep,
    last,
    filledArray,
    arrayChangedSize,
    dict,
} from '../utils'
import {
    getNextId,
    getNumberOfNotes,
    getNumberOfNoteValues,
    mapNotes,
} from '../utils/measure'



const setNextId = function(measure) {
    measure.id = getNextId()
    return measure
}

const createMeasure = function(numberOfBeats=4, noteValue=4, minNoteValue=8, drumkit='default', bpm=120) {
    const notesByInstrument = {}
    const {instruments} = initialDrumkits[drumkit]
    const numberOfNotes = getNumberOfNotes({numberOfBeats, noteValue, minNoteValue})
    for (const instrument of instruments) {
        notesByInstrument[instrument] = filledArray(
            // 4/4 => 8, 6/8 => 12, 3/4 => 6
            numberOfNotes,
            0
        )
    }
    return {
        id: getNextId(),
        name: '',
        bpm,
        numberOfBeats,
        noteValue,
        minNoteValue,
        drumkit,
        notes: notesByInstrument,
    }
}

const cloneMeasure = function(measure) {
    return setNextId(cloneDeep(measure))
}

const measure = function(state, action, meta) {
    switch (action.type) {
        case ActionTypes.ADD_EMPTY_MEASURE: {
            let lastMeasure = last(
                meta.list,
                measure => typeof(measure) !== 'string'
            )
            if (lastMeasure) {
                const numberOfNotes = getNumberOfNotes(lastMeasure)
                // Use last measure's drumkit, BPM etc.
                return Object.assign(cloneMeasure(lastMeasure), {
                    notes: dict(Object.entries(lastMeasure.notes).map(
                        ([instrument, notes]) =>
                            [instrument, filledArray(numberOfNotes, 0)]
                    ))
                })
            }
            return createMeasure()
        }
        case ActionTypes.ADD_CLONED_MEASURE: {
            const lastMeasure = last(
                meta.list,
                measure => typeof(measure) !== 'string'
            )
            return lastMeasure ? cloneMeasure(lastMeasure) : createMeasure()
        }
        case ActionTypes.ADD_COMMENT: {
            return action.comment
        }
        case ActionTypes.ADD_MEASURE_FROM_TEMPLATE: {
            const {name} = action
            const num = meta.index + 1
            return Object.assign(cloneMeasure(state), {name: `${name}#${num}`})
        }
        case ActionTypes.TOGGLE_NOTE: {
            const {instrument, noteIndex, tupletNoteIndex} = action
            const {notes} = state
            return Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: mapNotes(
                        notes[instrument],
                        (note, index) => index === noteIndex ? note^1 : note,
                        (note, tIndex, nIndex) => nIndex === noteIndex && tIndex === tupletNoteIndex ? note^1 : note,
                    ),
                }
            })
        }
        case ActionTypes.SET_VOLUME: {
            const {instrument, noteIndex, tupletNoteIndex, volume: newVolume} = action
            const {notes} = state
            return Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: mapNotes(
                        notes[instrument],
                        (note, index) => index === noteIndex ? newVolume : note,
                        (note, tIndex, nIndex) => nIndex === noteIndex && tIndex === tupletNoteIndex ? newVolume : note,
                    ),
                }
            })
        }
        case ActionTypes.SET_VOLUMES: {
            const {instrument, volume: newVolume} = action
            const {notes} = state
            return Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: mapNotes(
                        notes[instrument],
                        note => newVolume,
                    ),
                }
            })
        }
        case ActionTypes.ADD_TUPLET: {
            const {instrument, noteIndex, notesToReplace, notesInTuplet} = action
            const {notes} = state
            const instrumentNotes = notes[instrument]
            return Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: [
                        ...instrumentNotes.slice(0, noteIndex >= 0 ? noteIndex : 0),
                        [notesToReplace, ...filledArray(notesInTuplet, 1)],
                        ...instrumentNotes.slice(noteIndex + notesToReplace)
                    ]
                }
            })
        }
        case ActionTypes.REMOVE_TUPLET: {
            const {instrument, noteIndex} = action
            const {notes} = state
            const instrumentNotes = notes[instrument]
            return Object.assign({}, state, {
                notes: {
                    ...notes,
                    [instrument]: [
                        ...instrumentNotes.slice(0, noteIndex >= 0 ? noteIndex : 0),
                        ...filledArray(instrumentNotes[noteIndex][0], 0),
                        ...instrumentNotes.slice(noteIndex + 1)
                    ]
                }
            })
        }
        case ActionTypes.SET_NAME: {
            const {name} = action
            return Object.assign({}, state, {name})
        }
        case ActionTypes.SET_BPM: {
            const {bpm} = action
            return Object.assign({}, state, {bpm})
        }
        case ActionTypes.SET_NUMBER_OF_BEATS: {
            const {numberOfBeats} = action
            const {notes: oldNotes} = state
            const newState = Object.assign({}, state, {numberOfBeats})
            const numberOfNotes = getNumberOfNotes(newState)
            const notes = {}
            for (const instrument of Object.keys(oldNotes)) {
                notes[instrument] = filledArray(numberOfNotes, 0)
            }
            return Object.assign(newState, {notes})
        }
        case ActionTypes.SET_NOTE_VALUE: {
            const {noteValue} = action
            const {notes: oldNotes} = state
            const newState = Object.assign({}, state, {noteValue})
            const numberOfNotes = getNumberOfNotes(newState)
            const notes = {}
            for (const instrument of Object.keys(oldNotes)) {
                notes[instrument] = filledArray(numberOfNotes, 0)
            }
            return Object.assign(newState, {notes})
        }
        case ActionTypes.SET_MIN_NOTE_VALUE: {
            const {minNoteValue} = action
            const {notes: oldNotes} = state
            const newState = Object.assign({}, state, {minNoteValue})
            const numberOfNotes = getNumberOfNotes(newState)
            const notes = {}
            for (const [instrument, instrumentNotes] of Object.entries(oldNotes)) {
                notes[instrument] = arrayChangedSize(instrumentNotes, numberOfNotes, 0)
            }
            return Object.assign(newState, {notes})
        }
        case ActionTypes.CLEAR_MEASURE: {
            const {notes: oldNotes} = state
            const notes = dict(
                Object.entries(oldNotes).map(([instrument, instrumentNotes]) =>
                    [instrument, mapNotes(instrumentNotes, note => 0)]
                )
            )
            return Object.assign({}, state, {notes})
        }
        case ActionTypes.CONTINUE_NOTE_PATTERN: {
            const {instrument} = action
            const {notes: allNotes} = state
            const {[instrument]: notes} = allNotes
            const emptyNotes = takeRightWhile(notes, note => note === 0)
            const freeSlots = emptyNotes.length
            // Prevent infinite loop when an empty note row was clicked.
            if (freeSlots === notes.length) {
                return state
            }
            const currentPattern = notes.slice(0, -freeSlots)
            const currentPatternNumNotes = getNumberOfNoteValues(currentPattern)
            // Add the entire current pattern until all notes are filled.
            // This might result in a too long list of notes.
            // That's why its truncated accordingly afterwards.
            let continuedPattern = []
            let consumableSlots = freeSlots
            while (consumableSlots > 0) {
                continuedPattern.push(...currentPattern)
                consumableSlots -= currentPatternNumNotes
            }
            while (getNumberOfNoteValues(continuedPattern) > freeSlots) {
                continuedPattern.splice(-1, 1)
            }
            return Object.assign({}, state, {
                notes: {
                    ...allNotes,
                    [instrument]: [...currentPattern, ...continuedPattern],
                }
            })
        }
        default:
            return state
    }
}


const measures = listReducer(measure)

export default measures
