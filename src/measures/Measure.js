import React from 'react'

import {defaultConnect} from '../utils'
import Note from './Note'


class Measure extends React.Component {
    render() {
        const {
            measure, index: measureIndex,
            drumkits,
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
                            // <div className="column is-narrow" key={index}>
                            //     <div className="note">
                            //         <div className="volume" style={{height: `${volume*100}%`}} />
                            //     </div>
                            // </div>
                            <Note
                                volume={volume}
                                // index={index}
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
            </div>
        )
    }
}

Measure = defaultConnect(Measure)

export {Measure}
export default Measure
