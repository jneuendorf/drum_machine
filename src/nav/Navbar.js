import React from 'react'
import ui from 'redux-ui'

import Dropdown from './Dropdown'
import StoreStateDisplayer from '../StoreStateDisplayer'
import store from '../store'
import {defaultConnect, serializeState} from "../utils"


@ui({
    state: {
        displayStoreState: false,
        serializedState: '',
    }
})
class Navbar extends React.Component {

    render() {
        const {
            ui: {displayStoreState, serializedState},
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
                        <Dropdown label="Docs" items={[
                            {
                                label: "Overview",
                                href: "docs.html",
                            },
                            {
                                label: "API",
                                href: "docs.html#api",
                            }
                        ]} />
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <a
                                        className="button"
                                        onClick={() =>
                                            // store.setState({
                                            setStoreState({
                                                tab: {measures: [
                                                    {
                                                        id:0,
                                                        numberOfBeats:4,
                                                        noteValue:4,
                                                        minNoteValue:8,
                                                        drumkit:"default",
                                                        notes:{
                                                            snare:[1,0,1,0,0,0,0,0],
                                                            "hi-hat":[0,0,0,0,0,0,0,0],
                                                            kick:[0,0,0,0,0,0,0,0],
                                                            crash1:[0,0,0,0,0,0,0,0],
                                                            crash2:[0,0,0,0,0,0,0,0],
                                                            ride:[0,0,0,0,0,0,0,0],
                                                            tom1:[0,0,0,0,0,0,0,0],
                                                            tom2:[0,0,0,0,0,0,0,0],
                                                            tom3:[0,0,0,0,0,0,0,0]
                                                        },
                                                        bpm:100
                                                    }
                                                ]}
                                            })
                                        }
                                    >
                                        <span className="icon">
                                            <i className="fa fa-cloud-download" />
                                        </span>
                                        <span>Import</span>
                                    </a>
                                </p>
                                <p className="control">
                                    <a
                                        className="button is-primary"
                                        onClick={() => {
                                            updateUI({
                                                displayStoreState: true,
                                                serializedState: serializeState(store.getState())
                                            })
                                        }}
                                    >
                                        <span className="icon">
                                            <i className="fa fa-cloud-upload" />
                                        </span>
                                        <span>Export</span>
                                    </a>
                                </p>
                                <p className="control">
                                    <a className="button is-primary" href="#">
                                        <span className="icon">
                                            <i className="fa fa-file-audio-o" />
                                        </span>
                                        <span>Export as file</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    displayStoreState
                    ? (
                        <StoreStateDisplayer
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
            </nav>
        )
    }
}

Navbar = defaultConnect(Navbar)

export {Navbar}
export default Navbar
