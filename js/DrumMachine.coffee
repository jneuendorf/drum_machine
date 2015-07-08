class DM.DrumMachine

    @new: (container, instruments) ->
        return new DM.DrumMachine(container, instruments)

    constructor: (container, loader) ->
        if container instanceof jQuery
            container = container[0]
        @container = d3.select(container)

        @loader = loader

        @measureIndex   = 0
        @noteIdx        = 0
        @position       = 0
        # save a reference to window.setInterval
        @interval       = null
        @svg            = @container
                            .append("svg")
                            .attr("xmlns", "http://www.w3.org/2000/svg")
                            .attr("class", "drumMachine")
                            .attr("width", 1000)
                            .attr("height", 1000)

        self        = @
        jContainer  = $(@container[0][0])
        @popup = $ """<div class="popup">
                                 <div class="overlay" />
                                 <div class="content" />
                             </div>"""
        @popup.find(".overlay").click () ->
            self.hidePopup()
            return true
        jContainer.append @popup

        @parts =
            instruments:    DM.Part.new("Instruments", @, @svg)
            playButtons:    DM.Part.new("PlayButtons", @, @svg)
            measures:       DM.Part.new("Measures", @, @svg)
            io:             DM.Part.new("IO", @, @svg)

        @measures = []
        @measures.push new DM.Measure(@, [4, 4], 8, 120)
        @measures.push new DM.Measure(@, [3, 4], 8, 120)

        console.log @

    registerDelegation: (from, name, method) ->
        if not @[name]?
            @[name] = () ->
                return method.apply(from, arguments)
        return @

    draw: () ->
        # draw all components
        for name, part of @parts
            part.draw()

        return @

    drawPartial: (ignoreList) ->
        # make sure ignore list is an array
        if ignoreList not instanceof Array
            ignoreList = [ignoreList]

        for name, part of @parts when name not in ignoreList
            part.draw()

        return @

    ###########################
    # EXPORT / IMPORT FUNCTIONS
    showPopup: (onClose) ->
        @popup.fadeIn 200
        @popup.onClose = onClose
        return @

    hidePopup: () ->
        if @popup.onClose?() is false
            return @
        @popup.fadeOut 200
        return @

    # export: () ->
    #     instruments = (instrument.serialize() for instrument in @instruments when instrument?)
    #     measures    = (measure.serialize() for measure in @measures)
    #
    #     json = JSON.stringify {
    #         "instruments":    instruments
    #         "measures":        measures
    #     }
    #
    #     @popup.fadeIn(200).find(".text").val json
    #
    #     return @
    #
    # import: () ->
    #     # get json
    #     json = @popup.find(".text").val()
    #
    #     if not json? or json is ""
    #         return @
    #
    #     json = $.parseJSON json
    #
    #     if not json? or $.isEmptyObject json
    #         return @
    #
    #     # json looks like
    #     # {"instruments":[{"name":"Bass Kick Default","kitName":"Rock","volume":80},{"name":"Snare Default","kitName":"Rock","volume":80},{"name":"Hihat Default","kitName":"Rock","volume":80}],"measures":[{"beats":4,"bpm":120,"data":[[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]},{"beats":3,"bpm":120,"data":[[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]}]}
    #
    #     # INNER FUNCTIONS
    #     makeInstrumentFromKit = (kitName, name, volume) =>
    #         path = @drumkits[kitName]
    #         if path? and (instrument = path[name])?
    #             console.log instrument
    #             return instrument
    #         return null
    #
    #     transformData = (data, instruments) ->
    #         for col, x in data
    #             for note, y in col
    #                 if note is 0
    #                     data[x][y] = null
    #                 else
    #                     data[x][y] = instruments[y]
    #         return data
    #     # END OF INNER FUNCTIONS
    #
    #     @instruments = []
    #     @measures = []
    #
    #     instruments = json.instruments
    #     measures = json.measures
    #     # load instruments
    #     for instrument in instruments
    #         temp = makeInstrumentFromKit instrument.kitName, instrument.name, instrument.volume
    #         if temp?
    #             @instruments.push temp
    #     # drop area
    #     @instruments.push null
    #
    #     # load measures
    #     for measure in measures
    #         newMeasure = new DM.Measure(@, @instruments, 2, measure.beats, measure.bpm)
    #         newMeasure.setData transformData(measure.data, @instruments)
    #         @measures.push newMeasure
    #
    #
    #     @drawPartial [DM.PartDrumkits, DM.PartImportExport]
    #     @hidePopup()
    #
    #     return @

    setUsedInstruments: (instrumentNames..., redraw) ->
        if typeof redraw isnt "boolean"
            instrumentNames.push redraw
            redraw = true

        diff = DM.Utils.arrayDiff(@parts.instruments.used, instrumentNames)
        @parts.instruments.used = instrumentNames

        @addInstrumentsToMeasures(diff.added..., redraw)
        @removeInstrumentsFromMeasures(diff.removed..., redraw)

        if redraw is true
            @parts.measures.draw()
        return @

    addInstrumentsToMeasures: (instrumentNames..., redraw) ->
        if typeof redraw isnt "boolean"
            instrumentNames.push redraw
            redraw = true

        for measure in @measures
            measure.addInstruments instrumentNames...

        if redraw is true
            @parts.measures.draw()

        # if instrument instanceof DM.Instrument
        #     # add instrument to (n - 1)th position (so 'null' stays last => droppable is drawn at bottom)
        #     @instruments.splice @instruments.length - 1, 0, instrument
        #
        #     for measure in @measures
        #         measure.addInstumentToData instrument
        #
        #     # @drawPartial [DM.PartDrumkits, DM.PartImportExport]
        #     @drawPartial ["drumkits", "importExport"]

        return @

    removeInstrumentsFromMeasures: (instrumentNames..., redraw = true) ->
        if typeof redraw isnt "boolean"
            instrumentNames.push redraw
            redraw = true

        for measure in @measures
            measure.removeInstruments instrumentNames...

        if redraw is true
            @parts.measures.draw()

        return @

    addMeasure: (measure) ->
        console.log @measures
        if not measure?
            measure = new DM.Measure(@, @instruments, 2, 4, 120)
        @measures.push measure
        @draw()
        return @

    removeMeasure: (measure) ->
        @measures = (m for m in @measures when m isnt measure)
        @draw()
        return @

    ################################################################################################
    # PLAY FUNCTIONS
    startPlaying: () ->
        self            = @
        currentMeasure  = @measures[@measureIndex]
        resetInterval   = false
        delay           = currentMeasure.getDelay()

        # inner function
        playColumn = () ->
            if resetInterval is true
                delay = currentMeasure.getDelay()
                window.clearInterval self.interval
                self.interval   = window.setInterval(playColumn, delay)
                resetInterval   = false


            noteIndex = currentMeasure.noteIndex
            for instrumentName, data of currentMeasure.data when data[noteIndex] is true
                dm.loader.drumkits["rock-drumkit"].play(instrumentName)

            # played noteIndex was last note in current measure => go to next measure
            if noteIndex is currentMeasure.dataLength - 1
                currentMeasure.noteIndex = 0
                currentMeasure.removeDot()

                if self.measureIndex < self.measures.length - 1
                    self.measureIndex++
                else
                    self.measureIndex = 0

                currentMeasure  = self.measures[self.measureIndex]
                currentMeasure.appendDot()

                # set flag to reset and create new interval on next call
                resetInterval   = true
            else
                currentMeasure.noteIndex++
                currentMeasure.moveDot(delay / 4)

            return true
        # end of inner function

        @interval = window.setInterval(playColumn, delay)
        return @

    pause: () ->
        window.clearInterval(@interval)
        @interval = null
        return @

    # pause + reset
    stop: () ->
        @pause()
        for measure in @measures
            measure.noteIndex = 0
        @measureIndex = 0
        return @

    isPlaying: () ->
        return @interval?
