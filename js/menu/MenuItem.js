import React from 'react'


export class MenuItem extends React.Component {
    render() {
        const {
            isActive,
            label,
            children,
            selectMenuItem
        } = this.props
        return (
            <li>
                <a className={isActive ? 'is-active' : ''} onClick={selectMenuItem}>
                    {label}
                    {children}
                </a>
            </li>
        )
    }
}

export default MenuItem
