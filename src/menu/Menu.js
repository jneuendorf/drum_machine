import React from 'react'
import ui from 'redux-ui'

import {defaultConnect} from '../utils'
import MenuSection from './MenuSection'
import MenuItem from './MenuItem'
import MenuItemPlay from './MenuItemPlay'
import DrumkitManagementModal from './DrumkitManagementModal'


@ui({
    state: {
        activeItem: null,
    },
})
class Menu extends React.Component {
    render() {
        const {tab: {measures}, drumkits} = this.props
        // console.log('menu props', this.props);
        return (
            <aside className="menu">
                <MenuSection label="Sound Controls">
                    <MenuItemPlay measures={measures} drumkits={drumkits} />
                    <MenuItem label="Pause">
                        <span>Pause</span>
                        <span className="icon">
                            <i className="fa fa-pause-circle" />
                        </span>
                    </MenuItem>
                    <MenuItem label="Stop">
                        <span>Stop</span>
                        <span className="icon">
                            <i className="fa fa-stop-circle" />
                        </span>
                    </MenuItem>
                </MenuSection>
                <MenuSection label="Notes">
                    <MenuItem label="Add triplet" />
                </MenuSection>
                <MenuSection label="Drumkits">
                    <MenuItem label="Manage Drumkits" />
                </MenuSection>
                <DrumkitManagementModal />
            </aside>
        )
    }
}

Menu = defaultConnect(Menu)

export {Menu}
export default Menu
