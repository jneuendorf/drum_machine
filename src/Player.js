import TickTock from '../lib/TickTock'

import {subscribe, dispatch} from './store'
import {
    ActionTypes,
    setCurrentPlayPos as setCurrentPlayPosActionCreator,
    setPlayingState as setPlayingStateActionCreator,
} from './Actions'
import {
    getGroupedSounds,
    getDuration,
    roundedTime,
} from './utils/measure'


// Bind dispatch to action.
const setCurrentPlayPos = function(measureIndex, time) {
    dispatch(setCurrentPlayPosActionCreator(measureIndex, time))
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
        if (action && action.type === ActionTypes.SET_STORE_STATE) {
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

        // resume
        if (prevPlayingState === 'pause') {
            console.log('resuming playback')
            this.resume()
            return
        }

        this.clocks = measures.map((measure, index) => {
            const {drumkit: drumkitName} = measure
            const duration = getDuration(measure)
            const soundGroups = getGroupedSounds(measure)
            const times = soundGroups.keySeq().toJS()
            const nextMeasureDelay = duration - times[times.length - 1]
            console.log(times)

            // create time diffs
            const intervals = [
                ...times.slice(1)
                .map((time, i) =>
                    time - times[i]
                )
            ]
            console.log(intervals)

            const {howl} = drumkits[drumkitName]
            return new TickTock({
                interval: intervals,
                callback: (clock, time, tick) => {
                    time = roundedTime(time)
                    // if (!soundGroups.get(time)) {
                    //     debugger
                    // }
                    const sounds = soundGroups.get(time)
                    if (sounds) {
                        for (const {instrument, volume} of soundGroups.get(time)) {
                            const soundId = howl.play(instrument)
                            howl.volume(volume, soundId)
                        }
                    }
                    setCurrentPlayPos(index, time)
                },
                complete: (time, tick, stopTime) => {
                    setTimeout(() => {
                        const clockIndex = this.startClock(index + 1)
                        if (clockIndex >= 0) {
                            setCurrentPlayPos(clockIndex, 0)
                        }
                        else {
                            setCurrentPlayPos(-1, -1)
                            setPlayingState('stop')
                        }
                    }, nextMeasureDelay)
                }
            })
        })
        console.log(this.clocks)
        this.startClock(0)
        setPlayingState('play')
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
        this.clocks[this.clockIndex].resume()
    }

    static stop() {
        const clock = this.clocks[this.clockIndex]
        // The clock might not exist.
        // This happens if a measure is created
        if (clock) {
            try {
                // Clock is already stopped after last measure was played.
                // That's ok because the clock was already stopped because
                // setPlayingState(stop) is called from the complete callback.
                clock.stop()
            }
            catch (error) {}
            finally {
                clock.reset()
            }
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
