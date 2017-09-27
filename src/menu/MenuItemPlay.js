import React from 'react'
import ui from 'redux-ui'
import Tock from 'tocktimer'

import MenuItem from './MenuItem'
import {unique, getMsBetweenNotes, getNumberOfNotes, defaultConnect} from '../utils'


// inherits ui context from Menu because it's rendered by Menu.
@ui({
    state: {
        error: null,
        // isLoading: false,
    },
})
class MenuItemPlay extends React.Component {
    label = "Play"

    // constructor(props) {
    //     super(props)
    //     this.timer = null
    // }

    // componentWillUnmount() {
    //     this.clearTimer()
    // }

    render() {
        const {
            ui,
            drumkits,
        } = this.props
        const drumkitsAreLoading = Object.entries(drumkits).reduce(
            (acc, [name, drumkit]) => acc || drumkit.loadingState === 'isLoading',
            false
        )
        const className = `${ui.error ? 'has-error' : ''} ${drumkitsAreLoading ? 'is-loading' : ''}`
        return (
            <MenuItem
                label={this.label}
                onClick={() => this.onClick()}
                className={className}
                title={ui.error || null}
            >
                <span>Play</span>
                <span className="icon">
                    <i className="fa fa-play-circle" />
                </span>
            </MenuItem>
        )
    }

    // clearTimer() {
    //     clearTimeout(this.timer)
    //     this.timer = null
    // }

    onClick() {
        const {tab: {measures}, drumkits, updateUI, actions: {loadDrumkit}} = this.props

        // this.clearTimer()
        if (this.drumkitsAreLoaded()) {
            updateUI('activeItem', this.label)
            updateUI('error', null)
            if (measures.length > 0) {
                this.startPlaying()
            }
        }
        else {
            // updateUI('error', 'Not all drumkits are loaded.')
            // this.timer = setTimeout(() => updateUI('error', null), 2500)
            for (const [name, drumkit] of Object.entries(drumkits)) {
                if (drumkit.loadingState === 'unloaded') {
                    loadDrumkit(name, drumkit.howl)
                }

            }
        }
    }

    drumkitsAreLoaded() {
        const {tab: {measures}, drumkits} = this.props

        if (measures.length > 0) {
            const requiredDrumkits = unique(measures.map(measure => measure.drumkit))
            return Object.entries(drumkits).reduce(
                (acc, [name, drumkit]) => {
                    if (requiredDrumkits.includes(name)) {
                        return acc && drumkit.loadingState === 'loaded'
                    }
                    return acc
                },
                true
            )
        }
        return true
    }

    startPlaying() {
        const {tab: {measures}, drumkits} = this.props
        const clocks = []
        measures.forEach((measure, index) => {
            const {numberOfBeats, noteValue, minNoteValue, drumkit: drumkitName, notes} = measure
            const interval = getMsBetweenNotes(measure)
            const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
            const {howl} = drumkits[drumkitName]
            const clock = new Tock({
                interval,
                callback: () => {
                    const tick = Math.round(clock.lap() / interval)
                    if (tick < numberOfNotes) {
                        const instrumentsToPlayWithNotes = Object.entries(notes)
                            .filter(([instrument, notes]) => notes[tick] > 0)

                        for (const [instrumentToPlay, notes] of instrumentsToPlayWithNotes) {
                            const id = howl.play(instrumentToPlay)
                            const volume = notes[tick]
                            console.log(`playing ${instrumentToPlay} at tick ${tick} with volume ${volume}`)
                            howl.volume(volume, id)
                        }
                    }
                    else {
                        clock.reset()
                        clocks[index + 1 % clocks.length].start()
                        console.log(`stopped playing measure #${index}`, clocks[index + 1 % clocks.length] === clock)
                    }
                },
            })

            clocks.push(clock)
        })
        clocks[0].start()
    }
}

MenuItemPlay = defaultConnect(MenuItemPlay)

export {MenuItemPlay}
export default MenuItemPlay
