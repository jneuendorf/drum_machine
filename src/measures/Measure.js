import React from 'react'
import ui from 'redux-ui'

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
    ['setCurrentMenuInteraction', 'setCurrentPlayPos', 'setPlayingState']
)
@ui({
    key: (props) => props.uiKey,
    state: {
        showSettings: false,
    },
})
class Measure extends React.PureComponent {
    // TODO (PERFORMANCE): Move this up 1 level (Measures) so it doesn't get called as often.
    componentWillReceiveProps(nextProps) {
        if (!areEqual(this.props.measure, nextProps.measure)) {
            Player.invalidateCache()
        }
    }

    render() {
        const {
            drumkits,
            measure,
            index,
            count,
            currentPlayTime
            // ui,
        } = this.props
        console.log('rendering measure with count', count)
        const {drumkit: drumkitName, notes, name} = measure
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
                        <i className={`fa ${ui.showSettings ? 'fa-close' : 'fa-cogs'}`} />
                    </span>
                </a>
                {ui.showSettings ? this.renderSettings() : null}
            </div>
        )
    }

    renderSettings() {
        return (
            <MeasureSettings {...this.props} />
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
            ui,
            updateUI,
        } = this.props
        updateUI('showSettings', !ui.showSettings)
    }
}

export {Measure}
export default Measure
