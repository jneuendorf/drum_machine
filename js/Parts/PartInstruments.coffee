##########
# DRUMKITS
class App.PartInstruments extends App.Part
    # constructor: (drumMachine, container, className, id) ->
    #     super(drumMachine, container, className, id)

    draw: () ->
        # div         = @container.find(".#{@_id}")
        # firstDraw   = @svg is null
        drumMachine   = @drumMachine

        @svg = @makeContainer(10, 10)

        instrumentIdx = 0
        # instruments = $.extend({}, App.instruments)
        # instruments["Add instrument..."] = ""
        for instrumentName, instrument of App.instruments

            do (instrumentName, instrument, instrumentIdx) =>

                # @svg.append """<div class="instrument" data-kitname="#{kitName}" data-instrumentname="#{instrumentName}">
                #                 <div class="label" style="margin-top: 2px;">#{instrumentName}</div>
                #             </div>"""
                group = @svg.append "g"
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
                    .style "fill", "transparent"
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
                    .style "display", "none"

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
                    console.log d3.event
                    d3.event.stopPropagation()
                    # drumMachine.removeInstrument(instrument)
                    return false


                group
                    .on "click", () ->
                        group       = d3.select(@)
                        rect        = group.select(".instrument")
                        checkmark   = group.select(".checkmark")
                        if checkmark.style("display") is "none"
                            checkmark.style("display", "block")
                        else
                            checkmark.style("display", "none")

                        if rect.style("fill") is "transparent"
                            rect.style("fill", "lightgray")
                        else
                            rect.style("fill", "transparent")
                        return true
                    .on "mouseenter", () ->
                        d3.select(@).select(".remove").style("display", "block")
                        return true
                    .on "mouseleave", () ->
                        d3.select(@).select(".remove").style("display", "none")
                        return true

                instrument.svg = group


            instrumentIdx++

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

        instrument.svg = group

        console.log "drumkits done"

        # div.find(".instrument").draggable {
        #     cursor: "move"
        #     revert: "invalid"
        #     revertDuration: 200
        # }

        # if firstDraw
        #     @container.append @svg

        return @
