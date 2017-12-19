import React from 'react'

import TupletNote from './TupletNote'
import {connected, arraysEqual} from '../utils'
import {getCurrentInteraction, getCurrentPlayPos} from '../selectors'
import {roundedTime} from '../utils/measure'
import {ActionTypes} from '../Actions'


const {REMOVE_TUPLET} = ActionTypes
// Must equal the $note-width in measures.sass
const noteWidth = 30


@connected(
    (state, ownProps) => {
        return {
            currentInteraction: getCurrentInteraction(state),
            currentPlayPos: getCurrentPlayPos(state),
        }
    },
    ['removeTuplet', 'setVolumes', 'continueNotePattern']
)
class Tuplet extends React.PureComponent {
    state = {
        isHoveredInRemoveTupletMode: false,
    }

    render() {
        const {
            measure,
            measureIndex,
            instrument,
            noteIndex,
            replacedNotes,
            volumes,
            startTime,
            duration,
            currentInteraction,
            currentPlayPos,
        } = this.props
        const tupletNoteDuration = duration / volumes.length
        const style = {
            width: replacedNotes * noteWidth,
        }
        return (
            <div
                className="column is-narrow"
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div
                    className="tuplet"
                    style={style}
                    onClick={this.removeTuplet}
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
                                measure={measure}
                                instrument={instrument}
                                noteIndex={noteIndex}
                                tupletNoteIndex={tupletNoteIndex}
                                volume={volume}
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

    onMouseEnter = () => {
        const {
            currentInteraction,
        } = this.props
        if (currentInteraction === REMOVE_TUPLET) {
            this.setState({isHoveredInRemoveTupletMode: true})
        }
    }

    onMouseLeave = () => {
        const {
            currentInteraction,
        } = this.props
        if (currentInteraction === REMOVE_TUPLET) {
            this.setState({isHoveredInRemoveTupletMode: false})
        }
    }

    removeTuplet = () => {
        const {
            measure,
            instrument,
            noteIndex,
            currentInteraction,
            actions: {removeTuplet}
        } = this.props
        if (currentInteraction === REMOVE_TUPLET) {
            removeTuplet(measure, instrument, noteIndex)
        }
    }
}

export {Tuplet}
export default Tuplet
