import React from 'react'

import {defaultConnect} from '../utils'


class Measure extends React.Component {
    render() {
        const {measure, drumkits} = this.props
        const {drumkit: drumkitName, notes} = measure
        const drumkit = drumkits[drumkitName]
        const {instruments} = drumkit
        return (
            <div>{instruments.map(instrument => (
                <div key={instrument}>{notes[instrument].map((note, index) => (
                    <div key={index}>a</div>
                ))}</div>
            ))}</div>
        )
    }
}

Measure = defaultConnect(Measure)

export {Measure}
export default Measure
