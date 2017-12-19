import React from 'react'

import Note from './Note'
import Tuplet from './Tuplet'
import {
    connected,
    arraysEqual,
} from '../utils'
import {getCurrentInteraction, getCurrentPlayPos} from '../selectors'
import {
    getNotePositions,
} from '../utils/measure'
import {ActionTypes} from '../Actions'


const {CONTINUE_NOTE_PATTERN} = ActionTypes


@connected(
    (state, ownProps) => {
        return {
            currentInteraction: getCurrentInteraction(state),
            currentPlayPos: getCurrentPlayPos(state),
        }
    },
    ['setCurrentMenuInteraction', 'setVolumes', 'continueNotePattern']
)
class InstrumentNotes extends React.PureComponent {
    render() {
        const {
            measure,
            measureIndex,
            instrument,
            notes,
            notesPerNoteValue,
            numberOfNotes,
            measureDuration,
            currentPlayPos,
        } = this.props
        const allNotesOn = notes.every(note =>
            !Array.isArray(note)
            ? note > 0
            : note.slice(1).every(tupletNote => tupletNote > 0)
        )
        const notePositions = getNotePositions(notes)
        return (
            <div
                className="columns is-gapless instrument"
                key={instrument}
                // 'onClick' on children is never called
                // because they have 'pointer-events: none'.
                onClick={this.continueNotePattern}
            >
                {notes.map((note, index) => {
                    const time = notePositions[index] / numberOfNotes * measureDuration
                    if (!Array.isArray(note)) {
                        const volume = note
                        return (
                            <Note
                                key={index}
                                measure={measure}
                                instrument={instrument}
                                noteIndex={index}
                                volume={volume}
                                isFirstOfNoteValue={notePositions[index] % notesPerNoteValue === 0}
                                // TODO (PERFORMANCE): this is expensive...
                                isCurrentlyPlaying={arraysEqual(
                                    [measureIndex, time],
                                    currentPlayPos
                                )}
                            />
                        )
                    }
                    else {
                        const [replacedNotes, ...volumes] = note
                        return (
                            <Tuplet
                                key={index}
                                measure={measure}
                                measureIndex={measureIndex}
                                instrument={instrument}
                                noteIndex={index}
                                replacedNotes={replacedNotes}
                                volumes={volumes}
                                toggle={this.toggleNote}
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
                        onClick={this.toggleVolumes}
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

    continueNotePattern = event => {
        const {currentInteraction} = this.props
        if (currentInteraction === CONTINUE_NOTE_PATTERN) {
            const {
                measure,
                instrument,
                actions: {
                    continueNotePattern,
                    setCurrentMenuInteraction,
                }
            } = this.props
            continueNotePattern(measure, instrument)
            // Stay in CONTINUE_NOTE_PATTERN mode if shift is held down.
            if (!event.shiftKey) {
                setCurrentMenuInteraction(null)
            }
        }
    }

    toggleVolumes = () => {
        const {
            measure,
            instrument,
            notes,
            actions: {
                setVolumes,
            },
        } = this.props
        const allNotesOn = notes.every(note =>
            !Array.isArray(note)
            ? note > 0
            : note.slice(1).every(tupletNote => tupletNote > 0)
        )
        setVolumes(measure, instrument, allNotesOn ? 0 : 1)
    }
}

export {InstrumentNotes}
export default InstrumentNotes
