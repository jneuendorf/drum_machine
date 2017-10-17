import React from 'react'

import {
    defaultConnect
} from '../utils'
import MenuSection from './MenuSection'
import MenuItem from './MenuItem'


const PLAY = 'play'
const PAUSE_LABEL = 'pause'
const STOP_LABEL = 'stop'


class SoundControls extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.soundControls.playingState !== this.props.soundControls.playingState
    }

    render() {
        console.log('rendering sound controls menu section.....')
        const {
            soundControls: {playingState},
            actions: {setPlayingState}
        } = this.props
        return (
            <MenuSection label="Sound Controls">
                <MenuItem
                    label={PLAY}
                    onClick={() => setPlayingState(PLAY)}
                    isActive={playingState === PLAY}
                >
                    <span>Play</span>
                    <span className="icon">
                        <i className="fa fa-play-circle" />
                    </span>
                </MenuItem>
                <MenuItem
                    label={PAUSE_LABEL}
                    onClick={() => setPlayingState(PAUSE_LABEL)}
                    isActive={playingState === PAUSE_LABEL}
                >
                    <span>Pause</span>
                    <span className="icon">
                        <i className="fa fa-pause-circle" />
                    </span>
                </MenuItem>
                <MenuItem
                    label={STOP_LABEL}
                    onClick={() => setPlayingState(STOP_LABEL)}
                    isActive={playingState === STOP_LABEL}
                >
                    <span>Stop</span>
                    <span className="icon">
                        <i className="fa fa-stop-circle" />
                    </span>
                </MenuItem>
            </MenuSection>
        )
    }
}

SoundControls = defaultConnect(SoundControls)

export {SoundControls}
export default SoundControls
