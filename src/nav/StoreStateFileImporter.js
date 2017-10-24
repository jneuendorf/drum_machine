import React from 'react'


class StoreStateFileImporter extends React.Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {stateToImport: ''}
    // }

    render() {
        // const {setStoreState} = this.props
        return [
            <h3 key="stateFileImporterDropzone">Dropzone here...</h3>,
            <a
                key="stateImporterButton"
                className="button is-primary"
                // onClick={() => setStoreState(this.state.stateToImport)}
            >
                <span className="icon">
                    <i className="fa fa-cloud-download" />
                </span>
                <span>Import</span>
            </a>
        ]
    }
}


export {StoreStateFileImporter}
export default StoreStateFileImporter
