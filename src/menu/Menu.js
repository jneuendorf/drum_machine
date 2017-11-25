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
                notes: {
                    inTupletMode,
                    inRemoveTupletMode,
                },
            },
            actions: {
                setTupletMode,
                setRemoveTupletMode,
                setStoreState
            }
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
                        onClick={() => {
                            if (!inRemoveTupletMode) {
                                setTupletMode(!inTupletMode)
                            }
                        }}
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
                    <MenuItem
                        label="Remove Tuplet"
                        isActive={inRemoveTupletMode}
                        onClick={() => {
                            if (!inTupletMode) {
                                setRemoveTupletMode(!inRemoveTupletMode)
                            }
                        }}
                    >
                        {
                            inRemoveTupletMode
                            ? [
                                <span key="cancelLabel1">Cancel</span>,
                                <small key="cancelLabel2"> (Remove Tuplet)</small>,
                                <span key="1" className="icon">
                                    <i className="fa fa-close" />
                                </span>
                            ]
                            : null
                        }

                    </MenuItem>
                </MenuSection>
                <MenuSection label="Demos">
                    <MenuItem
                        label="Demo 1"
                        isActive={false}
                        onClick={() =>
                            fetch('demos/demo1.txt', {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            })
                            .then(response => response.text())
                            .then(serializedState => setStoreState(serializedState))
                        }
                    />
                </MenuSection>
            </aside>
        )
    }
}

Menu = defaultConnect(Menu)

export {Menu}
export default Menu
