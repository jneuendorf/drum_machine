import React from 'react'
import ui from 'redux-ui'
import Tock from 'tocktimer'

import MenuItem from './MenuItem'
import {unique, getMsBetweenNotes, getNumberOfNotes} from '../utils'


// inherits ui context from Menu because it's rendered by Menu.
@ui({
    state: {
        error: null,
    },
})
export class MenuItemPlay extends React.Component {
    label = "Play"

    constructor(props) {
        super(props)
        this.timer = null
    }

    componentWillUnmount() {
        this.clearTimer()
    }

    render() {
        const {ui} = this.props
        return (
            <MenuItem
                label={this.label}
                onClick={() => this.onClick()}
                className={ui.error ? 'has-error' : ''}
                title={ui.error || null}
            >
                <span>Play</span>
                <span className="icon">
                    <i className="fa fa-play-circle" />
                </span>
            </MenuItem>
        )
    }

    clearTimer() {
        clearTimeout(this.timer)
        this.timer = null
    }

    onClick() {
        const {measures, updateUI} = this.props

        this.clearTimer()
        if (this.drumkitsAreLoaded()) {
            updateUI('activeItem', this.label)
            updateUI('error', null)
            if (measures.length > 0) {
                this.startPlaying()
            }
        }
        else {
            updateUI('error', 'Not all drumkits are loaded.')
            this.timer = setTimeout(() => updateUI('error', null), 2500)
        }
    }

    drumkitsAreLoaded() {
        const {measures, drumkits} = this.props

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
        const {measures, drumkits} = this.props
        const clocks = []
        measures.forEach((measure, index) => {
            const {numberOfBeats, noteValue, minNoteValue, drumkit: drumkitName, notes} = measure
            const interval = getMsBetweenNotes(measure)
            const numberOfNotes = getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
            const drumkit = drumkits[drumkitName]
            const clock = new Tock({
                interval,
                callback: () => {
                    const tick = Math.round(clock.lap() / interval)
                    if (tick < numberOfNotes) {
                        const instrumentsToPlay = Object.entries(notes)
                            .filter(([instrument, notes]) => notes[tick] > 0)
                            .map(([instrument, notes]) => instrument)
                        for (const instrumentToPlay of instrumentsToPlay) {
                            drumkit.howl.play(instrumentToPlay)
                        }
                    }
                    else {
                        clocks[index + 1 % clocks.length].start()
                        clock.reset()
                    }
                },
            })

            clocks.push(clock)
        })
        clocks[0].start()
    }
}

export default MenuItemPlay
