import React from 'react'

import TupletNote from './TupletNote'
import {connected} from '../utils'
import {getCurrentInteraction} from '../selectors'
import {roundedTime} from '../utils/measure'
import {ActionTypes} from '../Actions'


const {REMOVE_TUPLET} = ActionTypes
// Must equal the $note-width in measures.sass
const noteWidth = 30


@connected(
    (state, ownProps) => {
        return {
            currentInteraction: getCurrentInteraction(state),
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
            measureIndex,
            instrument,
            noteIndex,
            replacedNotes,
            volumes,
            startTime,
            duration,
            currentInteraction,
            currentPlayTime,
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
                                measureIndex={measureIndex}
                                instrument={instrument}
                                noteIndex={noteIndex}
                                tupletNoteIndex={tupletNoteIndex}
                                volume={volume}
                                key={tupletNoteIndex}
                                isCurrentlyPlaying={time === currentPlayTime}
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
            measureIndex,
            instrument,
            noteIndex,
            currentInteraction,
            actions: {removeTuplet}
        } = this.props
        if (currentInteraction === REMOVE_TUPLET) {
            removeTuplet(measureIndex, instrument, noteIndex)
        }
    }
}

export {Tuplet}
export default Tuplet
