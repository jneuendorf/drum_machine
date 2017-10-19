// import Tock from 'tocktimer'
import Tock from '../lib/tock'

import {subscribe, dispatch} from './store'
import {
    ActionTypes,
    setCurrentPlayPos as setCurrentPlayPosActionCreator,
    setPlayingState as setPlayingStateActionCreator,
} from './Actions'
import {
    getMsBetweenNotes,
    getNumberOfNotes,
} from './utils'


// Bind dispatch to action.
const setCurrentPlayPos = function(measureIndex, noteIndex) {
    dispatch(setCurrentPlayPosActionCreator(measureIndex, noteIndex))
}
const setPlayingState = function(playingState) {
    dispatch(setPlayingStateActionCreator(playingState))
}


class Player {
    // This should match the 'soundControls'-reducer's initial state.
    static prevState = {}
    static clocks = []
    static clockIndex = -1

    // Decides what method should be called.
    static onStateChange(state, action) {
        if (action.type === ActionTypes.SET_STORE_STATE) {
            setPlayingState('stop')
            this.stop()
        }

        const {playingState} = state.soundControls
        const {playingState: prevPlayingState} = (this.prevState.soundControls || {})
        // The prev state must be saved here because some actions
        // are dispatched from the player's methods so this method can
        // get called before the switch statement is done.
        this.prevState = state

        if (playingState !== prevPlayingState) {
            if (state.tab.measures.length === 0) {
                setPlayingState('stop')
                return
            }
            // Stop/pause only if the player was previously playing.
            if (prevPlayingState === 'play') {
                if (playingState === 'stop') {
                    this.stop()
                }
                else if (playingState === 'pause') {
                    this.pause()
                }
                else {
                    setPlayingState('stop')
                }
            }
            // Play only if the player was previously stopped/paused.
            else {
                if (playingState === 'play') {
                    this.play(state, prevPlayingState)
                }
                else {
                    setPlayingState('stop')
                }
            }
        }
    }

    static play(state, prevPlayingState) {
        const {
            tab: {measures},
            drumkits,
        } = state

        console.log('called play........');

        // resume
        if (prevPlayingState === 'pause') {
            console.log('resuming playback');
            this.resume()
            return
        }

        measures.forEach((measure, index) => {
            const {numberOfBeats, noteValue, minNoteValue, drumkit: drumkitName, notes} = measure
            const interval = getMsBetweenNotes(measure)
            const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
            const {howl} = drumkits[drumkitName]
            console.log('creating clock w/ interval', interval)
            this.clocks.push(new Tock({
                interval,
                callback: (clock, tick) => {
                    const elapsed = clock.lap()
                    console.log('off by', elapsed - tick*interval)
                    console.log(`at tick #${tick}`, Date.now(), Date.now() - start)
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
                        // console.log('resetting...', Date.now())
                        clock.reset()
                        const clockIndex = this.startClock(index + 1)
                        console.log('clockIndex =', clockIndex, '(if == -1 -> reset playing state)');
                        if (clockIndex >= 0) {
                            setCurrentPlayPos(clockIndex, 0)
                        }
                        // Current clock from last measure.
                        else {
                            setCurrentPlayPos(-1, -1)
                            setPlayingState('stop')
                        }
                    }
                },
            }))
        })
        const start = Date.now()
        this.startClock(0)
        // setPlayingState('play')
    }

    static startClock(index) {
        if (index >= this.clocks.length) {
            return -1
        }
        console.log(`starting clock #${index}`)
        this.clockIndex = index
        this.clocks[index].start()
        return index
    }

    static pause() {
        this.clocks[this.clockIndex].pause()
    }

    static resume() {
        this.clocks[this.clockIndex].pause()
    }

    static stop() {
        const clock = this.clocks[this.clockIndex]
        // The clock might not exist.
        // This happens if a measure is created
        if (clock) {
            clock.reset()
        }
        setCurrentPlayPos(-1, -1)
        this.clocks = []
        this.clockIndex = -1
    }
}


// store.subscribe(function(state, action) {
subscribe(function(state, action) {
    console.log('subscribe', state, action)
    Player.onStateChange(state, action)
    // Player.onStateChange(store.getState())
})

// store.onSetState(function(store) {
//     store.subscribe(function() {
//         Player.onStateChange(store.getState())
//     })
// })

export {Player}
export default Player
