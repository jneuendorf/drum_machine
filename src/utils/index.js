import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {is, fromJS, Set} from 'immutable'

import * as Actions from '../Actions'
import {dispatch as actionTrackingDispatch} from '../store'


const mapStateToProps = function(state, ownProps) {
    return state
}
const mapDispatchToProps = function(dispatch, ownProps) {
    return {actions: bindActionCreators(Actions, actionTrackingDispatch)}
}
export const defaultConnect = function(component, storeKey) {
    if (!storeKey) {
        return connect(
            mapStateToProps,
            mapDispatchToProps,
            null,
            {withRef: true}
        )(component)
    }
    return connect(
        function(state, ownProps) {
            return mapStateToProps(state[storeKey], ownProps)
        },
        mapDispatchToProps,
        null,
        {withRef: true}
    )(component)
}


export const isInt = function(n) {
    const x = parseFloat(n)
    return !isNaN(n) && (x | 0) === x
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

export const last = function(array, condition) {
    let i = array.length - 1
    if (!condition) {
        return array[i]
    }
    while (!condition(array[i])) {
        i--
        if (i < 0) {
            return undefined
        }
    }
    return array[i]
}

// export const noop = () => {}

// Splits the array into 2 classes:
// One containing elements fulfilling the condition,
// the other with the remaining elements.
export const partition = function(array, condition) {
    const trueish = []
    const falsy = []
    for (const element of array) {
        if (condition(element)) {
            trueish.push(element)
        }
        else {
            falsy.push(element)
        }
    }
    return {trueish, falsy}
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


export const serializeState = function(storeState) {
    // eslint-disable-next-line
    const {drumkits, ...state} = storeState
    return JSON.stringify(
        Object.assign({}, state, {
            ui: state.ui.toJS()
        })
    )
}

export const deserializeState = function(serializedState) {
    const state = JSON.parse(serializedState)
    state.ui = fromJS(state.ui)
    return state
}


export const readTextFromFile = function(file, onSuccess) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        const reader = new FileReader()
        if (file) {
            reader.onload = function(event) {
                onSuccess(event.target.result, file.name)
            }
            reader.readAsText(file)
        }
    }
    else {
        alert(
            'The File APIs are not fully supported by your browser. '
            + 'Thus the file cannot be imported.'
        )
    }
}


export const fetchDemo = function(name) {
    return fetch(`demos/${name}.txt`, {method: 'GET'})
        .then(response => response.text())
}
