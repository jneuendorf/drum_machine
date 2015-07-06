#######
# NOTES
class DM.PartMeasures extends DM.Part
    # constructor: (drumMachine, container, className, id) ->
    #     super(drumMachine, container, className, id)
    #     drumMachine.registerDelegation @, "addInstruments", (instrumentNames...) ->
    #         for measure in drumMachine.measures
    #             measure.addInstuments instrumentNames
    #         return @

    draw: () ->
        # div            = @container.find(".#{@_id}")
        # firstDraw    = div.length is 0
        drumMachine     = @drumMachine
        @svg            = @makeContainer(260, 70)

        for measure in drumMachine.measures
            measure.draw(@svg)

        # if firstDraw
        #     div = @makeContainer()
        #
        # div.empty()

        # idx = 0
        # for measure in drumMachine.getMeasures()
        #     mDiv = measure.draw().getDiv()
        #
        #     mDiv.find(".column").each () ->
        #         $(@).attr("data-absidx", idx++)
        #
        #     div.append mDiv
        #
        # # draw "add measure" button
        # addMeasureBtn = $ "<button class='addMeasure'>add meausure</button>"
        # addMeasureBtn.click () ->
        #     drumMachine.addMeasure()
        #     return @
        # div.append addMeasureBtn

        return @
