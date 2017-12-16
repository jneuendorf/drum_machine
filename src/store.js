import {createStore, applyMiddleware} from 'redux'
import ThunkMiddleware from 'redux-thunk'
import LoggerMiddleware from 'redux-logger'

import rootReducerFactory from './reducers'
import Player from './Player'


const storeEnhancer = applyMiddleware(
    ThunkMiddleware,
    LoggerMiddleware,
)


export const store = createStore(rootReducerFactory(Player), storeEnhancer)


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


subscribe(function(state, action) {
    if (Player.shouldHandleAction(action)) {
        // console.log('subscribe', state, action)
        Player.onStateChange(state, action)
    }
})
