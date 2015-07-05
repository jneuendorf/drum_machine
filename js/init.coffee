# getCompletePath = (kitName, instrumentPath) ->
#     getPathFromKitName = (name) ->
#         return name.replace(" ", "_").toLowerCase()
#
#     return "kits/" + getPathFromKitName(kitName) + "/" + instrumentPath

$(document).ready () ->
    # makeInstruments = (drumkits) ->

        # for kitName, kitFiles of drumkits
        #     for instrumentName, instrumentPath of kitFiles
        #         # modify drumkits object
        #         kitFiles[instrumentName] = new App.Instrument(instrumentName, kitName, getCompletePath(kitName, instrumentPath), 80)
        # return drumkits
    makeInstruments = (instruments) ->
        res = {}
        for instrumentName, instrumentPath of instruments
            # modify drumkits object
            res[instrumentName] = new App.Instrument(instrumentName, instrumentPath, 80)
        return res


    soundManager.setup {
        url:	"includes/swf/",
        onready: ()	->
            console.log("soundmanager is ready")

            timer = performance or Date

            start = timer.now()

            App.instruments = makeInstruments(App.instruments)

            dm = new App.DrumMachine(document.body, App.instruments, [
                App.instruments["Hihat Default"]
                App.instruments["High tom"]
                App.instruments["Mid tom"]
                App.instruments["Snare Default"]
                App.instruments["Low tom"]
                App.instruments["Bass Kick Default"]
            ])

            dm.draw()

            window.dm = dm

            console.log "time to create drum machine was #{timer.now() - start} ms"
    }
