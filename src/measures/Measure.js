import React from 'react'
import ui from 'redux-ui'

import {defaultConnect} from '../utils'
import Note from './Note'


@ui({
    key: (props) => props.uiKey,
    state: {
        showSettings: false,
    },
})
class Measure extends React.Component {
    render() {
        const {
            measure, index: measureIndex,
            drumkits,
            ui,
            updateUI,
            actions: {toggleNote, setVolume}
        } = this.props
        const {drumkit: drumkitName, notes} = measure
        const drumkit = drumkits[drumkitName]
        const {instruments} = drumkit
        return (
            <div className="measure has-border-bottom">
                {instruments.map(instrument => (
                    <div
                        className="columns is-gapless instrument"
                        key={instrument}
                    >
                        {notes[instrument].map((volume, index) => (
                            <Note
                                volume={volume}
                                toggle={() =>
                                    toggleNote(measureIndex, instrument, index)
                                }
                                setVolume={(newVolume) =>
                                    setVolume(measureIndex, instrument, index, newVolume)
                                }
                                key={index}
                            />
                        ))}
                        <div className="column is-narrow">
                            <span className="tag is-primary is-rounded" title={instrument}>
                                {instrument}
                            </span>
                        </div>
                    </div>
                ))}
                <a
                    className="button is-info"
                    style={{position: 'absolute', top: '17px', right: 0}}
                    onClick={() => updateUI('showSettings', !ui.showSettings)}
                >
                    <span className="icon is-small">
                        <i className="fa fa-cogs" />
                    </span>
                </a>
                {ui.showSettings ? this.renderSettings() : null}
            </div>
        )
    }

    renderSettings() {
        return (
            <div
                style={{
                    backgroundColor: 'white',
                    bottom: 0,
                    position: 'absolute',
                    left: 0,
                    right: '36px',
                    top: 0,
                }}
            >
                Settings...
            </div>
        )
    }
}

Measure = defaultConnect(Measure)

export {Measure}
export default Measure
