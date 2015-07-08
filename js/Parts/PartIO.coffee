#################
# IMPORT / EXPORT
class DM.PartIO extends DM.Part
    constructor: (drumMachine, container, className, id) ->
        super(drumMachine, container, className, id)
        @text = null

    draw: () ->
        drumMachine = @drumMachine
        @svg = @makeContainer(400, 19)

        radius = 24
        halfRadius = Math.ceil(radius / 2)

        # EXPORT
        offset      = 0
        textLength  = 100
        @svg.append "text"
            .text "Export as:"
            .attr "x", offset
            .attr "y", radius - 8

        group = @svg.append "g"
                    .classed "ioButton export", true
                    .attr "transform", "translate(#{offset + textLength},0)"
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
            .text "TXT"
            .attr "x", halfRadius
            .attr "y", halfRadius + 4
            .style "text-anchor", "middle"
        group
            .on "click", () ->
                # TODO
                console.log "export to text file"
                return true
            .on "mouseenter", () ->
                d3.select(@).select("circle").style("fill", "lightgray")
                return true
            .on "mouseleave", () ->
                d3.select(@).select("circle").style("fill", "transparent")
                return true


        # STOP BUTTON
        group = @svg.append "g"
                    .classed "ioButton stop", true
                    .attr "transform", "translate(#{offset + textLength + 2 * radius + 10},0)"
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
            .text "JSON"
            .attr "x", halfRadius
            .attr "y", halfRadius + 4
            .style "text-anchor", "middle"
        group
            .on "click", () ->
                # TODO
                console.log "export to json"
                return true
            .on "mouseenter", () ->
                d3.select(@).select("circle").style("fill", "lightgray")
                return true
            .on "mouseleave", () ->
                d3.select(@).select("circle").style("fill", "transparent")
                return true



        # IMPORT
        offset      += 4 * radius + textLength + 50
        textLength  = 120

        @svg.append "text"
            .text "Import from:"
            .attr "x", offset
            .attr "y", radius - 8

        group = @svg.append "g"
                    .classed "ioButton export", true
                    .attr "transform", "translate(#{offset + textLength},0)"
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
            .text "TXT"
            .attr "x", halfRadius
            .attr "y", halfRadius + 4
            .style "text-anchor", "middle"
        group
            .on "click", () ->
                # TODO
                console.log "import from text file"
                return true
            .on "mouseenter", () ->
                d3.select(@).select("circle").style("fill", "lightgray")
                return true
            .on "mouseleave", () ->
                d3.select(@).select("circle").style("fill", "transparent")
                return true


        group = @svg.append "g"
                    .classed "ioButton stop", true
                    .attr "transform", "translate(#{offset + textLength + 2 * radius + 10},0)"
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
            .text "JSON"
            .attr "x", halfRadius
            .attr "y", halfRadius + 4
            .style "text-anchor", "middle"
        group
            .on "click", () ->
                # TODO
                console.log "import from json"
                return true
            .on "mouseenter", () ->
                d3.select(@).select("circle").style("fill", "lightgray")
                return true
            .on "mouseleave", () ->
                d3.select(@).select("circle").style("fill", "transparent")
                return true

        return @

    import: () ->
        return

    export: () ->
        return
