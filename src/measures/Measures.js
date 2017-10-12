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
            tab: {measures},
            actions: {addClonedMeasure, addEmptyMeasure}
        } = this.props
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
                {
                    measures.length === 0
                    ? null
                    : (
                        <button
                            className="button is-primary is-small add-measure"
                            onClick={() => addClonedMeasure()}
                        >
                            <span className="icon is-small">
                                <i className="fa fa-plus" />
                            </span>
                            <span>Add previous measure</span>
                        </button>
                    )
                }
                <button
                    className="button is-small add-measure"
                    onClick={() => addEmptyMeasure()}
                >
                    <span className="icon is-small">
                        <i className="fa fa-plus" />
                    </span>
                    <span>Add empty measure</span>
                </button>
            </div>
        )
    }
}

Measures = defaultConnect(Measures)

export {Measures}
export default Measures
