import React from 'react'
// import ui from 'redux-ui'

import Measure from './Measure'
import {defaultConnect} from '../utils'


// @ui({
//     state: {
//
//     },
// })
class Measures extends React.Component {
    render() {
        const {
            tab: {measures}, drumkits,
            actions: {addClonedMeasure, addMeasure}
        } = this.props
        const lastMeasure = measures[measures.length - 1]
        const drumkitName = lastMeasure ? lastMeasure.drumkit : 'default'
        const drumkit = drumkits[drumkitName]
        return (
            <div className="measures">
                {measures.map((measure, index) =>
                    <Measure
                        measure={measure}
                        index={index}
                        key={index}
                        uiKey={`Measure${index}`}
                    />
                )}
                <button
                    className="button is-primary is-small add-measure"
                    onClick={() => addClonedMeasure()}
                >
                    <span className="icon is-small">
                        <i className="fa fa-plus" />
                    </span>
                    <span>Add measure</span>
                </button>
                <button
                    className="button is-small add-measure"
                    onClick={() => addMeasure(drumkit)}
                >
                    <span className="icon is-small">
                        <i className="fa fa-plus" />
                    </span>
                    <span>Add different measure</span>
                </button>
            </div>
        )
    }
}

Measures = defaultConnect(Measures)

export {Measures}
export default Measures
