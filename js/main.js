import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'

import Root from "./Root"
import store from "./store"


import {addMeasure} from "./Actions"
store.dispatch(addMeasure({a:1}))

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById("root")
)
