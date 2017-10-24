import React from 'react'

import {defaultConnect} from '../utils'
import MenuSection from './MenuSection'
import MenuItem from './MenuItem'
import SoundControls from './SoundControls'
import MeasureTemplates from './MeasureTemplates'


class Menu extends React.Component {
    render() {
        const {
            menu: {measureTemplates},
            tab: {
                notes: {inTripletMode},
            },
            actions: {setTripletMode}
        } = this.props
        return (
            <aside className="menu">
                <SoundControls />
                <MenuSection label="Measures">
                    {measureTemplates.length === 0 ? null : <MeasureTemplates />}
                </MenuSection>
                <MenuSection label="Notes">
                    <MenuItem
                        label="Add triplet"
                        isActive={inTripletMode}
                        onClick={() => setTripletMode(!inTripletMode)}
                    >
                        {
                            inTripletMode
                            ? [
                                <span key="0">Cancel</span>,
                                <span key="1" className="icon">
                                    <i className="fa fa-close" />
                                </span>
                            ]
                            : null
                        }

                    </MenuItem>
                </MenuSection>
            </aside>
        )
    }
}

Menu = defaultConnect(Menu)

export {Menu}
export default Menu
