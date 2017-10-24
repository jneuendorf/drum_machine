import React from 'react'


class StoreStateImporter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {stateToImport: ''}
    }

    render() {
        const {setStoreState} = this.props
        return [
            <textarea
                key="stateImporterTextArea"
                className="textarea"
                placeholder="Insert the copied state here."
                value={this.state.stateToImport}
                onChange={(event) => this.setState({stateToImport: event.target.value})}
            />,
            <a
                key="stateImporterButton"
                className="button is-primary"
                onClick={() => setStoreState(this.state.stateToImport)}
            >
                <span className="icon">
                    <i className="fa fa-cloud-download" />
                </span>
                <span>Import</span>
            </a>
        ]
    }
}


export {StoreStateImporter}
export default StoreStateImporter
