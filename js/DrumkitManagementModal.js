import React from 'react'

import {defaultConnect, chunkArray} from "./utils"


class DrumkitManagementModal extends React.Component {
    render() {
        const {
            // direct
            isActive,
            // from store indirectly
            deselectMenuItem,
            // from store directly
            tab: {drumkits},
            actions: {loadDrumkit, },
        } = this.props
        const buttonPropsByLoadingState = {
            unloaded: {
                className: 'button is-primary',
                disabled: false,
                // Callback is set below.
                // onClick: () => loadDrumkit(name, howl),
            },
            loading: {
                className: 'button is-primary is-loading',
                disabled: false,
            },
            loaded: {
                className: 'button is-primary',
                disabled: true,
            },
        }
        const buttonContentByLoadingState = {
            unloaded: 'Fetch',
            loading: 'Loading',
            loaded: (
                <span>
                    <span className="icon is-small">
                        <i className="fa fa-check" />
                    </span>
                    <span>Loaded</span>
                </span>
            ),
        }

        const close = (event) => {
            event.stopPropagation()
            deselectMenuItem()
        }
        return (
            <div className={`modal ${isActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={close} />
                <div className="modal-content">
                    <div className="box" style={{cursor: 'default'}}>
                        <table className="table is-striped is-fullwidth is-narrow">
                            <tbody>
                                {Object.entries(drumkits).map(([name, drumkit]) => {
                                    const {howl, loadingState, instruments} = drumkit
                                    const buttonProps = buttonPropsByLoadingState[loadingState]
                                    const label = buttonContentByLoadingState[loadingState]
                                    if (loadingState === 'unloaded') {
                                        buttonProps.onClick = () => loadDrumkit(name, howl)
                                    }
                                    const formattedInstruments = chunkArray(instruments, 5).map((chunk, index) =>
                                        <p key={index}>{chunk.join(', ')}</p>
                                    )
                                    console.log(formattedInstruments);
                                    return (
                                        <tr key={name}>
                                            <td>
                                                <strong>
                                                    {name}
                                                </strong>
                                            </td>
                                            <td>
                                                {formattedInstruments}
                                            </td>
                                            <td>
                                                <button {...buttonProps}>
                                                    {label}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <button className="modal-close is-large" onClick={close} />
            </div>
        )
    }
}

DrumkitManagementModal = defaultConnect(DrumkitManagementModal)

export {DrumkitManagementModal}
export default DrumkitManagementModal
