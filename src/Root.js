import React from "react"

import Navbar from "./nav/Navbar"
import Menu from "./menu/Menu"
import Measures from "./measures/Measures"


export class Root extends React.Component {
    render() {
        return (
            <div className="container">
                <Navbar />
                <div className="columns main">
                    <div className="column is-one-quarter">
                        <Menu />
                    </div>
                    <div className="column has-border-left measures-container">
                        <h5 className="is-size-5 is-uppercase has-text-weight-light">Measures</h5>
                        <Measures />
                    </div>
                </div>
            </div>
        )
    }
}

export default Root
