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
                notes: {inTupletMode},
            },
            actions: {setTupletMode}
        } = this.props
        return (
            <aside className="menu">
                <SoundControls />
                <MenuSection label="Measures">
                    {measureTemplates.length === 0 ? null : <MeasureTemplates />}
                </MenuSection>
                <MenuSection label="Notes">
                    <MenuItem
                        label="Add Tuplet"
                        isActive={inTupletMode}
                        onClick={() => setTupletMode(!inTupletMode)}
                    >
                        {
                            inTupletMode
                            ? [
                                <span key="cancelLabel1">Cancel</span>,
                                <small key="cancelLabel2"> (Add Tuplet)</small>,
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
