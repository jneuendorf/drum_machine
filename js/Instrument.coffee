isNumber = (n) ->
    if n instanceof Number
        n = n.valueOf()

    return typeof n is "number" and not isNaN(n) and isFinite(n)


class App.Instrument
    count = 0
    @getID: () ->
        return "instrument#{count++}"

    # CONSTRUCTOR
    constructor: (name, pathToSound, volume = 50) ->
        @name = name.toString()
        # @_kitName = kitName.toString()

        # create sound from path
        sound = soundManager.createSound
            id:          @generateID()
            url:         pathToSound
            autoLoad:    true
            volume:      (if isNumber(volume) then volume else 50)

        @_sound = sound

    # METHODS

    generateID: () ->
        return App.Instrument.getID()

    # GETTERS & SETTERS

    setName: (name) ->
        @name = name
        return @

    getName: () ->
        return @name

    setSound: (sound) ->
        if sound is null or (sound isnt null and sound.bytesLoaded?)
            @_sound = sound
        return @

    getSound: () ->
        return @_sound

    serialize: () ->
        return {
            name: @name
            # kitName: @_kitName
            volume: @_sound.volume
        }
