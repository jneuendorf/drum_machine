import React from 'react'

import {defaultConnect} from '../utils'
import MenuItem from './MenuItem'
import DrumkitManagementModal from '../DrumkitManagementModal'


class Menu extends React.Component {
    render() {
        const {menu} = this.props
        return (
            <aside className="menu">
                {menu.map(({label, children: list}) => (
                    <span key={label}>
                        <p className="menu-label">
                            {label}
                        </p>
                        {this.renderList(list)}
                    </span>
                ))}
            </aside>
        )
    }

    renderList(list) {
        const {actions: {selectMenuItem}} = this.props
        return (
            <ul className="menu-list">
                {list.map(item => {
                    const {label} = item
                    const props = {
                        ...item,
                        selectMenuItem: function() {
                            selectMenuItem(label)
                        },
                        deselectMenuItem: function() {
                            selectMenuItem(null)
                        },
                    }
                    const children = (item.childComponents || []).map(componentName =>
                        this[`get${componentName}`](props, componentName)
                    )
                    return (
                        <MenuItem {...props} key={label}>
                            {children}
                        </MenuItem>
                    )
                })}
            </ul>
        )
    }

    // component getters
    getDrumkitManagementModal(props, componentName) {
        return <DrumkitManagementModal {...props} key={componentName} />
    }

    getPlayButton(props, componentName) {
        return (
            <span key={componentName}>
                <span>Play</span>
                <span className="icon">
                    <i className="fa fa-play-circle" />
                </span>
            </span>
        )
    }

    getPauseButton(props, componentName) {
        return (
            <span key={componentName}>
                <span>Pause</span>
                <span className="icon">
                    <i className="fa fa-pause-circle" />
                </span>
            </span>
        )
    }

    getStopButton(props, componentName) {
        return (
            <span key={componentName}>
                <span>Stop</span>
                <span className="icon">
                    <i className="fa fa-stop-circle" />
                </span>
            </span>
        )
    }
}

Menu = defaultConnect(Menu)

export {Menu}
export default Menu
