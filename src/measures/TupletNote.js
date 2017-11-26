import React from 'react'
import $ from 'jquery'


const size = 30


export class TupletNote extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHoveredInTupletMode: false,
        }
    }

    render() {
        const {
            isFirstOfNoteValue, isCurrentlyPlaying, volume,
            toggle, setVolume,
            currentInteraction,
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
                onClick={() => {
                    if (currentInteraction === null) {
                        toggle()
                    }
                }}
                onMouseMove={event => {
                    if (event.shiftKey && currentInteraction === null) {
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
            >
                <div className="volume" style={volumeStyle} />
            </div>
        )
    }
}

export default TupletNote
