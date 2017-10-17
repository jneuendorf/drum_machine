import React from 'react'

import MenuItem from './MenuItem'
import {defaultConnect} from '../utils'


class MeasureTemplates extends React.Component {
    render() {
        const {
            menu: {measureTemplates},
            actions: {addMeasureFromTemplate},
        } = this.props
        return (
            <MenuItem label="Measure templates" hasLabelAndChildren={true}>
                <ul>
                    {measureTemplates.map(template =>
                        <MenuItem
                            key={template.name}
                            label={template.name}
                            onClick={() => addMeasureFromTemplate(template)}
                        />
                    )}
                </ul>
            </MenuItem>
        )
    }
}


MeasureTemplates = defaultConnect(MeasureTemplates)

export {MeasureTemplates}
export default MeasureTemplates
