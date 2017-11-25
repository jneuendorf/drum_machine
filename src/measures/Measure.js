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
    render() {
        const {
            drumkits,
            soundControls: {currentPlayPos},
            tab: {notes: {inTupletMode, inRemoveTupletMode}},
            measure,
            index: measureIndex,
            ui,
            updateUI,
            actions: {
                toggleNote,
                setVolume,
                setVolumes,
                addTuplet,
                removeTuplet,
                setTupletMode,
                setRemoveTupletMode,
            }
        } = this.props
        const {drumkit: drumkitName, notes} = measure
        const drumkit = drumkits[drumkitName]
        const {instruments} = drumkit
        const notesPerNoteValue = measure.minNoteValue / measure.noteValue
        const numberOfNotes = getNumberOfNotes(measure)
        const measureDuration = getDuration(measure)
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
                    return (
                        <div
                            className="columns is-gapless instrument"
                            key={instrument}
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
                                                setTupletMode(false)
                                            }}
                                            key={index}
                                            isFirstOfNoteValue={notePositions[index] % notesPerNoteValue === 0}
                                            isCurrentlyPlaying={arraysEqual(
                                                [measureIndex, time],
                                                currentPlayPos
                                            )}
                                            inTupletMode={inTupletMode}
                                            inRemoveTupletMode={inRemoveTupletMode}
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
                                                setRemoveTupletMode(false)
                                            }}
                                            key={index}
                                            measureIndex={measureIndex}
                                            noteIndex={index}
                                            replacedNotes={replacedNotes}
                                            volumes={volumes}
                                            startTime={time}
                                            duration={measureDuration / numberOfNotes * replacedNotes}
                                            inTupletMode={inTupletMode}
                                            inRemoveTupletMode={inRemoveTupletMode}
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
