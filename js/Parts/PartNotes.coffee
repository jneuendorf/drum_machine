#######
# NOTES
class App.PartNotes extends App.Part
    # constructor: (druMachine, container, className, id) ->
    #     super druMachine, container, className, id

    draw: () ->
        div            = @_container.find(".#{@_id}")
        # firstDraw    = div.length is 0
        druMachine     = @drumMachine

        # if firstDraw
        #     div = @makeContainer()
        #
        # div.empty()

        idx = 0
        for measure in druMachine.getMeasures()
            mDiv = measure.draw().getDiv()

            mDiv.find(".column").each () ->
                $(@).attr("data-absidx", idx++)

            div.append mDiv

        # draw "add measure" button
        addMeasureBtn = $ "<button class='addMeasure'>add meausure</button>"
        addMeasureBtn.click () ->
            druMachine.addMeasure()
            return @
        div.append addMeasureBtn


        if firstDraw
            @_container.append div

        return @
