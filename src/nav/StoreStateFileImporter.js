import React from 'react'

import {readTextFromFile} from '../utils'


class StoreStateFileImporter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileContent: ""
        }
    }

    render() {
        const {setStoreState} = this.props
        return [
            <div key="stateFileImporterInput" className="file">
                <label className="file-label">
                    <input
                        className="file-input"
                        type="file"
                        onChange={(event) => readTextFromFile(
                            event.target.files[0],
                            (text, filename) => this.setState({
                                fileContent: text,
                                filename,
                            })
                        )}
                    />
                    <span className="file-cta">
                        <span className="file-icon">
                            <i className="fa fa-upload" />
                        </span>
                        {
                            this.state.filename
                            ? (
                                <span className="file-label">
                                    {this.state.filename}
                                </span>
                            )
                            : (
                                <span className="file-label">
                                    Choose a file&hellip;
                                </span>
                            )
                        }
                    </span>
                </label>
            </div>,
            <a
                key="stateImporterButton"
                className="button is-primary"
                onClick={() => setStoreState(this.state.fileContent)}
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
