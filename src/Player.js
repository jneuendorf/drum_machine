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


const {
    SET_CURRENT_PLAY_POS,
    SET_PLAYING_STATE,
    SET_STORE_STATE,
} = ActionTypes


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
    static clockIndex = 0

    static shouldHandleAction(action={}) {
        switch (action.type) {
            case SET_STORE_STATE:
            case SET_CURRENT_PLAY_POS:
            case SET_PLAYING_STATE:
                return true
            default:
                return false
        }
    }

    // Decides what method should be called.
    static onStateChange(state, action) {
        switch (action.type) {
            case SET_STORE_STATE: {
                setPlayingState('stop')
                this.stop()
                return
            }
            case SET_CURRENT_PLAY_POS: {
                const {measureIndex} = action
                this.clockIndex = measureIndex
                return
            }
            case SET_PLAYING_STATE: {
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
                    this.ensureClocks(state)
                    switch (playingState) {
                        case 'play':
                            if (prevPlayingState === 'pause') {
                                this.resume()
                            }
                            else {
                                this.play()
                            }
                            break
                        case 'pause':
                            this.pause()
                            break
                        case 'stop':
                            this.stop()
                            break
                    }
                }
            }
        }
    }

    static ensureClocks(state) {
        if (this.clocks.length === 0) {
            console.log('populating the cache......')
            this.populateCache(state)
        }
    }

    // Force creates the data required for playing sounds.
    static populateCache(state) {
        const {
            tab: {measures},
            soundControls: {loop, freezeUiWhilePlaying},
            drumkits,
        } = state
        this.clocks = measures.map((measure, index) => {
            const {drumkit: drumkitName} = measure
            const duration = getDuration(measure)
            const soundGroups = getGroupedSounds(measure)
            const times = soundGroups.keySeq().toJS()
            const nextMeasureDelay = duration - times[times.length - 1]
            console.log('times', times, 'nextMeasureDelay', nextMeasureDelay)

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
                    // console.log('tick...', time, tick)
                    const sounds = soundGroups.get(time)
                    if (sounds) {
                        for (const {instrument, volume} of soundGroups.get(time)) {
                            const soundId = howl.play(instrument)
                            howl.volume(volume, soundId)
                        }
                    }
                    if (!freezeUiWhilePlaying) {
                        setCurrentPlayPos(index, time)
                    }
                },
                complete: (clock, time, tick, stopTime) => {
                    setTimeout(() => {
                        clock.reset()
                        const clockIndex = this.startNextClock(loop)
                        if (clockIndex >= 0) {
                            if (!freezeUiWhilePlaying) {
                                setCurrentPlayPos(clockIndex, 0)
                            }
                        }
                        else {
                            setCurrentPlayPos(0, -1)
                            setPlayingState('stop')
                        }
                    }, nextMeasureDelay)
                }
            })
        })
    }

    static invalidateCache() {
        console.log('resetting the cache......')
        this.clocks = []
    }

    static play() {
        // this.startNextClock()
        this.clocks[0].start()
    }

    static startNextClock(loop=false) {
        let nextIndex = this.clockIndex + 1
        if (nextIndex >= this.clocks.length) {
            nextIndex = loop ? 0 : -1
        }
        this.clockIndex = nextIndex
        const clock = this.clocks[this.clockIndex]
        console.log('startNextClock...index=', nextIndex)
        if (clock) {
            console.log(`starting clock #${this.clockIndex}`)
            clock.start()
        }
        return this.clockIndex
    }

    static pause() {
        this.clocks[this.clockIndex].stop()
    }

    static resume() {
        this.clocks[this.clockIndex].resume()
    }

    static stop() {
        const clock = this.clocks[this.clockIndex]
        // The clock might not exist.
        // This happens if a measure is created
        if (clock) {
            // Clock is already stopped after last measure was played.
            // That's ok because the clock was already stopped because
            // setPlayingState(stop) is called from the complete callback.
            clock.stop()
            clock.reset()
        }
        setCurrentPlayPos(0, -1)
        // this.clocks = []
        // this.clockIndex = -1
    }
}


subscribe(function(state, action) {
    if (Player.shouldHandleAction(action)) {
        console.log('subscribe', state, action)
        Player.onStateChange(state, action)
    }
})

export {Player}
export default Player
