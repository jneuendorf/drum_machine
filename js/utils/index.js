import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Howl} from 'howler'
import {fromJS} from 'immutable'

import * as Actions from '../Actions'


const mapStateToProps = function(state, ownProps) {
    return state
}
const mapDispatchToProps = function(dispatch, ownProps) {
    return {actions: bindActionCreators(Actions, dispatch)}
}
export const defaultConnect = function(component, storeKey) {
    if (!storeKey) {
        return connect(mapStateToProps, mapDispatchToProps)(component)
    }
    return connect(
        function(state, ownProps) {
            return mapStateToProps(state[storeKey], ownProps)
        },
        mapDispatchToProps
    )(component)
}


export const mergeDeep = function(...args) {
    const [first, ...rest] = args
    return fromJS(first).mergeDeep(...rest).toJS()
}

export const cloneDeep = function(arg) {
    return mergeDeep(arg instanceof Array ? [] : {}, arg)
}


export const filledArray = function(length, value) {
    return (new Array(length)).fill(value)
}

export const chunkArray = function(array, chunkSize=1) {
    const chunks = []
    // make sure passed array is not modified
    array = array.slice(0)
    while (array.length > 0) {
        chunks.push(array.splice(0, chunkSize))
    }
    return chunks
}

export const last = function(array) {
    return array[array.length - 1]
}


export const defineDrumkit = function(name, sourceFiles, spriteData, options={}) {
    const sprite = {}
    let prevTime = 0
    for (const [name, endTime] of Object.entries(spriteData)) {
        sprite[name] = [prevTime, endTime]
        prevTime = endTime
    }
    return {
        howl: new Howl({
            preload: false,
            ...options,
            src: sourceFiles,
            sprite: sprite,
        }),
        name,
        // same as howl.state() but this prop is changed by actions
        loadingState: "unloaded",
        instruments: formatInstruments(Object.keys(sprite)),
    }
}

const formatInstruments = function(instruments) {
    return instruments.map(name => {
        return `${name.charAt(0).toUpperCase()}${name.slice(1)}`.replace(/(\d+)$/g, ' $1')
    })
}
