import React from 'react'
import ui from 'redux-ui'
import download from 'downloadjs'

import Dropdown from './Dropdown'
import StoreStateManager from './StoreStateManager'
import store from '../store'
import {defaultConnect, serializeState} from "../utils"


@ui({
    state: {
        managerToShow: null,
        serializedState: '',
    }
})
class Navbar extends React.Component {

    render() {
        const {
            ui: {
                managerToShow,
                serializedState,
            },
            updateUI,
            actions: {setStoreState}
        } = this.props
        const manager = managerToShow ? (
            <StoreStateManager
                managerKind={managerToShow}
                state={serializedState}
                setStoreState={setStoreState}
                close={
                    () => updateUI({
                        managerToShow: null,
                        serializedState: '',
                    })
                }
            />
        ) : null

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
                                        managerToShow: 'textExporter',
                                        // showStoreStateExporter: true,
                                        serializedState: serializeState(store.getState()),
                                    })
                                }
                            },
                            {
                                label: 'As text file',
                                onClick: () => {
                                    const filename = prompt(
                                        'Enter filename (without extension)',
                                        'drum_machine'
                                    )
                                    if (filename) {
                                        download(
                                            serializeState(store.getState()),
                                            `${filename}.txt`,
                                            'text/plain'
                                        )
                                    }
                                }
                            },
                            {
                                label: 'As music file'
                            },
                        ]} />
                        <Dropdown label="Import" items={[
                            {
                                label: 'From text',
                                onClick: () => updateUI({managerToShow: 'textImporter'})
                            },
                            {
                                label: 'From text file',
                                onClick: () => updateUI({managerToShow: 'fileImporter'})
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
                {manager}
            </nav>
        )
    }
}

Navbar = defaultConnect(Navbar)

export {Navbar}
export default Navbar
