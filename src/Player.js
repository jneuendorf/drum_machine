// import Tock from 'tocktimer'
import Tock from '../lib/tock'

import store from './store'
import {
    setCurrentPlayPos as setCurrentPlayPosActionCreator,
    setPlayingState as setPlayingStateActionCreator,
} from './Actions'
import {
    getMsBetweenNotes,
    getNumberOfNotes,
} from './utils'


// Bind dispatch to action.
const setCurrentPlayPos = function(measureIndex, noteIndex) {
    store.dispatch(setCurrentPlayPosActionCreator(measureIndex, noteIndex))
}
const setPlayingState = function(playingState) {
    store.dispatch(setPlayingStateActionCreator(playingState))
}


class Player {
    // This should match the 'soundControls'-reducer's initial state.
    static prevState = {}
    static clocks = []
    static clockIndex = -1

    // Decides what method should be called.
    static onStateChange(state) {
        const {playingState} = state.soundControls
        const {playingState: prevPlayingState} = (this.prevState.soundControls || {})
        // console.log('state changed...playingStates:', playingState, prevPlayingState, this.prevState)
        this.prevState = state
        // console.log('updated prevState', state);
        if (playingState !== prevPlayingState) {
            // Don't pause or stop upon initialization.
            if (this.clockIndex >= 0 || playingState === 'play') {
                switch (playingState) {
                    case 'play':
                        this.play(state, prevPlayingState)
                        break;
                    case 'pause':
                        this.pause()
                        break;
                    case 'stop':
                        this.stop()
                        break;
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

        if (measures.length === 0) {
            return
        }

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
            console.log('creating clock w/ interval', interval);
            this.clocks.push(new Tock({
                interval,
                callback: (clock, tick) => {
                    const elapsed = clock.lap()
                    // const tick = Math.round(elapsed / interval)
                    // const tick = Math.floor(elapsed / interval)
                    // const tick = clock.tick
                    console.log('off by', elapsed - tick*interval)
                    // console.log('clocks statuses:', clocks.map(c => c.go), clocks.map(c => c.interval));
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
                        console.log('resetting...', Date.now())
                        // clock.stop()
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
                        // console.log('old index', index, ', new index', clockIndex);
                    }
                    // console.log(this.clocks.map(c => window._clocks.includes(c)))
                },
            }))
        })
        // window._clocks = (window._clocks || []).concat(this.clocks)
        // console.log('starting with clocks', this.clocks);
        const start = Date.now()
        this.startClock(0)
        // setPlayingState('play')
    }

    static startClock(index) {
        if (index >= this.clocks.length) {
            return -1
        }
        console.log(`starting clock #${index}`);
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
        this.clocks[this.clockIndex].reset()
        setCurrentPlayPos(-1, -1)
        this.clocks = []
        this.clockIndex = -1
    }
}


store.subscribe(function() {
    Player.onStateChange(store.getState())
})

export {Player}
export default Player
