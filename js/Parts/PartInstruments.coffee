##########
# DRUMKITS
class DM.PartInstruments extends DM.Part

    constructor: (drumMachine, container, className, id) ->
        super(drumMachine, container, className, id)
        @instruments    = []
        # create property that makes sure that assignment does not change the pointer of the property
        @_used          = []
        Object.defineProperty @, "used", {
            get: () ->
                return @_used
            set: (arr) ->
                if arr instanceof Array
                    @_used.length = arr.length
                    for elem, idx in arr
                        @_used[idx] = elem
                return @
        }

    draw: () ->
        self            = @
        drumMachine     = @drumMachine
        @instruments    = DM.instruments
        @svg            = @makeContainer(10, 10)
        instrumentIdx   = 0

        for drumkitName, drumKit of drumMachine.loader.sprites
            for instrumentName, instrument of drumKit
                do (instrumentName, instrument, instrumentIdx) =>
                    group = @svg.append "g"
                                .classed "instrumentButton", true
                                .attr "data-idx", instrumentIdx
                                .style "cursor", "pointer"

                    group.append "rect"
                        .attr "class", "instrument"
                        .attr "data-instrumentname", instrumentName
                        .attr "x", 10
                        .attr "y", instrumentIdx * 60
                        .attr "width", 200
                        .attr "height", 40
                        .attr "rx", 6
                        .attr "ry", 6
                        .style "stroke", "black"
                        .style "stroke-width", 2
                    group.append "text"
                        .text instrumentName
                        .attr "x", 111
                        .attr "y", instrumentIdx * 60 + 26
                        .style "text-anchor", "middle"
                    group.append "text"
                        .attr "class", "checkmark"
                        .text "✓"
                        .attr "x", 192
                        .attr "y", instrumentIdx * 60 + 26
                        .style "text-anchor", "middle"

                    removeButton = group.append "g"
                                        .classed "remove", true
                                        .attr "transform", "translate(200, #{instrumentIdx * 60 - 5})"
                                        .style "display", "none"
                    removeButton.append "circle"
                        .attr "r", 8
                        .attr "cx", 8
                        .attr "cy", 8
                        .style "fill", "black"
                        .style "stroke", "black"
                        .style "stroke-width", 2
                    removeButton.append "text"
                        .html "&times;"
                        .attr "x", 8
                        .attr "y", 13
                        .style "fill", "white"
                        .style "text-anchor", "middle"
                    removeButton.on "click", () ->
                        d3.event.stopPropagation()
                        if confirm "This deletes the instrument permanently for this session. Sure??"
                            drumMachine.removeInstrument(instrument)
                        return false

                    group
                        .on "click", () ->
                            group = d3.select(@)
                            if instrumentName not in self.used
                                self.used.push instrumentName
                                group.classed "clicked", true
                                drumMachine.addInstrumentsToMeasures instrumentName
                            else
                                self.used = (i for i in self.used when i isnt instrumentName)
                                group.classed "clicked", false
                                drumMachine.removeInstrumentsFromMeasures instrumentName

                            console.log self.used
                            return true
                        .on "mouseenter", () ->
                            d3.select(@).select(".remove").style("display", "block")
                            return true
                        .on "mouseleave", () ->
                            d3.select(@).select(".remove").style("display", "none")
                            return true

                    # for initial draw only
                    if instrumentName in @used
                        group.classed "clicked", true

                    instrument.svg = group

                instrumentIdx++

        # ADD-INSTRUMENT BUTTON
        group = @svg.append "g"
                    .attr "data-idx", instrumentIdx
                    .style "cursor", "pointer"

        group.append "rect"
            .attr "class", "instrument"
            .attr "x", 10
            .attr "y", instrumentIdx * 60
            .attr "width", 200
            .attr "height", 40
            .attr "rx", 6
            .attr "ry", 6
            .style "fill", "transparent"
            .style "stroke", "black"
            .style "stroke-width", 2
        group.append "text"
            .text "Add instrument..."
            .attr "x", 111
            .attr "y", instrumentIdx * 60 + 26
            .style "text-anchor", "middle"

        # instrument.svg = group

        console.log "drumkits done"

        return @
