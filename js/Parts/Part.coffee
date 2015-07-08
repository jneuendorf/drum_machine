class DM.Part

    @new = (subClassName, drumMachine, container, params...) ->
        str = subClassName[0].toLowerCase() + subClassName.slice(1)
        return new DM["Part" + subClassName](drumMachine, container, str, str, params...)

    constructor: (drumMachine, container, className, id) ->
        @drumMachine    = drumMachine
        @container      = container
        @className      = className
        @id             = id
        @svg            = null

    makeContainer: (x, y) ->
        if @svg?
            @svg.remove()
        return @svg = @container.append("g")
            .attr "id", @id
            .attr "class", @className
            .attr "transform", "translate(#{x},#{y})"

    draw: () ->
        throw new Error("Override this method to implement it!")
