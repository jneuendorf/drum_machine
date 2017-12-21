import React from 'react'
import $ from 'jquery'

import {connected} from '../utils'
import {getCurrentInteraction} from '../selectors'


const noteHeight = 30


@connected(
    (state, ownProps) => {
        return {
            currentInteraction: getCurrentInteraction(state),
        }
    },
    [
        'setVolume', 'toggleNote',
    ]
)
export class TupletNote extends React.PureComponent {
    state = {
        isHoveredInTupletMode: false,
    }

    render() {
        const {
            isFirstOfNoteValue,
            isCurrentlyPlaying,
            volume,
            tupletHoveredInRemoveTupletMode,
        } = this.props
        const className = (
            `tuplet-note `
            + `${isFirstOfNoteValue ? 'isFirstOfNoteValue ' : ''}`
            + `${isCurrentlyPlaying ? 'isCurrentlyPlaying ' : ''}`
        )
        const style = (
            tupletHoveredInRemoveTupletMode
            ? {backgroundColor: '#3273dd'}
            : {}
        )
        const volumeStyle = Object.assign(
            {top: `${Math.abs(1 - volume)*100}%`},
            tupletHoveredInRemoveTupletMode ? {backgroundColor: '#3273dd'} : {}
        )
        return (
            <div
                className={className}
                style={style}
                onClick={this.onClick}
                onMouseMove={this.onMouseMove}
            >
                <div className="volume" style={volumeStyle} />
            </div>
        )
    }

    onClick = () => {
        const {currentInteraction} = this.props
        if (currentInteraction === null) {
            const {
                measureIndex,
                instrument,
                noteIndex,
                tupletNoteIndex,
                actions: {
                    toggleNote,
                },
            } = this.props
            toggleNote(measureIndex, instrument, noteIndex, tupletNoteIndex)
        }
    }

    onMouseMove = event => {
        const {currentInteraction} = this.props
        if (event.shiftKey && currentInteraction === null) {
            const {
                measureIndex,
                instrument,
                noteIndex,
                tupletNoteIndex,
                actions: {
                    setVolume,
                },
            } = this.props

            // using jquery to also work if parents are positioned absolutely/relatively
            const deltaY = event.pageY - $(event.currentTarget).offset().top
            // deltaY < 0 <=> mouse is above note element
            const volume = (
                deltaY < 0
                ? 1
                : (deltaY > noteHeight ? 0 : 1 - deltaY/noteHeight)
            )
            setVolume(measureIndex, instrument, noteIndex, tupletNoteIndex, volume)
        }
    }
}

export default TupletNote
