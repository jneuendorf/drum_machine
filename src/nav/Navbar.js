import React from 'react'

import Dropdown from './Dropdown'
// import * as store from '../store'
import store from '../store'
import {defaultConnect, createMeasure} from "../utils"


class Navbar extends React.Component {
    render() {
        const {actions: {setStoreState}} = this.props
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
                                    <a className="button is-primary" href="#">
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
            </nav>
        )
    }
}

Navbar = defaultConnect(Navbar)

export {Navbar}
export default Navbar
