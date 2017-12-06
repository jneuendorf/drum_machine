import {SortedMap} from 'immutable-sorted'

import {areEqual} from '.'



let baseMeasureId = 0
let idCounter = 0
export const resetIdGenerator = function(greatestUsedId) {
    baseMeasureId = greatestUsedId + 1
    idCounter = 0
}

export const getNextId = function() {
    return baseMeasureId + idCounter++
}


// Creates a group of sounds for each tick.
// Here, a sound means {instrument, volume}.
// Each group knows how much time to wait until the next group has to be played.
export const getGroupedSounds = function(measure) {
    const {notes} = measure
    const addSoundToGroup = function(group=[], instrument, volume) {
        if (volume > 0) {
            return group.concat({instrument, volume})
        }
        return group
    }
    const numberOfNotes = getNumberOfNotes(measure)

    /*
    A:  1,  0,  1, 0
    B: [1,1,1], 0, 0

    time     A,B
    ------------
    0%    -> 1,1
    16.6% -> 0,1
    25%   -> 0,0
    33.3% -> 0,1
    50%   -> 1,0
    75%   -> 0,0
    */
    const groups = {}
    const notesByInstrument = notes
    for (const [instrument, notes] of Object.entries(notesByInstrument)) {
        // In contrary to the index (which belongs to the note array)
        // the position determines where the note is in the measure.
        // For example, take a measure consisting of a tuplet spanning 2 notes
        // and 2 regular notes. The tuplet is an array - thus the index of the
        // note following the tuplet is 1, but its position is 2 (since the
        // tuplet is taking 2 slots).
        const notePositions = getNotePositions(notes)
        for (const noteIndex of notes.keys()) {
            const note = notes[noteIndex]
            const notePosition = notePositions[noteIndex]
            const tickPercent = notePosition / numberOfNotes
            if (Array.isArray(note)) {
                const [replacedNotes, ...volumes] = note
                const volumePercent = (replacedNotes / numberOfNotes) / volumes.length
                for (const volumeIndex of volumes.keys()) {
                    const volume = volumes[volumeIndex]
                    const percent = tickPercent + volumeIndex * volumePercent
                    groups[percent] = addSoundToGroup(groups[percent], instrument, volume)
                }
            }
            else {
                const volume = note
                const percent = tickPercent
                groups[percent] = addSoundToGroup(groups[percent], instrument, volume)
            }
        }
    }
    const duration = numberOfNotes * getMsBetweenNotes(measure)
    return SortedMap(
        Object.entries(groups)
        .map(([percent, group]) => [roundedTime(Number(percent) * duration), group]),
        (a, b) => {
            if (a < b) {
                return -1
            }
            if (a > b) {
                return a
            }
            return 0
        }
    )
}

// When we're talking about the time of a note we mean the rounded time.
// Since humans can only hear above around 20Hz (-> 50ms distance) we don't
// need exact times. Thus 'getGroupedSounds' and the 'currentPlayPos' use
// the rounded time.
export const roundedTime = function(time) {
    return Math.round(time)
}

export const getNumberOfNotes = function(measure) {
    const {numberOfBeats, noteValue, minNoteValue} = measure
    return numberOfBeats * (minNoteValue / noteValue)
}

export const getMsBetweenNotes = function(measure) {
    const {noteValue, minNoteValue, bpm} = measure
    // Here we return the mathematically simplified version of:
    // ((numberOfBeats * 60000) / bpm) / getNumberOfNotes(measure)
    return (noteValue * 60000) / bpm / minNoteValue
}

export const getDuration = function(measure) {
    return getNumberOfNotes(measure) * getMsBetweenNotes(measure)
}

export const getNotePositions = function(notes) {
    let notePosition = 0
    const notePositions = []
    for (const noteIndex of notes.keys()) {
        const note = notes[noteIndex]
        notePositions.push(notePosition)
        if (Array.isArray(note)) {
            notePosition += note[0]
        }
        else {
            notePosition += 1
        }
    }
    return notePositions
}

// @param modifier [Function] This callback is applied to all atomic notes (-> not tuplets).
// @return [Array] The result of the modifier for each note.
export const mapNotes = function(notes, modifier, tupletModifier=null) {
    if (!tupletModifier) {
        tupletModifier = modifier
    }
    return notes.map((note, noteIndex) => {
        if (Array.isArray(note)) {
            return [
                // 'replacedNotes' stays the same.
                note[0],
                ...note.slice(1).map((tupletNote, tupletNoteIndex) =>
                    tupletModifier(tupletNote, tupletNoteIndex, noteIndex)
                )
            ]
        }
        else {
            return modifier(note, noteIndex)
        }
    })
}

// Returns the number of 'normal' notes that are taken by a sequence of notes.
// E.g. [0,0,0] -> 3, [1, [2,0,1,0], 0] -> 4.
// @param notes [Array] List of notes (including tuplets).
export const getNumberOfNoteValues = function(notes) {
    return notes.reduce(
        (num, note) => num + (Array.isArray(note) ? note[0] : 1),
        0
    )
}

export const measuresEqual = function(a, b) {
    /* eslint-disable no-unused-vars */
    const {id: idA, name: nameA, ...dataA} = a
    const {id: idB, name: nameB, ...dataB} = b
    // eslint-enable
    return areEqual(dataA, dataB)
}
