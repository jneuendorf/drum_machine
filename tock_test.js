import Tock from './lib/tock'


const interval = 150
let lastTick = -1
let numberSkipped = 0

const clock = new Tock({
    interval,
    callback: (self) => {
        const elapsed = clock.lap()
        const tick = Math.floor(elapsed / interval)
        console.log('current tick:', tick, elapsed / interval, elapsed)
        if (tick !== lastTick + 1) {
            console.error(`skipped a callback. current tick=${tick}`)
            numberSkipped++
        }
        console.log(
            'off by', elapsed - tick*interval,
            'number of skipped ticks', numberSkipped,
            // 'internal missed_ticks', clock.missed_ticks
        )
        console.log('====================')
        lastTick = tick
    }
})

clock.start()
