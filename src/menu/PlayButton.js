import React from 'react'
import ui from 'redux-ui'

import {defaultConnect} from '../utils'

@ui({
    state: {
        isPlaying: false
    },
})
class PlayButton extends React.Component {
    render() {
        const {isActive} = this.props
        console.log(this.props);
        if (isActive) {
            this.play()
        }
        return (
            <span>
                <span>Play</span>
                <span className="icon">
                    <i className="fa fa-play-circle" />
                </span>
            </span>
        )
    }

    play() {
        const {drumkits} = this.props
        if (this.drumkitsAreLoaded(drumkits)) {

        }
        else {
            this.props.deselectMenuItem()
        }
        console.log(drumkits)
    }

    drumkitsAreLoaded(drumkits) {
        for (const [name, kit] of Object.entries(drumkits)) {
            if (kit.loadingState != 'loaded') {
                console.warn(`Drumkit ${name} is not loaded`)
                return false
            }
        }
        return true
    }
}

PlayButton = defaultConnect(PlayButton)

export {PlayButton}
export default PlayButton
