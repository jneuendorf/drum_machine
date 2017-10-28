import React from 'react'
// import $ from 'jquery'

import TupletNote from './TupletNote'
import {defaultConnect, arraysEqual} from '../utils'



class Tuplet extends React.Component {
    render() {
        const {
            measureIndex, noteIndex,
            isFirstOfWholeNote, isCurrentlyPlaying, volume,
            toggle, setVolume, addTuplet,
            inTupletMode,

            replacedNotes,
            volumes,
            soundControls: {currentPlayPos},
        } = this.props
        const className = (
            `note `
            + `${isCurrentlyPlaying ? 'isCurrentlyPlaying ' : ''}`
        )
        const style = {
            width: replacedNotes * 30,
        }
        return (
            <div className="column is-narrow">
                <div className="tuplet" style={style}>
                    <div className="bracket" style={{width: replacedNotes*30 - 4}}>
                        <div className="enclosed-notes">
                            {volumes.length}
                        </div>
                    </div>
                    {/* <div className="columns"> */}
                        {volumes.map((volume, tupletNoteIndex) => (
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
                                    [measureIndex, noteIndex, tupletNoteIndex],
                                    currentPlayPos
                                )}
                            />
                        ))}
                    {/* </div> */}
                </div>
            </div>
        )
    }
}

Tuplet = defaultConnect(Tuplet)

export {Tuplet}
export default Tuplet
