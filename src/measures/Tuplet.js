import React from 'react'

import TupletNote from './TupletNote'
import {defaultConnect, arraysEqual} from '../utils'
import {roundedTime} from '../utils/measure'



class Tuplet extends React.Component {
    render() {
        const {
            measureIndex,
            toggle, setVolume,
            inTupletMode,
            replacedNotes,
            volumes,
            startTime,
            duration,
            soundControls: {currentPlayPos},
        } = this.props
        const tupletNoteDuration = duration / volumes.length
        const style = {
            width: replacedNotes * 30,
        }
        return (
            <div className="column is-narrow">
                <div className="tuplet" style={style}>
                    <div className="bracket" style={{width: replacedNotes*30 - 4}}>
                        <div className="enclosed-notes">
                            {volumes.length}
                        </div>
                    </div>
                    {volumes.map((volume, tupletNoteIndex) => {
                        const time = roundedTime(startTime + tupletNoteIndex * tupletNoteDuration)
                        return (
                            <TupletNote
                                volume={volume}
                                toggle={() =>
                                    toggle(tupletNoteIndex)
                                }
                                setVolume={(newVolume) =>
                                    setVolume(tupletNoteIndex, newVolume)
                                }
                                key={tupletNoteIndex}
                                isCurrentlyPlaying={arraysEqual(
                                    [measureIndex, time],
                                    currentPlayPos
                                )}
                                inTupletMode={inTupletMode}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}

Tuplet = defaultConnect(Tuplet)

export {Tuplet}
export default Tuplet
