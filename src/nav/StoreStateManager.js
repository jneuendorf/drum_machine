import React from 'react'
// import ui from 'redux-ui'

import StoreStateExporter from "./StoreStateExporter"
import StoreStateImporter from "./StoreStateImporter"
import StoreStateFileImporter from "./StoreStateFileImporter"


class StoreStateManager extends React.Component {
    render() {
        const {close, managerKind, ...props} = this.props

        let component
        switch (managerKind) {
            case 'textExporter':
                component = <StoreStateExporter {...props} />
                break
            case 'textImporter':
                component = <StoreStateImporter {...props} />
                break
            case 'fileImporter':
                component = <StoreStateFileImporter {...props} />
                break
            default:
                throw new Error('Invalid managerKind given')
        }
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
