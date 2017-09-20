getCompletePath = (kitName, instrumentPath) ->
    getPathFromKitName = (name) ->
        return name.replace(" ", "_").toLowerCase()

    return "kits/" + getPathFromKitName(kitName) + "/" + instrumentPath

$(document).ready () ->
    console.log "asdf"
    makeInstruments = (drumkits) ->
        res = $("<div class='drumkits' />")
        for kitName, kitFiles of drumkits
            drumkitDiv = $ "<div class='drumkit' />"
            for instrumentName, instrumentPath of kitFiles
                instrumentDiv = $ "<div class='instrument' />"
                instrumentDiv.text(instrumentName)
                drumkitDiv.append(instrumentDiv)

                # modify drumkits object
                kitFiles[instrumentName] = new App.Instrument(instrumentName, kitName, getCompletePath(kitName, instrumentPath), 80)

            res.append(drumkitDiv)

        return drumkits


    soundManager.setup {
        url:	"includes/swf/",
        onready: ()	->
            console.log("soundmanager is ready")

            dm = new App.DrumMachine($(document.body), makeInstruments(App.drumkits), [
                App.drumkits.Rock["Bass Kick Default"],
                App.drumkits.Rock["Snare Default"],
                App.drumkits.Rock["Hihat Default"],
                null
            ])

            dm.draw()

            window.dm = dm
    }
