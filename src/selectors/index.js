import {createSelector} from 'reselect'


export const getTab = state => state.tab
export const getMeasures = createSelector(
    getTab,
    tab => tab.measures
)
export const getIsLoading = createSelector(
    getTab,
    tab => tab.isLoading
)

export const getSoundControls = state => state.soundControls
export const getPlayingState = createSelector(
    getSoundControls,
    soundControls => soundControls.playingState
)
export const getCurrentPlayPos = createSelector(
    getSoundControls,
    soundControls => soundControls.currentPlayPos
)

export const getMenu = state => state.menu
export const getCurrentInteraction = createSelector(
    getMenu,
    menu => menu.currentInteraction
)
