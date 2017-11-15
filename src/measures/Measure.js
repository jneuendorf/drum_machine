import React from 'react'
import ui from 'redux-ui'

import Note from './Note'
import Tuplet from './Tuplet'
import MeasureSettings from './MeasureSettings'
import {defaultConnect, arraysEqual} from '../utils'
import {
    getNotePositions,
    getNumberOfNotes,
    getDuration
} from '../utils/measure'


@ui({
    key: (props) => props.uiKey,
    state: {
        showSettings: false,
    },
})
class Measure extends React.Component {
    // Creates a group of sounds for each tick.
    // Here, a sound means {instrument, volume}.
    // Each group knows how much time to wait until the next group has to be played.
    // static getGroupedSounds(measure) {
    //     const {
    //         numberOfBeats,
    //         noteValue,
    //         minNoteValue,
    //         notes,
    //     } = measure
    //     const addSoundToGroup = function(group=[], instrument, volume) {
    //         if (volume > 0) {
    //             return group.concat({instrument, volume})
    //         }
    //         return group
    //     }
    //     const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
    //
    //     /*
    //     A:  1,  0,  1, 0
    //     B: [1,1,1], 0, 0
    //
    //     time     A,B
    //     ------------
    //     0%    -> 1,1
    //     16.6% -> 0,1
    //     25%   -> 0,0
    //     33.3% -> 0,1
    //     50%   -> 1,0
    //     75%   -> 0,0
    //     */
    //     const groups = {}
    //     const notesByInstrument = notes
    //     for (const [instrument, notes] of Object.entries(notesByInstrument)) {
    //         // In contrary to the index (which belongs to the note array)
    //         // the position determines where the note is in the measure.
    //         // For example, take a measure consisting of a tuplet spanning 2 notes
    //         // and 2 regular notes. The tuplet is an array - thus the index of the
    //         // note following the tuplet is 1, but its position is 2 (since the
    //         // tuplet is taking 2 slots).
    //         let notePosition = 0
    //         for (const noteIndex of notes.keys()) {
    //             const note = notes[noteIndex]
    //             const tickPercent = notePosition / numberOfNotes
    //             if (Array.isArray(note)) {
    //                 const [replacedNotes, ...volumes] = note
    //                 const volumePercent = (replacedNotes / numberOfNotes) / volumes.length
    //                 for (const volumeIndex of volumes.keys()) {
    //                     const volume = volumes[volumeIndex]
    //                     const percent = tickPercent + volumeIndex * volumePercent
    //                     groups[percent] = addSoundToGroup(groups[percent], instrument, volume)
    //                 }
    //                 notePosition += replacedNotes
    //             }
    //             else {
    //                 const volume = note
    //                 const percent = tickPercent
    //                 groups[percent] = addSoundToGroup(groups[percent], instrument, volume)
    //                 notePosition++
    //             }
    //         }
    //     }
    //     return dict(
    //         Object.entries(groups)
    //         .filter(([percent, group]) => group.length > 0)
    //     )
    // }

    render() {
        const {
            drumkits,
            soundControls: {currentPlayPos},
            tab: {notes: {inTupletMode}},
            measure,
            index: measureIndex,
            ui,
            updateUI,
            actions: {toggleNote, setVolume, setVolumes, addTuplet, setTupletMode}
        } = this.props
        const {drumkit: drumkitName, notes/*, sounds: playbackData*/} = measure
        const drumkit = drumkits[drumkitName]
        const {instruments} = drumkit
        const notesPerWholeNote = measure.minNoteValue / measure.numberOfBeats
        return (
            <div className="measure has-border-bottom">
                {instruments.map(instrument => {
                    const instrumentNotes = notes[instrument]
                    const allNotesOn = instrumentNotes.every(note =>
                        !Array.isArray(note)
                        ? note > 0
                        : note.slice(1).every(tupletNote => tupletNote > 0)
                    )
                    const notePositions = getNotePositions(instrumentNotes)
                    const numberOfNotes = getNumberOfNotes(measure)
                    const duration = getDuration(measure)
                    return (
                        <div
                            className="columns is-gapless instrument"
                            key={instrument}
                        >
                            {instrumentNotes
                            .map((note, index) => {
                                if (!Array.isArray(note)) {
                                    const volume = note
                                    const time = notePositions[index] / numberOfNotes * duration
                                    return (
                                        <Note
                                            volume={volume}
                                            toggle={() =>
                                                toggleNote(measure, instrument, index)
                                            }
                                            setVolume={(newVolume) =>
                                                setVolume(measure, instrument, index, newVolume)
                                            }
                                            addTuplet={(notesToReplace, notesInTuplet) => {
                                                let tupletWasAdded
                                                try {
                                                    addTuplet(measure, instrument, index, notesToReplace, notesInTuplet)
                                                    tupletWasAdded = true
                                                }
                                                catch (e) {
                                                    console.error(e)
                                                    tupletWasAdded = false
                                                }
                                                if (tupletWasAdded) {
                                                    setTupletMode(false)
                                                }
                                            }}
                                            key={index}
                                            // TODO: index is wrong: tuplets' replacedNotes must be 'consumed'.
                                            isFirstOfWholeNote={index % notesPerWholeNote === 0}
                                            isCurrentlyPlaying={arraysEqual(
                                                [measureIndex, time],
                                                currentPlayPos
                                            )}
                                            inTupletMode={inTupletMode}
                                        />
                                    )
                                }
                                else {
                                    const [replacedNotes, ...volumes] = note
                                    return (
                                        <Tuplet
                                            toggle={(tupletNoteIndex) =>
                                                toggleNote(measure, instrument, index, tupletNoteIndex)
                                            }
                                            setVolume={(tupletNoteIndex, newVolume) =>
                                                setVolume(measure, instrument, index, tupletNoteIndex, newVolume)
                                            }
                                            key={index}
                                            measureIndex={measureIndex}
                                            noteIndex={index}
                                            replacedNotes={replacedNotes}
                                            volumes={volumes}
                                        />
                                    )
                                }
                            })}
                            <div className="column is-narrow">
                                <span
                                    className="tag is-white is-rounded"
                                    title={`Turn all notes ${allNotesOn ? 'off' : 'on'}`}
                                    onClick={() =>
                                        setVolumes(measure, instrument, allNotesOn ? 0 : 1)
                                    }
                                >
                                    <span className="icon is-small">
                                        <i className={`fa fa-toggle-${allNotesOn ? 'on' : 'off'}`} />
                                    </span>
                                </span>
                            </div>
                            <div className="column is-narrow">
                                <span className="tag is-primary is-rounded" title={instrument}>
                                    {instrument}
                                </span>
                            </div>
                        </div>
                    )
                })}
                <a
                    className="button is-info"
                    style={{position: 'absolute', top: '17px', right: 0}}
                    onClick={() => updateUI('showSettings', !ui.showSettings)}
                >
                    <span className="icon is-small">
                        <i className={`fa ${ui.showSettings ? 'fa-close' : 'fa-cogs'}`} />
                    </span>
                </a>
                {ui.showSettings ? this.renderSettings() : null}
            </div>
        )
    }

    renderSettings() {
        return (
            <MeasureSettings {...this.props} />
        )
    }
}

Measure = defaultConnect(Measure)

export {Measure}
export default Measure
