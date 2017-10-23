import React from 'react'
import $ from 'jquery'


const size = 30
const style = {
    width: size,
    height: size,
}


export class Note extends React.Component {
    render() {
        const {
            isFirstOfWholeNote, isCurrentlyPlaying, volume,
            toggle, setVolume
        } = this.props
        const className = (
            `note `
            + `${isFirstOfWholeNote ? 'isFirstOfWholeNote ' : ''}`
            + `${isCurrentlyPlaying ? 'isCurrentlyPlaying ' : ''}`
        )
        return (
            <div className="column is-narrow">
                <div
                    className={className}
                    style={style}
                    onClick={toggle}
                    onMouseMove={(event) => {
                        if (event.shiftKey) {
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
            </div>
        )
    }
}

export default Note
