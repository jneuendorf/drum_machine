import React from 'react'


class StoreStateExporter extends React.Component {
    // Selects the text representing the state.
    componentDidMount() {
        const selection = getSelection()
        selection.removeAllRanges()
        const range = document.createRange()
        range.selectNode(this.stateText)
        selection.addRange(range)
    }

    render() {
        const {state} = this.props
        return (
            <div className="state" ref={(element) => this.stateText = element}>
                {state}
            </div>
        )
    }
}


export {StoreStateExporter}
export default StoreStateExporter
