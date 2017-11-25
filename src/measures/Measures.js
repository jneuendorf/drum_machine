import React from 'react'

import Measure from './Measure'
import {defaultConnect} from '../utils'


class Measures extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        const {soundControls} = nextProps
        if (soundControls.playingState === 'play' && soundControls.freezeUiWhilePlaying) {
            return false
        }
        return true
    }

    render() {
        const {
            tab: {measures},
            soundControls: {playingState},
            actions: {addClonedMeasure, addEmptyMeasure}
        } = this.props
        const style = playingState === 'stop' ? {} : {pointerEvents: 'none'}
        return (
            <div className="measures" style={style}>
                {measures.map((measure, index) => {
                    return (
                        <Measure
                            measure={measure}
                            index={index}
                            key={measure.id}
                            uiKey={`Measure${measure.id}`}
                        />
                    )
                })}
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
