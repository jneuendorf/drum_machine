import React from 'react'

import Measure from './Measure'
import Comment from './Comment'
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
            actions: {addClonedMeasure, addEmptyMeasure, addComment}
        } = this.props
        const style = playingState === 'play' ? {pointerEvents: 'none'} : {}

        let measureIndex = 0

        return (
            <div className="measures" style={style}>
                {measures.map((measureOrComment, index) => {
                    if (typeof(measureOrComment) === 'string') {
                        const comment = measureOrComment
                        return <Comment comment={comment} />
                    }
                    else {
                        const measure = measureOrComment
                        return (
                            <Measure
                                measure={measure}
                                index={measureIndex++}
                                key={measure.id}
                                uiKey={`Measure${measure.id}`}
                            />
                        )
                    }
                })}
                {
                    measures.filter(measure => typeof(measure) !== 'string').length === 0
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
                <button
                    className="button is-small add-comment"
                    onClick={() => {
                        const comment = prompt('Enter your comment!', '')
                        if (comment) {
                            addComment(comment)
                        }
                    }}
                >
                    <span className="icon is-small">
                        <i className="fa fa-comment" />
                    </span>
                    <span>Add comment</span>
                </button>
            </div>
        )
    }
}

Measures = defaultConnect(Measures)

export {Measures}
export default Measures
