import React from 'react'
import $ from 'jquery'


const size = 30
const sizeStyle = {
    width: size,
    height: size,
}


export class Note extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHoveredInTupletMode: false,
        }
    }

    render() {
        const {
            isFirstOfWholeNote, isCurrentlyPlaying, volume,
            toggle, setVolume, addTuplet,
            inTupletMode,
        } = this.props
        const className = (
            `note `
            + `${isFirstOfWholeNote ? 'isFirstOfWholeNote ' : ''}`
            + `${isCurrentlyPlaying ? 'isCurrentlyPlaying ' : ''}`
        )
        const style = (
            this.state.isHoveredInTupletMode
            ? Object.assign({backgroundColor: '#3273dd'}, sizeStyle)
            : sizeStyle
        )
        return (
            <div className="column is-narrow">
                <div
                    className={className}
                    style={style}
                    onClick={() => {
                        if (!inTupletMode) {
                            toggle()
                        }
                        else {
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
                        if (event.shiftKey && !inTupletMode) {
                            // using jquery to also work if parents are positioned absolutely/relatively
                            const deltaY = event.pageY - $(event.currentTarget).offset().top
                            // deltaY < 0 <=> mouse is above note element
                            const volume = (
                                deltaY < 0
                                ? 1
                                : (deltaY > size ? 0 : 1 - deltaY/size)
                            )
                            setVolume(volume)
                        }
                    }}
                    onMouseEnter={() => {
                        if (inTupletMode) {
                            this.setState({isHoveredInTupletMode: true})
                        }
                    }}
                    onMouseLeave={() => {
                        if (inTupletMode) {
                            this.setState({isHoveredInTupletMode: false})
                        }
                    }}
                >
                    <div className="volume" style={{top: `${Math.abs(1 - volume)*100}%`}} />
                </div>
            </div>
        )
    }
}

export default Note
