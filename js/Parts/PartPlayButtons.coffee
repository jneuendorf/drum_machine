##############################
# PLAY BUTTONS & EXPORT BUTTON
class App.PartPlayButtons extends App.Part
    # constructor: (drumMachine, container, className, id) ->
    #     super(drumMachine, container, className, id)

    # override
    # makeContainer: () ->
    #     return $ "<div id='#{@_id}' class='#{@_className}' />"

    draw: () ->
        self        = @
        drumMachine = @drumMachine


        @svg = @makeContainer(260, 19)

        radius = 24
        halfRadius = Math.ceil(radius / 2)

        # PLAY/PAUSE BUTTON
        group = @svg.append "g"
                    .classed "playbutton play", true
                    .attr "transform", "translate(0,0)"
                    .style "cursor", "pointer"

        group.append "circle"
            .classed "circle", true
            .attr "r", radius
            .attr "cx", halfRadius
            .attr "cy", halfRadius
            .style "fill", "transparent"
            .style "stroke", "black"
            .style "stroke-width", 2
        group.append "text"
            .text "play"
            .attr "x", halfRadius
            .attr "y", halfRadius + 4
            .style "text-anchor", "middle"
        group
            .on "click", () ->
                textElem = d3.select(@).select("text")
                # resume playing
                if not drumMachine.isPlaying()
                    textElem.text "pause"
                    drumMachine.startPlaying()
                # pause
                else
                    textElem.text "play"
                    drumMachine.pause()
                return true
            .on "mouseenter", () ->
                d3.select(@).select("circle").style("fill", "lightgray")
                return true
            .on "mouseleave", () ->
                d3.select(@).select("circle").style("fill", "transparent")
                return true


        # STOP BUTTON
        group = @svg.append "g"
                    .classed "playbutton stop", true
                    .attr "transform", "translate(#{2 * radius + 10},0)"
                    .style "cursor", "pointer"

        group.append "circle"
            .classed "circle", true
            .attr "r", radius
            .attr "cx", halfRadius
            .attr "cy", halfRadius
            .style "fill", "transparent"
            .style "stroke", "black"
            .style "stroke-width", 2
        group.append "text"
            .text "stop"
            .attr "x", halfRadius
            .attr "y", halfRadius + 4
            .style "text-anchor", "middle"
        group
            .on "click", () ->
                textElem = d3.select("##{@id}").select("text")
                textElem.text "play"
                drumMachine.stop()
                return true
            .on "mouseenter", () ->
                d3.select(@).select("circle").style("fill", "lightgray")
                return true
            .on "mouseleave", () ->
                d3.select(@).select("circle").style("fill", "transparent")
                return true


        return @
