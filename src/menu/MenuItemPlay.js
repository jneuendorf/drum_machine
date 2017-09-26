import React from 'react'
import ui from 'redux-ui'

import MenuItem from './MenuItem'
import {unique} from '../utils'


// inherits ui context from Menu because it's rendered by Menu.
@ui({
    state: {
        error: null,
    },
})
export class MenuItemPlay extends React.Component {
    label = "Play"

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

    onClick() {
        const {updateUI} = this.props

        if (this.drumkitsAreLoaded()) {
            updateUI('activeItem', this.label)
            updateUI('error', null)
            // TODO: start playing
        }
        else {
            updateUI('error', 'Not all drumkits are loaded.')
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
}

export default MenuItemPlay
