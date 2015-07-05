class App.Part

    @new = (subClassName, drumMachine, container, params...) ->
        str = subClassName[0].toLowerCase() + subClassName.slice(1)
        return new App["Part" + subClassName](drumMachine, container, str, str, params...)

    constructor: (drumMachine, container, className, id) ->
        @drumMachine    = drumMachine
        @container      = container
        @className      = className
        @id             = id
        @svg            = null

    makeContainer: (x, y, width, height) ->
        # return $ "<div id='#{@id}' class='#{@className}' />"
        if @svg?
            @container.select(".#{@className}").remove()
        return @container.append("g")
            .attr("id", @id)
            .attr("class", @className)
            .attr "transform", "translate(#{x},#{y})"

    draw: () ->
        throw new Error("Override this method to implement it!")
