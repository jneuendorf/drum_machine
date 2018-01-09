import React from 'react'

import Navbar from './nav/Navbar'
import Menu from './menu/Menu'
import Measures from './measures/Measures'


export class Root extends React.PureComponent {
    state = {
        menuHeight: undefined
    }

    render() {
        return (
            <div className="container">
                <Navbar />
                <div className="columns main">
                    <div className="column is-2">
                        <Menu
                            onChangeSize={this.measureMenuHeight}
                        />
                    </div>
                    <div
                        className="column has-border-left measures-container"
                        style={{height: this.state.menuHeight}}
                    >
                        <h5 className="is-size-5 is-uppercase has-text-weight-light">Measures</h5>
                        <Measures />
                    </div>
                </div>
            </div>
        )
    }

    measureMenuHeight = ({height}) => {
        // We want the outer height so we need to add
        // padding and margin.
        this.setState({menuHeight: height + 24 + 16})
    }
}

export default Root
