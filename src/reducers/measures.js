import {ActionTypes} from '../Actions'
import {cloneDeep, last, filledArray} from '../utils'


const createMeasure = function(numberOfBeats, noteValue, drumkit) {
    const notesByInstrument = {}
    // TODO: use drumkit of previous measure for convenience
    const measure = {
        numberOfBeats,
        noteValue,
        drumkit: drumkit.name,
        notes: notesByInstrument,
    }
    const {instruments} = drumkit
    for (const instrument of instruments) {
        notesByInstrument[instrument] = filledArray(
            // 4/4 => 8, 6/8 => 12, 3/4 => 6
            numberOfBeats * 2,
            0
        )
    }
    return measure
}

const createDefaultMeasure = function(drumkit) {
    return createMeasure(4, 4, drumkit)
}


export const measures = function(state=[], action) {
    switch (action.type) {
        case ActionTypes.ADD_MEASURE: {
            return [
                ...state,
                action.measure
            ]
        }
        case ActionTypes.ADD_CLONED_MEASURE: {
            const {drumkit} = action
            const lastMeasure = last(state)
            const clonedMeasure = lastMeasure ? cloneDeep(lastMeasure) : createDefaultMeasure(drumkit)
            return [
                ...state,
                clonedMeasure
            ]
        }
        case ActionTypes.TOGGLE_NOTE: {
            const {measureIndex, instrument, noteIndex} = action
            const measure = state[measureIndex]
            const {notes} = measure
            const newMeasure = Object.assign({}, measure, {
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
            return state.slice(0, measureIndex)
                .concat([newMeasure])
                .concat(state.slice(measureIndex + 1))
        }
        case ActionTypes.SET_VOLUME: {
            const {measureIndex, instrument, noteIndex, volume: newVolume} = action
            const measure = state[measureIndex]
            const {notes} = measure
            const newMeasure = Object.assign({}, measure, {
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
            return state.slice(0, measureIndex)
                .concat([newMeasure])
                .concat(state.slice(measureIndex + 1))
        }
        default:
            return state
    }
}
export default measures
