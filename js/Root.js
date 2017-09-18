import React from "react"

import Navbar from "./nav/Navbar"
import Menu from "./menu/Menu"
// import Drumkits from "./Drumkits"


export class Root extends React.Component {
    render() {
        return (
            <div className="container">
                <Navbar />
                <div className="">
                    <div className="column is-one-quarter">
                        <Menu />
                    </div>
                    <div className="column"></div>
                </div>
                {/* <Drumkits /> */}
            </div>
        )
    }
}

export default Root
