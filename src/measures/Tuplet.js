import React from 'react'

import TupletNote from './TupletNote'
import {defaultConnect, arraysEqual} from '../utils'
import {roundedTime} from '../utils/measure'
import {ActionTypes} from '../Actions'


const {REMOVE_TUPLET} = ActionTypes
// Must equal the $note-width in measures.sass
const noteWidth = 30


class Tuplet extends React.Component {
    state = {
        isHoveredInRemoveTupletMode: false,
    }

    render() {
        const {
            measureIndex,
            toggle,
            removeTuplet,
            setVolume,
            replacedNotes,
            volumes,
            startTime,
            duration,
            menu: {currentInteraction},
            soundControls: {currentPlayPos},
        } = this.props
        const tupletNoteDuration = duration / volumes.length
        const style = {
            width: replacedNotes * noteWidth,
        }
        return (
            <div
                className="column is-narrow"
                onMouseEnter={() => {
                    if (currentInteraction === REMOVE_TUPLET) {
                        this.setState({isHoveredInRemoveTupletMode: true})
                    }
                }}
                onMouseLeave={() => {
                    if (currentInteraction === REMOVE_TUPLET) {
                        this.setState({isHoveredInRemoveTupletMode: false})
                    }
                }}
            >
                <div
                    className="tuplet"
                    style={style}
                    onClick={() => {
                        if (currentInteraction === REMOVE_TUPLET) {
                            removeTuplet()
                        }
                    }}
                >
                    <div className="bracket" style={{width: replacedNotes*noteWidth - 4}}>
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
                                tupletHoveredInRemoveTupletMode={this.state.isHoveredInRemoveTupletMode}
                                currentInteraction={currentInteraction}
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
