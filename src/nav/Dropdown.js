import React from 'react'

import NavbarItem from './NavbarItem'
import NavbarItemDivider from './NavbarItemDivider'


export class Dropdown extends React.Component {
    static defaultProps = {
        label: "",
        href: "#",
        items: [],
    }

    render() {
        const {href, label, items, children} = this.props
        return (
            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link is-active" href={href}>
                    {label}
                </a>
                <div className="navbar-dropdown is-boxed">
                    {items.map((props, index) => {
                        if (props !== "divider") {
                            return <NavbarItem {...props} key={index} />
                        }
                        return <NavbarItemDivider key={index} />
                    })}
                    {children}
                </div>
            </div>
        )
    }
}

export default Dropdown
