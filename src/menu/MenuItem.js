import React from 'react'
import ui from 'redux-ui'


// inherits ui context from Menu because it's rendered by Menu.
@ui()
export class MenuItem extends React.Component {
    render() {
        const {
            label,
            ui,
            updateUI,
            children,
        } = this.props
        const isActive = ui.activeItem === label
        return (
            <li>
                <a
                    className={isActive ? 'is-active' : ''}
                    onClick={() => updateUI('activeItem', label)}
                >
                    {children || label}
                </a>
            </li>
        )
    }
}

export default MenuItem
