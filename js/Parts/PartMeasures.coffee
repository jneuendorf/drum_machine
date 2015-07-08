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
        drumMachine = @drumMachine
        @svg        = @makeContainer(260, 70)

        x = 0
        y = 0

        for measure, index in drumMachine.measures
            info = measure.draw(@svg, x, y, index is 0)
            y = info.height + 20

        # # draw "add measure" button
        # addMeasureBtn = $ "<button class='addMeasure'>add meausure</button>"
        # addMeasureBtn.click () ->
        #     drumMachine.addMeasure()
        #     return @
        # div.append addMeasureBtn

        return @
