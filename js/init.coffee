$(document).ready () ->

    timer = performance or Date

    start = timer.now()

    dm      = null
    loader  = new DM.SpriteLoader()
    loader.load () ->
        dm = new DM.DrumMachine(document.body, loader)
        dm.setUsedInstruments("Hi Hat 1", "Snare 1", "Kick 4", false)
        dm.draw()

        window.dm = dm

        console.log "time to create drum machine was #{timer.now() - start} ms"
