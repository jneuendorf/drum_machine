isNumber = (n) ->
    if n instanceof Number
        n = n.valueOf()

    return typeof n is "number" and not isNaN(n) and isFinite(n)


class DM.Instrument
    count = 0
    @getID: () ->
        return "instrument#{count++}"

    # CONSTRUCTOR
    constructor: (name, pathToSound, volume = 0.5) ->
        @name = name

        # create sound from path
        # @sound = soundManager.createSound
        #     id:          @generateID()
        #     url:         pathToSound
        #     autoLoad:    true
        #     volume:      (if isNumber(volume) then volume * 100 else 50)

        @sound = new Howl({
            src:       [pathToSound]
            preload:    true
            volume:     volume
        })

    # METHODS

    generateID: () ->
        return DM.Instrument.getID()

    serialize: () ->
        return {
            name: @name
            # kitName: @_kitName
            volume: @sound.volume
        }
