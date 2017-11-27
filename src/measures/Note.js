import React from 'react'
import $ from 'jquery'

import {ActionTypes} from '../Actions'


const {ADD_TUPLET} = ActionTypes
// Must equal the $note-height in measures.sass
const noteHeight = 30


export class Note extends React.Component {
    state = {
        isHoveredInTupletMode: false,
    }

    render() {
        const {
            isFirstOfNoteValue, isCurrentlyPlaying, volume,
            toggle, setVolume, addTuplet,
            currentInteraction,
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
                    onClick={() => {
                        if (currentInteraction === null) {
                            toggle()
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
                            addTuplet(notesToReplace, notesInTuplet)
                        }
                    }}
                    onMouseMove={(event) => {
                        if (event.shiftKey && currentInteraction === null) {
                            // using jquery to also work if parents are positioned absolutely/relatively
                            const deltaY = event.pageY - $(event.currentTarget).offset().top
                            // deltaY < 0 <=> mouse is above note element
                            const volume = (
                                deltaY < 0
                                ? 1
                                : (deltaY > noteHeight ? 0 : 1 - deltaY/noteHeight)
                            )
                            setVolume(volume)
                        }
                    }}
                    onMouseEnter={() => {
                        if (currentInteraction === ADD_TUPLET) {
                            this.setState({isHoveredInTupletMode: true})
                        }
                    }}
                    onMouseLeave={() => {
                        if (currentInteraction === ADD_TUPLET) {
                            this.setState({isHoveredInTupletMode: false})
                        }
                    }}
                >
                    <div className="volume" style={volumeStyle} />
                </div>
            </div>
        )
    }
}

export default Note
