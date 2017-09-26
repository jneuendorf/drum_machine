import React from 'react'
import ui from 'redux-ui'


// inherits ui context from Menu because it's rendered by Menu.
@ui()
export class MenuItem extends React.Component {
    render() {
        let {
            label,
            ui,
            children,
            className='',
            title,
        } = this.props
        const isActive = ui.activeItem === label
        if (isActive) {
            className += ' is-active'
        }
        return (
            <li>
                <a
                    className={className}
                    title={title}
                    onClick={() => this.handleOnClick()}
                >
                    {children || label}
                </a>
            </li>
        )
    }

    handleOnClick() {
        const {
            label,
            onClick,
            updateUI,
        } = this.props
        if (typeof(onClick) === 'function') {
            onClick()
        }
        else {
            updateUI('activeItem', label)
        }
    }
}

export default MenuItem
