##########
# DRUMKITS
class DM.SpriteLoader

    @SPRITES = [
        {
            path:   "kit_sprites/"
            json:   "rock-drumkit.howler2.json"
            name:   "rock-drumkit"
        }
    ]
    SPRITES = @SPRITES

    constructor: () ->
        @drumkits   = {}
        @sprites    = []

    load: (callback) ->
        self        = @
        drumkits    = @drumkits
        sprites     = @sprites
        done        = 0
        numSprites  = SPRITES.length

        for sprite, idx in SPRITES
            do (sprite) ->
                return $.getJSON sprite.path + sprite.json, (soundSpriteConfig) ->
                    soundSpriteConfig = self.modConfig(sprite, soundSpriteConfig)
                    
                    sprites.push soundSpriteConfig.sprite
                    drumkits[sprite.name] = new Howl(soundSpriteConfig)

                    if ++done is numSprites
                        callback?()
                    return true


    modConfig: (sprite, config) ->
        config.volume   = 0.7
        config.preload  = true

        for src, idx in config.src
            config.src[idx] = sprite.path + src

        return config
