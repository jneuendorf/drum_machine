import React from 'react'

import {areEqual} from '../utils'


class MeasureSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {templateName: ''}
    }

    render() {
        const {
            measure,
            measure: {numberOfBeats, noteValue, minNoteValue, drumkit, bpm},
            menu: {measureTemplates},
            drumkits,
            actions: {
                setBpm,
                setNumberOfBeats,
                setNoteValue,
                setMinNoteValue,
                clearMeasure,
                removeMeasure,
                createMeasureTemplate,
            }
        } = this.props
        return (
            <div
                style={{
                    backgroundColor: 'white',
                    bottom: 0,
                    overflow: 'scroll',
                    position: 'absolute',
                    left: 0,
                    right: '36px',
                    top: 0,
                }}
            >
                <div style={{paddingBottom: 10, width: '70%'}}>
                    <div className="field">
                        <label className="label">BPM</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                value={bpm}
                                onChange={event =>
                                    setBpm(measure, parseInt(event.target.value, 10) || 120)
                                }
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Smallest displayed note value</label>
                        <div className="columns">
                            <div className="column is-narrow">
                                <div className="control">
                                    <div className="select">
                                        <select
                                            value={minNoteValue}
                                            onChange={event =>
                                                setMinNoteValue(measure, parseInt(event.target.value, 10))
                                            }
                                        >
                                            <option value="2">Half</option>
                                            <option value="4">Quarters</option>
                                            <option value="8">8th</option>
                                            <option value="16">16th</option>
                                            <option value="32">32nd</option>
                                            <option value="64">64th</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <span className="tag is-light">
                                    Setting this to a longer note value might drop notes.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">
                            Signature
                            &nbsp;
                            <span className="tag is-warning">
                                Chaning the signature will reset all notes.
                            </span>
                        </label>
                        <div className="columns">
                            <div className="column">
                                <label className="label is-small">Number of beats</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="number"
                                        value={numberOfBeats}
                                        onChange={event =>
                                            setNumberOfBeats(measure, parseInt(event.target.value, 10) || 4)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="column">
                                <label className="label is-small">Value of beat note</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="number"
                                        value={noteValue}
                                        onChange={event =>
                                            setNoteValue(measure, parseInt(event.target.value, 10) || 4)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Cleaning up</label>
                        <div className="columns">
                            <div className="column is-narrow">
                                <label className="label is-small">Clear measure</label>
                                <div className="control">
                                    <button
                                        className="button is-warning"
                                        onClick={() => clearMeasure(measure)}
                                        title="This will set all volumes to zero."
                                    >
                                        <span className="icon">
                                            <i className="fa fa-eraser" />
                                        </span>
                                        <span>Clear</span>
                                    </button>
                                </div>
                            </div>
                            <div className="column is-narrow">
                                <label className="label is-small">Delete measure</label>
                                <div className="control">
                                    <button
                                        className="button is-danger"
                                        onClick={() => removeMeasure(measure)}
                                    >
                                        <span className="icon">
                                            <i className="fa fa-remove" />
                                        </span>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Measure as Template</label>
                        <div className="columns">
                            <div className="column">
                                <label className="label is-small">Template name</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        value={this.state.templateName}
                                        onChange={(event) => this.setState({templateName: event.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="column is-narrow">
                                <label className="label is-small">&nbsp;</label>
                                <div className="control">
                                    <button
                                        className="button"
                                        onClick={() => {
                                            const {templateName} = this.state
                                            if (templateName === '') {
                                                return
                                            }
                                            // measureTemplates
                                            const equalMeasureTemplateExists = measureTemplates.some(
                                                template => areEqual(measure, template.measure)
                                            )
                                            if (equalMeasureTemplateExists) {
                                                if (!window.confirm("An equal measure template exists. Continue anyway?")) {
                                                    return
                                                }
                                            }
                                            createMeasureTemplate(templateName, measure)
                                        }}
                                    >
                                        <span className="icon">
                                            <i className="fa fa-save" />
                                        </span>
                                        <span>Create template</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Drumkit</label>
                        <div className="control">
                            <div className="select">
                                <select
                                    value={drumkit}
                                    // TODO: create change-drumkit action.
                                    onChange={() => {}}
                                >
                                    {Object.entries(drumkits).map(([name, kit]) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MeasureSettings
