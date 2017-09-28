import React from 'react'

import {defaultConnect} from '../utils'


// This is a component just for convenience (for easy connection to the store).
class SoundController extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    render() {
        return null
    }

}

SoundController = defaultConnect(SoundController)

export {SoundController}
export default SoundController
