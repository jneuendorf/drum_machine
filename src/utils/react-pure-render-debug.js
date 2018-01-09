import deepEqual from 'fast-deep-equal'
import {diff} from 'json-diff'
import {colorizeToCallback} from 'json-diff/lib/colorize'


// from FBJS:
// https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
const is = (x, y) => {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        // Added the nonzero y check to make Flow happy, but it is redundant
        return x !== 0 || y !== 0 || 1 / x === 1 / y
    }
    else {
        // Step 6.a: NaN == NaN
        /* eslint-disable no-self-compare */
        return x !== x && y !== y
        /* eslint-enable no-self-compare */
    }
}


const theme = {
    ' ': s => [s],
    '+': s => [`%c${s}`, 'color: green'],
    '-': s => [`%c${s}`, 'color: red'],
}

const colorize = (diff) => {
    const colorStrings = []
    colorizeToCallback(diff, (color, line) => {
        colorStrings.push(theme[color](`${color}${line}`))
    })
    return [
        colorStrings.map(consoleArgs => consoleArgs[0]).join(''),
        ...colorStrings.map(consoleArgs => consoleArgs[1])
    ].filter(string => string != null)
}

const compare = (type, current, next, logging) => {
    const keysCurrent = Object.keys(current)
    for (const keyCurrent of keysCurrent) {
        const valCurrent = current[keyCurrent]
        const valNext = next[keyCurrent]
        if (!is(valCurrent, valNext)) {
            let mainMessage = `${type}.${keyCurrent} differs`
            if (deepEqual(valCurrent, valNext)) {
                mainMessage += `. %cObjects are deep-equal but not same instance.`
            }
            else {
                if (typeof(valCurrent) !== 'function' && typeof(valNext) !== 'function') {
                    const delta = colorize(diff(valCurrent, valNext))
                    // messages.push(...delta)
                    logging.debug(`${mainMessage} ${delta[0]}`, ...delta.slice(1))
                }
                else {
                    mainMessage += ` %c(${typeof(valCurrent)} -> ${typeof(valNext)}).`
                }
            }
            logging.debug(mainMessage, 'color: gray;')
        }
    }
}

const defaultLogging = console

const componentWillUpdateFactory = (componentName, logging=defaultLogging) =>
    function(nextProps, nextState) {
        logging.group(
            `%c${componentName}%c is about to update`,
            'text-decoration: underline;',
            'text-decoration: none;',
        )
        compare('props', this.props, nextProps, logging)
        if (this.state) {
            compare('state', this.state, nextState, logging)
        }
        logging.groupEnd()
    }

// Class decorator
const pureDebug = logging => WrappedComponent => {
    const componentWillUpdate = componentWillUpdateFactory(WrappedComponent.name, logging)
    if (!WrappedComponent.prototype.componentWillUpdate) {
        WrappedComponent.prototype.componentWillUpdate = componentWillUpdate
    }
    else {
        const originalComponentWillUpdate = WrappedComponent.prototype.componentWillUpdate
        WrappedComponent.prototype.componentWillUpdate = function(nextProps, nextState) {
            originalComponentWillUpdate.call(this, nextProps, nextState)
            componentWillUpdate.call(this, nextProps, nextState)
        }
    }
    return WrappedComponent
}

const defaultPureDebug = pureDebug(defaultLogging)


export {
    // componentWillUpdateFactory,
    defaultPureDebug as pureDebug
}
export default defaultPureDebug
