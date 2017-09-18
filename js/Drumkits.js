import React from 'react'

import {defaultConnect} from "./utils"


class Drumkits extends React.Component {
    render() {
        const {tab: {drumkits}, actions: {loadDrumkit}} = this.props
        return (
            <ul>
                {Object.entries(drumkits).map(([name, {howl, loadingState}]) => {
                    const buttonProps = {
                        className: 'button is-primary',
                        disabled: false,
                    }
                    let label
                    switch (loadingState) {
                        case 'loading':
                            Object.assign(buttonProps, {
                                className: `${buttonProps.className} is-loading`,
                            })
                            label = 'Loading'
                            break
                        case 'unloaded':
                            label = 'Load'
                            Object.assign(buttonProps, {
                                onClick: () => loadDrumkit(name, howl),
                            })
                            break
                        case 'loaded':
                            label = 'Loaded'
                            Object.assign(buttonProps, {
                                disabled: true,
                            })
                            break
                    }

                    return (
                        <li key={name}>
                            {name}
                            <button {...buttonProps}>
                                {label}
                            </button>
                        </li>
                    )
                })}
            </ul>
        )
    }
}


Drumkits = defaultConnect(Drumkits)

export {Drumkits}
export default Drumkits
