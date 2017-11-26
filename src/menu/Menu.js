import React from 'react'

import MenuSection from './MenuSection'
import MenuItem from './MenuItem'
import SoundControls from './SoundControls'
import MeasureTemplates from './MeasureTemplates'
import {fetchDemo, defaultConnect} from '../utils'
import {ActionTypes} from '../Actions'


const {ADD_TUPLET, REMOVE_TUPLET, CONTINUE_NOTE_PATTERN} = ActionTypes


class Menu extends React.Component {
    render() {
        const {
            menu: {
                measureTemplates,
                currentInteraction,
            },
            actions: {
                setStoreState,
                setCurrentMenuInteraction,
            }
        } = this.props

        const toggleCurrentMenuInteraction = type => () =>
            setCurrentMenuInteraction(
                currentInteraction === type ? null : type
            )
        return (
            <aside className="menu">
                <SoundControls />
                <MenuSection label="Measures">
                    {measureTemplates.length === 0 ? null : <MeasureTemplates />}
                </MenuSection>
                <MenuSection label="Notes">
                    <MenuItem
                        label="Add Tuplet"
                        isActive={currentInteraction === ADD_TUPLET}
                        onClick={toggleCurrentMenuInteraction(ADD_TUPLET)}
                    >
                        {
                            currentInteraction === ADD_TUPLET
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
                        isActive={currentInteraction === REMOVE_TUPLET}
                        onClick={toggleCurrentMenuInteraction(REMOVE_TUPLET)}
                    >
                        {
                            currentInteraction === REMOVE_TUPLET
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
                    <MenuItem
                        label="Continue pattern"
                        isActive={currentInteraction === CONTINUE_NOTE_PATTERN}
                        onClick={toggleCurrentMenuInteraction(CONTINUE_NOTE_PATTERN)}
                    >
                        {
                            currentInteraction === CONTINUE_NOTE_PATTERN
                            ? [
                                <span key="cancelLabel1">Cancel</span>,
                                <small key="cancelLabel2"> (Continue Pattern)</small>,
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
                            fetchDemo('demo1')
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
