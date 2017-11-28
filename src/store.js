import {createStore, applyMiddleware} from 'redux'
import ThunkMiddleware from 'redux-thunk'
import LoggerMiddleware from 'redux-logger'

import rootReducer from './reducers'


const storeEnhancer = applyMiddleware(
    ThunkMiddleware,
    LoggerMiddleware,
)

const store = createStore(rootReducer, storeEnhancer)


// TODO: make this a middleware?!
let lastDispatchedAction = undefined
export const dispatch = function(action) {
    lastDispatchedAction = action
    // console.log("my logger!!!", action);
    return store.dispatch(action)
}


export const subscribe = function(listener) {
    return store.subscribe(function() {
        listener(store.getState(), lastDispatchedAction)
    })
}


// let disposers = []
// const setStateListeners = []
//
// export const setState = function(state) {
//     for (const disposer of disposers) {
//         disposer()
//     }
//     disposers = []
//     store = createStore(rootReducer, state, storeEnhancer)
//     // store.replaceReducer(rootReducer)
//     for (const listener of setStateListeners) {
//         listener(store)
//     }
// }
//
// export const onSetState = function(listener) {
//     setStateListeners.push(listener)
// }
//
// export const getStore = function() {
//     return store
// }
//
// export const getState = function() {
//     return store.getState()
// }
//
// export const subscribe = function(listener) {
//     const dispose = store.subscribe(listener)
//     disposers.push(dispose)
//     return dispose
// }
//
// export const dispatch = function(action) {
//     return store.dispatch(action)
// }

export default store
