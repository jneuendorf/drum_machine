class App.Measure
    @MAX_BPM    = 480
    MAX_BPM     = @MAX_BPM
    @MAX_BEATS  = 20
    MAX_BEATS   = @MAX_BEATS
    # how much will a quarter note be split? (4ths, 8ths, 16ths, 32nds, 64ths)
    # @MODES      = [1, 2, 4, 8, 16]
    @STEPSIZES  = [64, 32, 16, 8, 4, 2, 1]
    # each value represents an Xth note (8 -> 8th notes)
    @MODES      = [1, 2, 4, 8, 16, 32, 64]
    @MODES.LAST = 64
    @MODE_NAMES = ["whole", "half", "quarter", "8th", "16th", "32nd", "64th"]

    MODES       = @MODES
    MODE_NAMES  = @MODE_NAMES
    STEPSIZES   = @STEPSIZES

    count = 0
    @getID: () ->
        return "measure" + count++

    constructor: (drumMachine, instruments, timeSignature, mode, bpm) ->
        @drumMachine    = drumMachine
        @instruments    = instruments
        @timeSignature  = timeSignature
        @bpm            = bpm

        @noteIndex      = 0
        @div            = null
        @id             = App.Measure.getID()

        idx = MODES.indexOf mode
        # set default to 8th notes
        if idx < 0
            idx = 3
        @mode = MODES[idx]

        # init data
        data = []

        # init with null values
        xMax = @timeSignature[0] * MODES.LAST
        yMax = @instruments.length
        for x in [0...xMax]
            # init column
            # col = []
            # col.push(null) for y in [0...yMax]
            # data[x] = col
            data[x] = (null for y in [0...yMax])

        @data = data

    drawSettings: () ->
        self = @
        # inner functions
        # resetBPM = (ev, textfield) ->
        #     self.setBPM parseInt(textfield.value, 10)
        #     return self

        # resetStepSize = (ev, select) ->
        #     self.setStepSize parseInt(select.value, 10)
        #     self.draw()
        #     return self

        drawOptions = () ->
            res = ""
            for val, i in MODES
                res += "<option value=\"#{val}\"#{if self.mode isnt val then "" else " selected"}>#{MODE_NAMES[i]}</option>"
            return res
        # end of inner functions


        settings = $ """<div class="measureSettings">
                            <div class="split setting">
                                <select class="select">
                                    #{drawOptions()}
                                </select>
                                notes,
                            </div>
                            <div class="bpm setting">
                                BPM: <input class="bpm" type="number" value="#{@bpm}" min="1" max="#{MAX_BPM}" />
                            </div>
                            <div class="timeSignature setting">
                                Time signature:
                                <input class="timeSignatureValue" data-type="numBeats" type="number" value="#{@timeSignature[0]}" min="1" max="#{MAX_BEATS}" />
                                /
                                <input class="timeSignatureValue" data-type="beatValue" type="number" value="#{@timeSignature[1]}" min="1" max="#{MAX_BEATS}" />
                            </div>
                            <div class="close setting">
                                &#10006;
                            </div>
                            <div class="clear" />
                        </div>"""

        settings.find(".select").change (ev) ->
            # return resetStepSize(ev, @)
            self.setStepSize parseInt(@value, 10)
            return self.draw()

        settings.find("input.bpm").change (ev) ->
            # return resetBPM(ev, @)
            return self.setBPM parseInt(@value, 10)

        settings.find("input.timeSignatureValue").change (ev) ->
            value = parseInt(@value, 10)
            if $(@).attr("data-type") is "numBeats"
                # TODO
                # more beats
                if value > self.timeSignature[0]
                    true
                # less beats
                else
                    true
            else
                true
            return true

        settings.find(".close").click (ev) ->
            return self.remove()

        return settings

    draw: () ->
        self        = @
        div         = @div
        firstDraw   = div not instanceof jQuery

        if firstDraw
            div = $ "<div class='measure' id='#{@id}' />"
        else
            div.empty()

        # draw measure settings
        div.append @drawSettings()

        # 4/4; 8th notes
        # for each beat => 2 (8/note value = 8/4 = 2)
        # max for each beat = 16 (modes.last / note value)
        # => stepsize = max / current = 16 / 4 = 4
        # (modes.last / note value) / (mode/note_value)
        # modes.last / mode (here: 64/16 = 4)

        

        # stepSize = MODES.LAST / @mode
        stepSize = STEPSIZES[MODES.indexOf(@mode)]
        console.log stepSize

        for col, idx in @data by stepSize
            # clone = instruments.clone()
            column = $ "<div class='column' data-colidx='#{idx}' />"

            # ignore last instrument because it's a pseudo instrument (drop area for new instruments)
            for i in [0...(col.length - 1)]
                note = col[i]
                note = $ "<div class='instrument note#{if note? then " active" else ""}' />"
                # click on note
                do (i, note, idx) ->
                    instrumentDiv = $("#instruments .instrument").eq(i)
                    note
                        .mouseenter () ->
                            instrumentDiv
                                .addClass("hovered")
                                .siblings(".hovered")
                                .removeClass("hovered")
                            return true
                        .mouseleave () ->
                            instrumentDiv
                                .removeClass("hovered")
                            return true
                        .click () ->
                            self.toggleNote(idx, i)
                            if self.noteIsActive(idx, i)
                                note.addClass "active"
                            else
                                note.removeClass "active"
                            return true
                column.append note

            div.append column

        # clear both after last column
        div.append "<div class='clear' />"

        if firstDraw
            @div = div

        return @

    remove: () ->
        @drumMachine.removeMeasure(@)
        return @

    toggleNote: (x, y) ->
        if @data[x][y] instanceof App.Instrument
            @data[x][y] = null
        else
            @data[x][y] = @instruments[y]

        return @

    noteIsActive: (x, y) ->
        return @data[x][y] instanceof App.Instrument

    getDiv: () ->
        return @div

    getNextColumn: (activeNotes = true, cycle = false) ->
        if @noteIndex is @data.length - 1
            if not cycle
                return @getColumnAtIndex(activeNotes, -1)
            # first column again
            else
                @noteIndex = 0
        else
            @noteIndex += @stepSize

        return @getCurrentColumn(activeNotes)

    resetPosition: () ->
        @noteIndex = 0
        return @

    getCurrentColumn: (activeNotes = true) ->
        return @getColumnAtIndex activeNotes, @noteIndex

    getColumnAtIndex: (activeNotes, idx) ->
        # invalid index
        if idx < 0 or idx >= @data.length
            return null
        # filter active notes
        if activeNotes is true
            return (instrument for instrument in @data[idx] when instrument?)
        # entire column
        return @data[idx]

    getIntervalDelay: () ->
        return ((@timeSignature[0] * 60000) / @bpm) / @getVisibleLength()

    getColumnDivs: () ->
        return @div.find(".column")

    getCurrentColumnDiv: () ->
        # noteIndex is the index in @data => adjust index for visible notes
        return @getColumnDivs().eq( @noteIndex / @stepSize )

    addInstumentToData: (instrument) ->
        # @instruments.push instrument
        for col in @data
            col.push null
        return @

    removeInstrumentFromData: (index) ->
        # the following is not necessary because the measure's instruments are just a reference to the drummachine's instrumens
        # @instruments.splice index, 1
        for col in @data
            col.splice index, 1
        return @

    serialize: () ->
        data = []
        for col in @data
            temp = []
            for note in col
                if note?
                    temp.push 1
                else
                    temp.push 0
            data.push temp

        return {
            beats:  @timeSignature[0]
            bpm:    @bpm
            data:   data
        }

    ########################
    # SETTERS
    setBPM: (bpm) ->
        if 1 <= bpm <= App.Measure.maxBPM
            @bpm = Math.floor bpm
        else
            @bpm = 120
        return @

    setStepSize: (stepSize) ->
        if stepSize in STEPSIZES
            @stepSize = stepSize
        else
            @stepSize = 2 # default is 8th notes
        return @

    # setInstruments: (instruments) ->
    #     @instruments = instruments
    #     return @
    #
    # setData: (data) ->
    #     @data = data
    #     return @

    # GETTERS
    # getDrumMachine: () ->
    #     return @drumMachine
    #
    # getInstruments: () ->
    #     return @instruments
    #
    # getVisibleLength: () ->
    #     return @data.length / @stepSize
    #
    # getBeats: () ->
    #     return @timeSignature[0]
    #
    # getLength: () ->
    #     return @data.length
    #
    # getID: () ->
    #     return @id
    #
    # getNoteIndex: () ->
    #     return @noteIndex
    #
    # getBPM: () ->
    #     return @bpm
