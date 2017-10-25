import React from 'react'
import ui from 'redux-ui'

import {defaultConnect, arraysEqual} from '../utils'
import Note from './Note'
import MeasureSettings from './MeasureSettings'


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
            tab: {notes: {inTripletMode}},
            measure,
            index: measureIndex,
            ui,
            updateUI,
            actions: {toggleNote, setVolume, setVolumes}
        } = this.props
        const {drumkit: drumkitName, notes} = measure
        const drumkit = drumkits[drumkitName]
        const {instruments} = drumkit
        const notesPerWholeNote = measure.minNoteValue / measure.numberOfBeats
        return (
            <div className="measure has-border-bottom">
                {instruments.map(instrument => {
                    const instrumentNotes = notes[instrument]
                    const allNotesOn = instrumentNotes.every(volume => volume > 0)
                    return (
                        <div
                            className="columns is-gapless instrument"
                            key={instrument}
                        >
                            {instrumentNotes.map((volume, index) => (
                                <Note
                                    volume={volume}
                                    toggle={() =>
                                        toggleNote(measure, instrument, index)
                                    }
                                    setVolume={(newVolume) =>
                                        setVolume(measure, instrument, index, newVolume)
                                    }
                                    key={index}
                                    isFirstOfWholeNote={index % notesPerWholeNote === 0}
                                    isCurrentlyPlaying={arraysEqual(
                                        [measureIndex, index],
                                        currentPlayPos
                                    )}
                                    inTripletMode={inTripletMode}
                                />
                            ))}
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
