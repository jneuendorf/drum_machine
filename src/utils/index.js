import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Howl} from 'howler'
import {is, fromJS, Set} from 'immutable'

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

export const areEqual = function(...args) {
    return is(...args.map(arg => fromJS(arg)))
}


export const arraysEqual = function(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }
    return true
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

export const isInt = function(n) {
    const x = parseFloat(n)
    return !isNaN(n) && (x | 0) === x
}

// ...while keeping old values when extending.
// Not in place.
export const arrayChangedSize = function(array, newSize, nullValue=null) {
    const length = array.length
    if (newSize === length) {
        return array
    }

    if (!isInt(Math.log2(length / newSize))) {
        throw new Error('newSize must be a multiple of the array\'s size.')
    }

    if (newSize < length) {
        const factor = length / newSize
        return array.filter((item, index) => index % factor === 0)
    }
    else {
        const factor = newSize / length
        return array
            // map to [item, null, null, null, ...] with length 'factor'
            .map((item, index) =>
                [item, ...filledArray(factor - 1, nullValue)]
            )
            // flatten
            .reduce((acc, arr) => [...acc, ...arr])
    }
}

export const unique = function(iterable) {
    return Set(iterable).toArray()
}


export const dict = function(tuples) {
    const res = {}
    for (const [key, value] of tuples) {
        res[key] = value
    }
    return res
}


export const getNumberOfNotes = function(numberOfBeats, noteValue, minNoteValue) {
    return numberOfBeats * (minNoteValue / noteValue)
}

export const getMsBetweenNotes = function(measure) {
    const {noteValue, minNoteValue, bpm} = measure
    // return ((numberOfBeats * 60000) / bpm) / getNumberOfNotes(numberOfBeats, noteValue, minNoteValue)
    return (noteValue * 60000) / bpm / minNoteValue
}


export const defineDrumkit = function(name, sourceFiles, sprite, options={}) {
    const instruments = Object.keys(sprite)
    // In this case we skip the is 'isLoading' state because drumkits should
    // load before the user can hit 'play' or 'manage drumkits'
    const loadingState = options.preload === true ? 'loaded' : 'unloaded'
    return {
        howl: new Howl({
            preload: false,
            ...options,
            src: sourceFiles,
            sprite: sprite,
        }),
        name,
        instruments,
        // same as howl.state() but this prop is changed by actions
        loadingState,
        formattedInstruments: formatInstruments(instruments),
    }
}

const formatInstruments = function(instruments) {
    return instruments.map(name => {
        return `${name.charAt(0).toUpperCase()}${name.slice(1)}`.replace(/(\d+)$/g, ' $1')
    })
}
