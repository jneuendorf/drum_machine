import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'

import Root from "./Root"
import {store} from "./store"


const rootElement = document.getElementById("root")
const renderApp = function(store) {
    console.log('initial state', store.getState())
    // force remove all children so react does not try to just
    // smartly update the Provider as this results in a warning.
    while (rootElement.firstChild) {
        rootElement.removeChild(rootElement.firstChild)
    }
    ReactDOM.render(
        <Provider store={store}>
            <Root />
        </Provider>,
        rootElement
    )
}

renderApp(store)
