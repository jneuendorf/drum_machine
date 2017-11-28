/**
* Based on 'Tock' by Mr Chimp - github.com/mrchimp/tock
* Based on code by James Edwards:
*    sitepoint.com/creating-accurate-timers-in-javascript/
*
* Different options:
* - removed: countdown
* - changed:
*   - interval (required):
*       Can be a function mapping the current tick to the time to wait until the next tick.
*       Can be an array containing times to wait. The TickTock must be stopped manually once each array element has been used.
*       Can be a number (like in Tock's API).
*       Whenever a falsy value is retrieved from 'interval' the clock stops.
*   - callback (required): Is now required.
*/

class TickTock {
    constructor(options={}) {
        this.isRunning = false
        this.timeout = null
        this.startTime = 0
        this.stopTime = 0
        this.time = 0
        this.tick = 0

        this.interval = (
            typeof(options.interval) === 'function'
            // use given function
            ? options.interval
            : (
                Array.isArray(options.interval)
                // map tick to list item
                ? (time, tick) => options.interval[tick]
                // map tick to constant value
                : (time, tick) => options.interval
            )
        )
        this.callback = options.callback
        this.complete = options.complete
        this._tick = this._tick.bind(this)
    }

    start() {
        if (this.isRunning) {
            console.warn('Cannot start. TickTock is already running.')
        }
        this._startTimer(performance.now())
        return this
    }

    // Stop the clock and clear the timeout
    stop() {
        if (!this.isRunning) {
            console.warn('Cannot stop. TickTock is not running.')
        }
        this.stopTime = this.elapsed()
        this.isRunning = false
        clearTimeout(this.timeout)
        return this
    }

    resume() {
        if (this.isRunning) {
            console.warn('Cannot resume. TickTock is already running.')
        }
        this._startTimer(performance.now() - this.stopTime)
        return this
    }

    reset() {
        this.startTime = 0
        this.stopTime = 0
        this.time = 0
        this.tick = 0
        return this
    }

    // Get the current clock time in ms.
    elapsed() {
        if (this.isRunning) {
            return performance.now() - this.startTime
        }
        return this.stopTime
    }

    // Called for every tick.
    _tick() {
        this.callback(this, this.time, this.tick)
        const timeout = this.interval(this.time, this.tick)
        if (!timeout) {
            this.stop()
            this.complete && this.complete(this, this.time, this.tick, this.stopTime)
            return
        }

        this.time += timeout
        this.tick += 1

        const nextTickIn = this.startTime + this.time - performance.now()

        if (nextTickIn <= 0) {
            const missed_ticks = Math.floor(-nextTickIn / timeout)
            this.time += missed_ticks * timeout

            if (this.isRunning) {
                this._tick()
            }
        }
        else if (this.isRunning) {
            this.timeout = setTimeout(this._tick, nextTickIn)
        }
    }

    _startTimer(startTime) {
        this.startTime = startTime
        this.isRunning = true
        this.time = 0
        this.stopTime = 0
        this._tick()
    }
}

export {TickTock}
export default TickTock
