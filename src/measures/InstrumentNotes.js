import React from 'react'

import {
    getNotePositions,
    // getNumberOfNotes,
    // getDuration,
} from '../utils/measure'
import {ActionTypes} from '../Actions'


const {CONTINUE_NOTE_PATTERN} = ActionTypes


class InstrumentNotes extends React.PureComponent {
    render() {
        const {measure, instrument, notes} = this.props
        const instrumentNotes = notes[instrument]
        const allNotesOn = instrumentNotes.every(note =>
            !Array.isArray(note)
            ? note > 0
            : note.slice(1).every(tupletNote => tupletNote > 0)
        )
        const notePositions = getNotePositions(instrumentNotes)
        return (
            <div
                className="columns is-gapless instrument"
                key={instrument}
                // 'onClick' on children is never called
                // because they have 'pointer-events: none'.
                onClick={event => {
                    if (currentInteraction === CONTINUE_NOTE_PATTERN) {
                        continueNotePattern(measure, instrument)
                        // Stay in CONTINUE_NOTE_PATTERN mode if shift is held down.
                        if (!event.shiftKey) {
                            setCurrentMenuInteraction(null)
                        }
                    }
                }}
            >
                {instrumentNotes.map((note, index) => {
                    const time = notePositions[index] / numberOfNotes * measureDuration
                    if (!Array.isArray(note)) {
                        const volume = note
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
                                    addTuplet(measure, instrument, index, notesToReplace, notesInTuplet)
                                    setCurrentMenuInteraction(null)
                                }}
                                key={index}
                                isFirstOfNoteValue={notePositions[index] % notesPerNoteValue === 0}
                                // TODO (PERFORMANCE): this is expensive...
                                isCurrentlyPlaying={arraysEqual(
                                    [measureIndex, time],
                                    currentPlayPos
                                )}
                                currentInteraction={currentInteraction}
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
                                removeTuplet={() => {
                                    removeTuplet(measure, instrument, index)
                                    setCurrentMenuInteraction(null)
                                }}
                                key={index}
                                measureIndex={measureIndex}
                                noteIndex={index}
                                replacedNotes={replacedNotes}
                                volumes={volumes}
                                startTime={time}
                                duration={measureDuration / numberOfNotes * replacedNotes}
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
    }
}

export {InstrumentNotes}
export default InstrumentNotes
