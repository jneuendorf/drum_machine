import React from 'react'
import ui from 'redux-ui'

import {defaultConnect} from '../utils'
import MenuSection from './MenuSection'
import MenuItem from './MenuItem'
import SoundControls from './SoundControls'
import MeasureTemplates from './MeasureTemplates'


@ui({
    state: {
        activeItem: null,
    },
})
class Menu extends React.Component {
    render() {
        const {menu: {measureTemplates}} = this.props
        return (
            <aside className="menu">
                <SoundControls />
                <MenuSection label="Measures">
                    {measureTemplates.length === 0 ? null : <MeasureTemplates />}
                </MenuSection>
                <MenuSection label="Notes">
                    <MenuItem label="Add triplet" />
                </MenuSection>
            </aside>
        )
    }
}

Menu = defaultConnect(Menu)

export {Menu}
export default Menu
