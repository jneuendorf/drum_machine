import React from 'react'

import TupletNote from './TupletNote'
import {defaultConnect, arraysEqual} from '../utils'
import {roundedTime} from '../utils/measure'



class Tuplet extends React.Component {
    state = {
        isHoveredInRemoveTupletMode: false,
    }

    render() {
        const {
            measureIndex,
            toggle, removeTuplet, setVolume,
            inTupletMode,
            inRemoveTupletMode,
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
            <div
                className="column is-narrow"
                onMouseEnter={() => {
                    if (inRemoveTupletMode) {
                        this.setState({isHoveredInRemoveTupletMode: true})
                    }
                }}
                onMouseLeave={() => {
                    if (inRemoveTupletMode) {
                        this.setState({isHoveredInRemoveTupletMode: false})
                    }
                }}
            >
                <div
                    className="tuplet"
                    style={style}
                    onClick={() => {
                        if (!inTupletMode) {
                            removeTuplet()
                        }
                    }}
                >
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
                                inRemoveTupletMode={inRemoveTupletMode}
                                tupletHoveredInRemoveTupletMode={this.state.isHoveredInRemoveTupletMode}
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
