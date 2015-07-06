#############
# INSTRUMENTS
class DM.PartUsedInstruments extends DM.Part

    @new = (subClassName, drumMachine, container, usedInstruments) ->
        str = subClassName[0].toLowerCase() + subClassName.slice(1)
        return new App["Part" + subClassName](drumMachine, container, str, str, usedInstruments)

    constructor: (drumMachine, container, className, id, usedInstruments) ->
        super(drumMachine, container, className, id)
        @usedInstruments = usedInstruments

    draw: () ->
        div            = @container.select(".#{@className}")
        # firstDraw    = div.length is 0
        drumMachine    = @drumMachine


        @svg = @makeContainer(270, 50)


        instrumentIdx = 0
        for instrument, instrumentIdx in @usedInstruments
            console.log instrument
            instrumentName = instrument.name

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

            instrument.svg = group


            instrumentIdx++

        console.log "used instruments done"

        # div.empty()
        # for instrument, idx in @usedInstruments
        #     if instrument?
        #         temp = $ """<div class="instrument">
        #                         <input class="label" value="#{instrument.name}" />
        #                         <!--span class="edit" title="rename instrument" /-->
        #                         <span class="close" data-idx="#{idx}" title="delete instrument">&#10006;</span>
        #                 </div>"""
        #         # temp.find(".edit").click () ->
        #         #     elem = $(@)
        #         #     elem.siblings(".label")
        #         #         .prop "disabled", (i, oldProp) ->
        #         #             return !oldProp
        #         #         .focus()
        #
        #         temp.find(".close").click () ->
        #             drumMachine.removeInstrument parseInt( @getAttribute("data-idx"), 10 )
        #             return false
        #     else
        #         name = "Drop drumkit here to add"
        #         temp = $ """<div class="droppableArea"><div class="instrument add"><div class="label" style="margin-top: 2px;">#{name}</div></div></div>"""
        #         # make it droppable
        #         temp.droppable {
        #             accept: "#drumkits .instrument"
        #             over: (ev, ui) ->
        #                 temp.animate "padding-top": "34px", 200
        #                 return @
        #             out: (ev, ui) ->
        #                 temp.animate "padding-top": "0px", 200
        #                 return @
        #             # add dropped instrument to all measures
        #             drop: (ev, ui) ->
        #                 console.log ui
        #                 instrumentDiv = ui.draggable
        #                 # get instrument info
        #                 kitName = instrumentDiv.attr "data-kitname"
        #                 instrumentName = instrumentDiv.attr "data-instrumentname"
        #                 instrument = drumMachine.getDrumkits()[kitName][instrumentName]
        #
        #                 # instrument is ok => add to measures
        #                 if instrument?
        #                     drumMachine.addInstrument instrument
        #
        #                 # move originally dropped div back to the list => reset its positioning
        #                 instrumentDiv.animate {
        #                     left: 0
        #                     top: 0
        #                 }, 200
        #
        #                 return @
        #         }
        #
        #     div.append temp
        #
        # if firstDraw
        #     @container.append div


        return @
