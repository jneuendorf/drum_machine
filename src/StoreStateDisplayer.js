import React from 'react'

import {defaultConnect} from "./utils"


class StoreStateDisplayer extends React.Component {
    // Selects the text representing the state.
    componentDidMount() {
        const selection = getSelection()
        selection.removeAllRanges()
        const range = document.createRange()
        range.selectNode(this.stateText)
        selection.addRange(range)
    }

    render() {
        const {state, close} = this.props
        return (
            <div
                className="store-state-displayer"
            >
                <a className="button close" onClick={close}>
                    <span className="icon">
                        <i className="fa fa-close" />
                    </span>
                </a>
                <div className="state" ref={(element) => this.stateText = element}>
                    {state}
                </div>
            </div>
        )
    }
}


StoreStateDisplayer = defaultConnect(StoreStateDisplayer)

export {StoreStateDisplayer}
export default StoreStateDisplayer
