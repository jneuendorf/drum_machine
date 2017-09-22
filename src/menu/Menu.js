import React from 'react'
import ui from 'redux-ui'

import {defaultConnect} from '../utils'
import MenuSection from './MenuSection'
import MenuItem from './MenuItem'
import DrumkitManagementModal from './DrumkitManagementModal'


@ui({
    state: {
        activeItem: null,
    },
})
class Menu extends React.Component {
    render() {
        // const {menu} = this.props
        console.log('menu props', this.props);
        return (
            <aside className="menu">
                <MenuSection label="General">
                    <MenuItem label="Manage Drumkits" />
                </MenuSection>
                <MenuSection label="Sound Controls">
                    <MenuItem label="Play">
                        <span>Play</span>
                        <span className="icon">
                            <i className="fa fa-play-circle" />
                        </span>
                    </MenuItem>
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
                <DrumkitManagementModal />
            </aside>
        )
    }
}

Menu = defaultConnect(Menu)

export {Menu}
export default Menu
