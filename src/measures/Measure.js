import React from 'react'

import InstrumentNotes from './InstrumentNotes'
import MeasureSettings from './MeasureSettings'
import Player from '../Player'
import {
    connected,
    areEqual,
} from '../utils'
import {
    getCurrentInteraction,
    getCurrentPlayPos,
} from '../selectors'
import {
    getNumberOfNotes,
    getDuration,
} from '../utils/measure'
import {ActionTypes} from '../Actions'
import pureDebug from '../utils/react-pure-render-debug'


const {GO_TO_MEASURE} = ActionTypes


@connected(
    (state, ownProps) => {
        const currentPlayPos = getCurrentPlayPos(state)
        return {
            currentInteraction: getCurrentInteraction(state),
            drumkits: state.drumkits,
            currentPlayTime: (
                currentPlayPos[0] === ownProps.index
                ? currentPlayPos[1]
                : -1
            )
        }
    },
    [
        'setCurrentMenuInteraction',
        'setCurrentPlayPos',
        'setPlayingState',
        'setShowSettings',
    ]
)
@pureDebug
class Measure extends React.PureComponent {
    // TODO (PERFORMANCE): Move this up 1 level (Measures) so it doesn't get called as often.
    componentWillReceiveProps(nextProps) {
        if (!areEqual(this.props.measure, nextProps.measure)) {
            Player.invalidateCache()
        }
    }

    componentWillUnmount() {
        Player.invalidateCache()
    }

    render() {
        const {
            drumkits,
            measure,
            index,
            count,
            currentPlayTime,
        } = this.props
        console.log('rendering measure with count', count)
        const {
            drumkit: drumkitName,
            notes,
            name,
            showSettings,
        } = measure
        const drumkit = drumkits[drumkitName]
        const {instruments} = drumkit
        const notesPerNoteValue = measure.minNoteValue / measure.noteValue
        const numberOfNotes = getNumberOfNotes(measure)
        const measureDuration = getDuration(measure)
        return (
            <div
                className="measure has-border-bottom"
                onClick={this.selectMeasure}
            >
                <div className="count">
                    {count + 1}
                    &nbsp;
                    {name !== '' ? `(${name})` : ''}
                </div>
                {instruments.map(instrument => (
                    <InstrumentNotes
                        key={instrument}
                        measureIndex={index}
                        instrument={instrument}
                        notes={notes[instrument]}
                        notesPerNoteValue={notesPerNoteValue}
                        numberOfNotes={numberOfNotes}
                        measureDuration={measureDuration}
                        currentPlayTime={currentPlayTime}
                    />
                ))}
                <a
                    className="button is-info"
                    style={{position: 'absolute', top: '26px', right: 0}}
                    onClick={this.toggleSettings}
                >
                    <span className="icon is-small">
                        <i className={`fa ${showSettings ? 'fa-close' : 'fa-cogs'}`} />
                    </span>
                </a>
                {showSettings ? this.renderSettings() : null}
            </div>
        )
    }

    renderSettings() {
        const {
            // drumkits,
            measure,
            index,
        } = this.props
        return (
            <MeasureSettings
                measure={measure}
                index={index}
            />
        )
    }

    selectMeasure = event => {
        const {
            currentInteraction,
            index: measureIndex,
            actions: {
                setCurrentMenuInteraction,
                setCurrentPlayPos,
                setPlayingState,
            }
        } = this.props
        if (currentInteraction === GO_TO_MEASURE) {
            setCurrentMenuInteraction(null)
            setCurrentPlayPos(measureIndex, 0)
            setPlayingState('pause')
        }
    }

    toggleSettings = () => {
        const {
            index: measureIndex,
            measure: {showSettings},
            actions: {setShowSettings}
        } = this.props
        setShowSettings(measureIndex, !showSettings)
    }
}

export {Measure}
export default Measure
