import React from 'react'
// import ui from 'redux-ui'

import StoreStateExporter from "./StoreStateExporter"
import StoreStateImporter from "./StoreStateImporter"


class StoreStateManager extends React.Component {
    render() {
        const {close, managementKind, ...props} = this.props
        const component = (
            managementKind === 'export'
            ? <StoreStateExporter {...props} />
            : <StoreStateImporter {...props} />
        )
        return (
            <div className="store-state-manager">
                <a className="button close" onClick={close}>
                    <span className="icon">
                        <i className="fa fa-close" />
                    </span>
                </a>
                <div className="component-container">
                    {component}
                </div>
            </div>
        )
    }
}


export {StoreStateManager}
export default StoreStateManager
