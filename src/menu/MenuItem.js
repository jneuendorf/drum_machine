import React from 'react'


export class MenuItem extends React.Component {
    render() {
        let {
            label,
            // ui,
            children,
            className='',
            title,
            hasLabelAndChildren=false,
            isActive,
        } = this.props
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
                    {hasLabelAndChildren ? label : children || label}
                </a>
                {hasLabelAndChildren ? children : null}
            </li>
        )
    }

    handleOnClick() {
        const {onClick} = this.props
        if (onClick) {
            onClick()
        }
    }
}

export default MenuItem
