import React from 'react'
import ui from 'redux-ui'
// import Tock from 'tocktimer'

import {
    // getMsBetweenNotes,
    // getNumberOfNotes,
    defaultConnect
} from '../utils'
import MenuSection from './MenuSection'
import MenuItem from './MenuItem'


const PLAY = 'play'
const PAUSE_LABEL = 'pause'
const STOP_LABEL = 'stop'

// inherits ui context from Menu because it's rendered by Menu.
@ui()
class SoundControls extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.soundControls.playingState !== this.props.soundControls.playingState
    }

    render() {
        console.log('rednering sound controls menu section.....');
        const {
            soundControls: {playingState},
            actions: {setPlayingState}
        } = this.props
        return (
            <MenuSection label="Sound Controls">
                <MenuItem
                    label={PLAY}
                    onClick={() => setPlayingState(PLAY)}
                    isActive={playingState === PLAY}
                >
                    <span>Play</span>
                    <span className="icon">
                        <i className="fa fa-play-circle" />
                    </span>
                </MenuItem>
                <MenuItem
                    label={PAUSE_LABEL}
                    onClick={() => setPlayingState(PAUSE_LABEL)}
                    isActive={playingState === PAUSE_LABEL}
                >
                    <span>Pause</span>
                    <span className="icon">
                        <i className="fa fa-pause-circle" />
                    </span>
                </MenuItem>
                <MenuItem
                    label={STOP_LABEL}
                    onClick={() => setPlayingState(STOP_LABEL)}
                    isActive={playingState === STOP_LABEL}
                >
                    <span>Stop</span>
                    <span className="icon">
                        <i className="fa fa-stop-circle" />
                    </span>
                </MenuItem>
            </MenuSection>
        )
    }

    // play() {
    //     const {
    //         tab: {measures},
    //         drumkits,
    //         updateUI,
    //         actions: {setCurrentPlayPos, setPlayingState},
    //     } = this.props
    //
    //     if (measures.length === 0) {
    //         return
    //     }
    //
    //     measures.forEach((measure, index) => {
    //         const {numberOfBeats, noteValue, minNoteValue, drumkit: drumkitName, notes} = measure
    //         const interval = getMsBetweenNotes(measure)
    //         const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
    //         const {howl} = drumkits[drumkitName]
    //         const clock = new Tock({
    //             interval,
    //             callback: () => {
    //                 const tick = Math.round(clock.lap() / interval)
    //                 // console.log('clocks statuses:', clocks.map(c => c.go), clocks.map(c => c.interval));
    //                 console.log(`playing tick #${tick}`, Date.now())
    //                 if (tick < numberOfNotes) {
    //                     const instrumentsToPlayWithNotes = Object.entries(notes)
    //                         .filter(([instrument, notes]) => notes[tick] > 0)
    //
    //                     for (const [instrumentToPlay, notes] of instrumentsToPlayWithNotes) {
    //                         const id = howl.play(instrumentToPlay)
    //                         const volume = notes[tick]
    //                         console.log(`playing ${instrumentToPlay} at tick ${tick} with volume ${volume}`)
    //                         howl.volume(volume, id)
    //                     }
    //                     setCurrentPlayPos(index, tick)
    //                 }
    //                 else {
    //                     console.log('resetting...');
    //                     // clock.stop()
    //                     clock.reset()
    //                     console.log(clock.start_time, clock.time, clock)
    //                     // const clockIndex = this.startClock(index + 1)
    //                     // setCurrentPlayPos(clockIndex, 0)
    //                     // console.log(`stopped playing measure #${index}`, clocks[index + 1 % clocks.length] === clock)
    //                 }
    //                 console.log(this.clocks.map(c => window._clocks.includes(c)))
    //             },
    //         })
    //         this.clocks.push(clock)
    //     })
    //     window._clocks = (window._clocks || []).concat(this.clocks)
    //     // this.startClock(0)
    //     updateUI('activeItem', PLAY)
    //     setPlayingState('play')
    // }
    //
    // startClock(index) {
    //     if (index >= this.clocks.length) {
    //         index = 0
    //     }
    //     console.log(`starting clock #${index}`);
    //     this.clockIndex = index
    //     this.clocks[index].start()
    //     return this.clockIndex
    // }
    //
    // pause() {
    //     const {updateUI, actions: {setCurrentPlayPos, setPlayingState}} = this.props
    //     this.clocks[this.clockIndex].pause()
    //     setCurrentPlayPos(-1, -1)
    //     setPlayingState('pause')
    //     updateUI('activeItem', PAUSE_LABEL)
    // }
    //
    // stop() {
    //     const {updateUI, actions: {setCurrentPlayPos, setPlayingState}} = this.props
    //     this.clocks[this.clockIndex].stop()
    //     setCurrentPlayPos(-1, -1)
    //     setPlayingState('stop')
    //     updateUI('activeItem', STOP_LABEL)
    //     this.clocks = []
    //     this.clockIndex = 0
    // }
}

SoundControls = defaultConnect(SoundControls)

export {SoundControls}
export default SoundControls
