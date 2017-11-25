import React from 'react'
import Toggle from 'react-toggle'

import {
    defaultConnect
} from '../utils'
import MenuSection from './MenuSection'
import MenuItem from './MenuItem'


const PLAY = 'play'
const PAUSE_LABEL = 'pause'
const STOP_LABEL = 'stop'


class SoundControls extends React.Component {
    state = {
        loop: true,
        freezeUiWhilePlaying: false,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.soundControls.playingState !== this.props.soundControls.playingState
            || nextProps.soundControls.loop !== this.props.soundControls.loop
            || nextProps.soundControls.freezeUiWhilePlaying !== this.props.soundControls.freezeUiWhilePlaying
        )
    }

    render() {
        const {
            soundControls: {playingState, loop, freezeUiWhilePlaying},
            actions: {
                setPlayingState,
                toggleLoopState,
                toggleFreezeUiWhilePlaying,
            }
        } = this.props
        console.log('rendering sound controls menu section.....', loop)
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
                <MenuItem
                    label="loop"
                    onClick={toggleLoopState}
                    isActive={false}
                >
                    <span>Loop</span>
                    <span className="toggle-wrapper">
                        <Toggle
                            checked={loop}
                        />
                    </span>
                </MenuItem>
                <MenuItem
                    label="freezeUiWhilePlaying"
                    onClick={toggleFreezeUiWhilePlaying}
                    isActive={false}
                >
                    <span>Performant play</span>
                    <span className="toggle-wrapper">
                        <Toggle
                            checked={freezeUiWhilePlaying}
                        />
                    </span>
                </MenuItem>
            </MenuSection>
        )
    }
}

SoundControls = defaultConnect(SoundControls)

export {SoundControls}
export default SoundControls
