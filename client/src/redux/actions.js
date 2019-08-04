// actions
export const STORE_INSTANCE = "STORE_INSTANCE"
export const GET_SONGS_ID = "GET_SONGS_ID"
export const GET_USER_SONGS = "GET_USER_SONGS"
export const GET_MUSIC_TO_PLAY = "GET_MUSIC_TO_PLAY"
export const SWITCH_CURRENT_MUSIC_STATE = "SWITCH_CURRENT_MUSIC_STATE"

//action creators
export const  storeContractInstance = payload => ({
    type: STORE_INSTANCE,
    payload
})

export const getSongsId = payload => ({
    type: GET_SONGS_ID,
    payload
})

export const getUserSongs = payload => ({
    type: GET_USER_SONGS,
    payload
})

export const getSongToPlay = payload => ({
    type: GET_MUSIC_TO_PLAY,
    payload
})

export const switchCurrentMusicState = () => ({
    type: SWITCH_CURRENT_MUSIC_STATE
})