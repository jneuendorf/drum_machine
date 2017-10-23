import React from 'react'
import ui from 'redux-ui'
import download from 'downloadjs'

import Dropdown from './Dropdown'
import StoreStateManager from '../StoreStateManager'
import store from '../store'
import {defaultConnect, serializeState} from "../utils"


@ui({
    state: {
        displayStoreState: false,
        serializedState: '',
        importStoreState: false,
    }
})
class Navbar extends React.Component {

    render() {
        const {
            ui: {displayStoreState, serializedState, importStoreState},
            updateUI,
            actions: {setStoreState}
        } = this.props
        return (
            <nav className="navbar is-transparent has-border-bottom">
                <div className="navbar-brand">
                    <div className="navbar-item">
                        <h1 className="title is-5">
                            DrumMachine
                            <img src="images/drum_machine.png" />
                        </h1>
                    </div>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-start">
                        <Dropdown label="Export" items={[
                            {
                                label: 'As text',
                                onClick: () => {
                                    updateUI({
                                        displayStoreState: true,
                                        serializedState: serializeState(store.getState()),
                                    })
                                }
                            },
                            {
                                label: 'As text file',
                                onClick: () => {
                                    const defaultFilename = 'drum_machine'
                                    const filename = (
                                        prompt('Enter filename (without extension)', defaultFilename)
                                        || defaultFilename
                                    )
                                    download(
                                        serializeState(store.getState()),
                                        `${filename}.txt`,
                                        'text/plain'
                                    )
                                }
                            },
                            {
                                label: 'As music file'
                            },
                        ]} />
                        <Dropdown label="Import" items={[
                            {
                                label: 'From text',
                                onClick: () => {
                                    updateUI({
                                        importStoreState: true,
                                    })
                                }
                            },
                            {
                                label: 'From text file',
                            },
                        ]} />
                    </div>
                    <div className="navbar-end">
                        <Dropdown label="Docs" items={[
                            {
                                label: 'Overview',
                                href: 'docs.html',
                            },
                            {
                                label: 'API',
                                href: 'docs.html#api',
                            },
                        ]} />
                    </div>
                </div>
                {
                    displayStoreState
                    ? (
                        <StoreStateManager
                            managementKind="export"
                            state={serializedState}
                            close={
                                () => updateUI({
                                    displayStoreState: false,
                                    serializedState: '',
                                })
                            }
                        />
                    )
                    : null
                }
                {
                    importStoreState
                    ? (
                        <StoreStateManager
                            managementKind="import"
                            setStoreState={setStoreState}
                            close={
                                () => updateUI({
                                    importStoreState: false,
                                    serializedState: '',
                                })
                            }
                        />
                    )
                    : null
                }
            </nav>
        )
    }
}

Navbar = defaultConnect(Navbar)

export {Navbar}
export default Navbar
