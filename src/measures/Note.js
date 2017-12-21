import React from 'react'
import $ from 'jquery'

import {connected} from '../utils'
import {getCurrentInteraction} from '../selectors'
import {ActionTypes} from '../Actions'


const {ADD_TUPLET} = ActionTypes
// Must equal the $note-height in measures.sass
const noteHeight = 30


@connected(
    (state, ownProps) => {
        return {
            currentInteraction: getCurrentInteraction(state),
        }
    },
    [
        'addTuplet',
        'setCurrentMenuInteraction',
        'setVolume',
        'toggleNote',
    ]
)
class Note extends React.PureComponent {
    state = {
        isHoveredInTupletMode: false,
    }

    render() {
        const {
            isFirstOfNoteValue,
            isCurrentlyPlaying,
            volume,
        } = this.props
        const className = (
            `note `
            + `${isFirstOfNoteValue ? 'isFirstOfNoteValue ' : ''}`
            + `${isCurrentlyPlaying ? 'isCurrentlyPlaying ' : ''}`
        )
        // TODO: Move more styles to CSS (also for TupletNotes).
        const style = (
            this.state.isHoveredInTupletMode
            ? {backgroundColor: '#3273dd'}
            : {}
        )
        const volumeStyle = Object.assign(
            {top: `${Math.abs(1 - volume)*100}%`},
            this.state.isHoveredInTupletMode ? {backgroundColor: '#3273dd'} : {}
        )
        return (
            <div className="column is-narrow">
                <div
                    className={className}
                    style={style}
                    onClick={this.onClick}
                    onMouseMove={this.onMouseMove}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                >
                    <div className="volume" style={volumeStyle} />
                </div>
            </div>
        )
    }

    onMouseMove = event => {
        const {
            measureIndex,
            instrument,
            noteIndex,
            currentInteraction,
            actions: {
                setVolume,
            },
        } = this.props
        if (event.shiftKey && currentInteraction === null) {
            // using jquery to also work if parents are positioned absolutely/relatively
            const deltaY = event.pageY - $(event.currentTarget).offset().top
            // deltaY < 0 <=> mouse is above note element
            const volume = (
                deltaY < 0
                ? 1
                : (deltaY > noteHeight ? 0 : 1 - deltaY/noteHeight)
            )
            setVolume(measureIndex, instrument, noteIndex, volume)
        }
    }

    onMouseEnter = event => {
        const {
            currentInteraction,
        } = this.props
        if (currentInteraction === ADD_TUPLET) {
            this.setState({isHoveredInTupletMode: true})
        }
    }

    onMouseLeave = event => {
        const {
            currentInteraction,
        } = this.props
        if (currentInteraction === ADD_TUPLET) {
            this.setState({isHoveredInTupletMode: false})
        }
    }

    onClick = () => {
        const {
            measureIndex,
            instrument,
            noteIndex,
            currentInteraction,
            actions: {
                toggleNote,
                addTuplet,
                setCurrentMenuInteraction,

            },
        } = this.props
        if (currentInteraction === null) {
            toggleNote(measureIndex, instrument, noteIndex)
        }
        else if (currentInteraction === ADD_TUPLET) {
            const notesInTuplet = parseInt(prompt(
                (
                    'Enter the number of notes in the tuplet '
                    + '(e.g. 3 for a triplet)'
                ),
                '3'
            ), 10)
            if (isNaN(notesInTuplet) || notesInTuplet <= 1) {
                return
            }
            const notesToReplace = parseInt(prompt(
                'Enter the number of notes to replace',
                '1'
            ), 10)
            if (isNaN(notesToReplace) || notesToReplace <= 0) {
                return
            }
            if (notesInTuplet === notesToReplace) {
                return
            }
            addTuplet(measureIndex, instrument, noteIndex, notesToReplace, notesInTuplet)
            setCurrentMenuInteraction(null)
        }
    }
}

export {Note}
export default Note
