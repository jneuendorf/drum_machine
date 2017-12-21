import React from 'react'
import {paramCase} from 'change-case'

import Measure from './Measure'
import Comment from './Comment'
import {connected} from '../utils'
import {
    getMeasures,
    getNonCommentMeasures,
    getIsLoading,
    getPlayingState,
    getCurrentInteraction,
} from '../selectors'

// Preload ajax loader
const SPINNER_URL = 'images/vinyl.gif'
const image = new Image()
image.src = SPINNER_URL
// Keep a reference (see https://stackoverflow.com/questions/3646036/javascript-preloading-images#comment41343860_3646036).
window.image = image


@connected(
    (state, ownProps) => {
        return {
            measures: getMeasures(state),
            nonCommentMeasures: getNonCommentMeasures(state),
            isLoading: getIsLoading(state),
            playingState: getPlayingState(state),
            currentInteraction: getCurrentInteraction(state),
        }
    },
    ['addClonedMeasure', 'addEmptyMeasure', 'addComment']
)
class Measures extends React.PureComponent {
    // shouldComponentUpdate(nextProps, nextState) {
    //     const {soundControls} = nextProps
    //     if (soundControls.playingState === 'play' && soundControls.freezeUiWhilePlaying) {
    //         return false
    //     }
    //     return true
    // }

    render() {
        const {
            measures,
            isLoading,
            playingState,
            currentInteraction,
            actions: {
                addClonedMeasure,
                addEmptyMeasure
            },
            // height,
        } = this.props

        if (isLoading) {
            return (
                <div style={{textAlign: 'center', marginTop: '150px'}}>
                    <img src={SPINNER_URL} style={{width: '48px', height: '48px'}} />
                </div>
            )
        }

        const style = playingState === 'play' ? {pointerEvents: 'none'} : {}
        let measureCount = 0
        return (
            <div
                className={`measures ${paramCase(currentInteraction) || ''}`}
                style={style}
            >
                {measures.map((measureOrComment, index) => {
                    if (typeof(measureOrComment) === 'string') {
                        const comment = measureOrComment
                        return (
                            <Comment
                                className="has-border-bottom"
                                comment={comment}
                                key={`comment${index}`}
                            />
                        )
                    }
                    else {
                        const measure = measureOrComment
                        return (
                            <Measure
                                measure={measure}
                                count={measureCount++}
                                index={index}
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
                            onClick={addClonedMeasure}
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
                    onClick={addEmptyMeasure}
                >
                    <span className="icon is-small">
                        <i className="fa fa-plus" />
                    </span>
                    <span>Add empty measure</span>
                </button>
                <button
                    className="button is-small add-comment"
                    onClick={this.handleAddComment}
                >
                    <span className="icon is-small">
                        <i className="fa fa-comment" />
                    </span>
                    <span>Add comment</span>
                </button>
            </div>
        )
    }

    handleAddComment() {
        const {actions: {addComment}} = this.props
        const comment = prompt('Enter your comment!', '')
        if (comment) {
            addComment(comment)
        }
    }
}

export {Measures}
export default Measures
