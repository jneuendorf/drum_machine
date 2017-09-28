import React from 'react'
import Tock from 'tocktimer'

import {defaultConnect,
    getMsBetweenNotes,
    getNumberOfNotes,
    defaultConnect
} from '../utils'


// This is a component just for convenience (for easy connection to the store).
class SoundController extends React.Component {
    constructor(props) {
        super(props)
        this.clocks = []
        this.clockIndex = 0
    }

    // PSEUDO REACT METHODS
    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    render() {
        return null
    }

    play() {
        const {
            tab: {measures},
            drumkits,
            actions: {setCurrentPlayPos},
        } = this.props
        const clocks = this.clocks

        measures.forEach((measure, index) => {
            const {numberOfBeats, noteValue, minNoteValue, drumkit: drumkitName, notes} = measure
            const interval = getMsBetweenNotes(measure)
            const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
            const {howl} = drumkits[drumkitName]
            const clock = new Tock({
                interval,
                callback: () => {
                    const tick = Math.round(clock.lap() / interval)
                    if (tick < numberOfNotes) {
                        const instrumentsToPlayWithNotes = Object.entries(notes)
                            .filter(([instrument, notes]) => notes[tick] > 0)

                        for (const [instrumentToPlay, notes] of instrumentsToPlayWithNotes) {
                            const id = howl.play(instrumentToPlay)
                            const volume = notes[tick]
                            console.log(`playing ${instrumentToPlay} at tick ${tick} with volume ${volume}`)
                            howl.volume(volume, id)
                        }
                        setCurrentPlayPos(index, tick)
                    }
                    else {
                        clock.reset()
                        this.startClock(index + 1)
                        setCurrentPlayPos(this.clockIndex, 0)
                        // console.log(`stopped playing measure #${index}`, clocks[index + 1 % clocks.length] === clock)
                    }
                },
            })
            clocks.push(clock)
        })
        this.startClock(0)
    }

    // Also stop the previous clock.
    startClock(index) {
        const length = this.clocks.length
        if (index > length - 1) {
            index = 0
        }
        this.clockIndex = index
        this.clocks[index].start()
    }

    pause() {
        const {actions: {setCurrentPlayPos}} = this.props
        this.clocks[this.clockIndex].pause()
        setCurrentPlayPos(-1, -1)
    }

    stop() {
        const {actions: {setCurrentPlayPos}} = this.props
        this.clocks[this.clockIndex].stop()
        setCurrentPlayPos(-1, -1)
        this.clocks = []
        this.clockIndex = 0
    }
}

SoundController = defaultConnect(SoundController)

export {SoundController}
export default SoundController
