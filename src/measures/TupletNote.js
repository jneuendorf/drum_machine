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
            isFirstOfWholeNote, isCurrentlyPlaying, volume,
            toggle, setVolume,
            inTupletMode,
        } = this.props
        const className = (
            `tuplet-note`
            + `${isFirstOfWholeNote ? 'isFirstOfWholeNote ' : ''}`
            + `${isCurrentlyPlaying ? 'isCurrentlyPlaying ' : ''}`
        )
        return (
            <div
                className={className}
                style={{
                    flex: 1,
                    height: '100%',
                }}
                onClick={toggle}
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
            >
                <div className="volume" style={{top: `${Math.abs(1 - volume)*100}%`}} />
            </div>
        )
    }
}

export default TupletNote
