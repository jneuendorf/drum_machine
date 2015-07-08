class DM.Measure
    @MAX_BPM        = 240
    MAX_BPM         = @MAX_BPM
    @MAX_BEATS      = 20
    MAX_BEATS       = @MAX_BEATS
    @MAX_NOTE_VALUE = 64
    MAX_NOTE_VALUE  = @MAX_NOTE_VALUE
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

    constructor: (drumMachine, timeSignature, mode, bpm) ->
        @drumMachine            = drumMachine
        [@beats, @noteValue]    = timeSignature
        @bpm                    = bpm
        @instruments            = drumMachine.parts.instruments.used
        # @container              = drumMachine.parts.measures.svg
        @svg                    = null

        @noteIndex  = 0
        @id         = DM.Measure.getID()

        @container  = null
        @x          = null
        @y          = null
        @drawDot    = null

        idx = MODES.indexOf mode
        # set default to 8th notes
        if idx < 0
            idx = 3
        @mode = MODES[idx]

        # init data with boolean values
        data        = {}
        dataLength  = @_maxNumNotes()
        for instrument in @instruments
            data[instrument] = (false for i in [0...dataLength])
        @data = data

        Object.defineProperty @, "dataLength", {
            get: () ->
                keys = Object.keys(@data)
                return @data[keys[0]]?.length or 0
            set: () ->
                console.warn "Cannnot set DM.Measure::dataLength!"
                return @
        }

    _maxNumNotes: () ->
        return (@mode / @noteValue) * @beats

    addInstruments: (instrumentNames...) ->
        console.log "DM.Measure::addInstruments: adding instruments", instrumentNames
        data            = @data
        # measureLength   = @_maxNumNotes()
        for instrumentName in instrumentNames
            data[instrumentName] = (false for i in [0...@dataLength])
        return @

    removeInstruments: (instrumentNames...) ->
        console.log "DM.Measure::removeInstruments: removing instruments", instrumentNames
        for instrumentName in instrumentNames
            delete @data[instrumentName]
        return @

    _updateMusicValues: (bpm, beats, noteValue, mode) ->
        # lessNotes = false
        if beats < @beats
            # lessNotes = true
            if not confirm "Shrinking the measure will result in loss of data!"
                return @

        @bpm        = bpm
        @beats      = beats
        @noteValue  = noteValue
        @mode       = mode

        data        = {}
        dataLength  = @_maxNumNotes()
        for instrument in @instruments
            data[instrument] = (@data[instrument][i] or false for i in [0...dataLength])
        @data = data

        @drumMachine.parts.measures.draw()

        return @


    # DRAW STUFF
    draw: (container = @container, x = @x, y = @y, drawDot = @drawDot or false) ->
        self        = @
        drumMachine = @drumMachine

        if arguments.length > 0
            @container  = container
            @x          = x
            @y          = y
            @drawDot    = drawDot


        hSpacing    = 10
        vSpacing    = 10
        width       = 30
        height      = 30
        # inner offset ... aka padding ;)
        offsetTop   = 35
        offsetLeft  = 30

        group = container.append "g"
                        .classed "measure", true
                        .attr "transform", "translate(#{x},#{y})"
        @svg  = group

        if drawDot
            @appendDot()

        stepSize    = Math.ceil(@dataLength / @mode)
        @stepSize   = stepSize

        rowIdx = 0
        for instrumentName, notes of @data
            row = group.append "g"
                        .classed "row", true
                        .attr "transform", "translate(#{offsetLeft} ,#{rowIdx * (height + vSpacing) + offsetTop})"
            group.append "text"
                .text DM.Utils.getInstrumentAbbreviation(instrumentName)
                .attr "x", 15
                .attr "y", rowIdx * (height + vSpacing) + offsetTop + 20
                .style "text-anchor", "middle"

            noteIndex = 0
            lastX = 0
            for note, idx in notes by stepSize
                lastX = noteIndex * (width + hSpacing)
                noteRect = row.append "rect"
                    .classed "note", true
                    # set as active
                    .classed "active", note
                    .attr "x", lastX
                    .attr "y", 0
                    .attr "width", width
                    .attr "height", height
                    .attr "stroke", "black"
                    .attr "stroke-width", 1
                    .attr "rx", 3
                    .attr "ry", 3
                noteRect.on "click", do (noteRect, instrumentName, noteIndex) ->
                    return () ->
                        if self.toggleNote(instrumentName, noteIndex) is true
                            noteRect.classed "active", true
                        else
                            noteRect.classed "active", false
                        return true

                noteIndex++

            rowIdx++

        group.append "text"
            .classed "bpm", true
            .text "#{@bpm} BPM"
            .attr "x", 0
            .attr "y", 10

        group.append "text"
            .classed "timeSignature", true
            .text "(#{@beats}/#{@noteValue}) time"
            .attr "x", 100
            .attr "y", 10

        # settings button
        group.append "text"
            .classed "edit", true
            .text "⚙"
            .attr "x", lastX + width + 15
            .attr "y", 10
            .style "cursor", "pointer"
            .style "text-anchor", "middle"
            .on "click", () ->
                div = drumMachine.popup.find(".content")
                div.empty().append self.popupContent()
                drumMachine.showPopup () ->
                    data        = div.find(".data")
                    bpm         = parseInt(data.filter(".bpm").val(), 10)
                    beats       = parseInt(data.filter(".beats").val(), 10)
                    noteValue   = parseInt(data.filter(".noteValue").val(), 10)
                    mode        = parseInt(data.filter(".mode").val(), 10)
                    if not isNaN(bpm) and not isNaN(beats) and not isNaN(noteValue) and not isNaN(mode)
                        self._updateMusicValues(bpm, beats, noteValue, mode)
                        return true
                    return false
                return true


        return {
            width:  lastX + width
            height: rowIdx * height + offsetTop + hSpacing * rowIdx
        }

    popupContent: () ->
        drumMachine = @drumMachine
        res = $ """<div>
                        <div>
                            <span style="display:inline-block; width: 100px;">BPM:</span>
                            <input class="data bpm" type="number" min="1" max="#{MAX_BPM}" value="#{@bpm}" />
                        </div>
                        <div>
                            <span style="display:inline-block; width: 100px;">beats:</span>
                            <input class="data beats" type="number" min="1" max="#{MAX_BEATS}" value="#{@beats}" />
                        </div>
                        <div>
                            <span style="display:inline-block; width: 100px;">note value:</span>
                            <input class="data noteValue" type="number" min="1" max="#{MAX_NOTE_VALUE}" value="#{@noteValue}" />
                        </div>
                        <div>
                            <select class="data mode">
                                #{"<option value=\"#{mode}\"#{if mode is @mode then " selected" else ""}>#{MODE_NAMES[idx]}</option>" for mode, idx in MODES}
                            </select>
                        </div>
                        <button>OK</button>
                    </div>"""

        res.find("button").click () ->
            drumMachine.hidePopup()
            return true

        return res


    ######################################################################################################
    # DOT FUNCTIONS
    appendDot: () ->
        width       = 30
        height      = 30
        # inner offset ... aka padding ;)
        offsetTop   = 35
        offsetLeft  = 30
        @svg.append "circle"
            .classed "dot", true
            .attr "r", 4
            .attr "cx", offsetLeft + width / 2
            .attr "cy", offsetTop / 2 + 8
            .style "fill", "black"
        return @

    moveDot: (duration) ->
        noteIndex   = @noteIndex
        hSpacing    = 10
        vSpacing    = 10
        width       = 30
        height      = 30
        # inner offset ... aka padding ;)
        offsetTop   = 35
        offsetLeft  = 30

        dot = @svg.select(".dot")

        dot.transition()
            # .attr "cx", offsetLeft + (noteIndex + 1) * (width + hSpacing * noteIndex)
            .attr "cx", parseInt(dot.attr("cx"), 10) + width + hSpacing
            .duration duration
        return @

    removeDot: () ->
        @svg.select(".dot").remove()
        return @

    remove: () ->
        @drumMachine.removeMeasure(@)
        return @

    # NOTE: returns the current state of the note
    toggleNote: (instrumentName, noteIndex) ->
        notes = @data[instrumentName]
        if notes[noteIndex] is false
            notes[noteIndex] = true
            return true

        notes[noteIndex] = false
        return false

    noteIsActive: (instrumentName, noteIndex) ->
        return @data[instrumentName][noteIndex] is true

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

    getDelay: () ->
        # return ((@timeSignature[0] * 60000) / @bpm) / @getVisibleLength()
        visibleLength = @dataLength / @stepSize
        return ((@beats * 60000) / @bpm) / visibleLength

    getColumnDivs: () ->
        return @div.find(".column")

    getCurrentColumnDiv: () ->
        # noteIndex is the index in @data => adjust index for visible notes
        return @getColumnDivs().eq( @noteIndex / @stepSize )

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
