/**
* Tock by Mr Chimp - github.com/mrchimp/tock
* Based on code by James Edwards:
*    sitepoint.com/creating-accurate-timers-in-javascript/
*/

// Implements Date.now() for ie lt 9
Date.now = Date.now || (() => +(new Date()))

// Polyfills Function.prototype.bind for IE lt 9 and Safari lt 5.1
Function.prototype.bind = Function.prototype.bind || function(ctx, ...args) {
    const fn = this
    return function() {
        return fn.apply(ctx, ...args, ...arguments)
    }
}


const noop = () => {}


class Tock {
    static instances = 0

    constructor(options={}) {
        if (!(this instanceof Tock)) {
            return new Tock(options)
        }

        Tock.instances++

        this.go = false
        this.timeout = null
        this.missed_ticks = null
        this.interval = options.interval || 10
        this.countdown = options.countdown || false
        this.start_time = 0
        this.pause_time = 0
        this.final_time = 0
        this.duration_ms = 0
        this.time = 0
        this.tick = 0
        this.callback = options.callback || noop
        this.complete = options.complete || noop
    }

    /**
    * Start the clock.
    * @param {Integer} time Number of milliseconds
    */
    start(time=0) {
        if (this.go) {
            return false
        }

        // NOTE: start_time is set in both _startCountdown and _startTimer
        // this.start_time = time
        this.pause_time = 0

        if (this.countdown) {
            this._startCountdown(time)
        }
        else {
            this._startTimer(Date.now() - time)
        }
    }

    /**
    * Stop the clock and clear the timeout
    */
    stop() {
        this.pause_time = this.lap()
        this.go = false

        clearTimeout(this.timeout)

        if (this.countdown) {
            this.final_time = this.duration_ms - this.time
        }
        else {
            this.final_time = (Date.now() - this.start_time)
        }
    }

    /**
    * Stop/start the clock.
    */
    pause() {
        if (this.go) {
            this.pause_time = this.lap()
            this.stop()
        }
        else {
            if (this.pause_time) {
                if (this.countdown) {
                    this._startCountdown(this.pause_time)
                }
                else {
                    this._startTimer(Date.now() - this.pause_time)
                }

                this.pause_time = 0
            }
        }
    }

    reset() {
        if (this.countdown) {
            return false
        }

        this.stop()
        this.start_time = 0
        this.time = 0
    }

    /**
    * Get the current clock time in ms.
    * @return {Integer} Number of milliseconds ellapsed/remaining
    */
    lap() {
        if (this.go) {
            if (this.countdown) {
                return this.duration_ms - (Date.now() - this.start_time)
            }
            else {
                return Date.now() - this.start_time
            }
        }
        return this.pause_time || this.final_time
    }

    /**
    * Called every tick for countdown clocks.
    * i.e. once every this.interval ms
    */
    _tick() {
        this.time += this.interval

        if (this.countdown && this.duration_ms - this.time < 0) {
            this.final_time = 0
            this.go = false
            this.callback(this, this.tick)
            clearTimeout(this.timeout)
            this.complete(this)
            return
        }
        else {
            this.callback(this, this.tick)
        }

        this.tick += 1
        const next_interval_in = this.start_time + this.time - Date.now()

        if (next_interval_in <= 0) {
            this.missed_ticks = Math.floor(-next_interval_in / this.interval)
            this.time += this.missed_ticks * this.interval

            if (this.go) {
                this._tick()
            }
        }
        else if (this.go) {
            this.timeout = setTimeout(() => this._tick(), next_interval_in)
        }
    }

    /**
    * Called by Tock internally - use start() instead
    */
    _startCountdown(duration) {
        this.duration_ms = duration
        this.start_time = Date.now()
        this.time = 0
        this.go = true
        this._tick()
    }

    /**
    * Called by Tock internally - use start() instead
    */
    _startTimer(start_time) {
        this.start_time = start_time // || Date.now()
        this.time = 0
        this.go = true
        this._tick()
    }
}

export {Tock}
export default Tock
