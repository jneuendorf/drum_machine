import React from 'react'


export class MenuSection extends React.Component {
    render() {
        const {label, children} = this.props
        if (!children) {
            return null
        }
        return (
            <span>
                <p className="menu-label">
                    {label}
                </p>
                <ul className="menu-list">
                    {children}
                </ul>
            </span>
        )
    }
}
export default MenuSection
