import React from 'react'


export class NavbarItem extends React.Component {
    static defaultProps = {
        label: "",
        href: "#",
    }

    render() {
        const {href, label, ...props} = this.props
        return (
            <a {...props} className="navbar-item" href={href}>
                {label}
            </a>
        )
    }
}

export default NavbarItem
