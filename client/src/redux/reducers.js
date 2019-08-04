import { STORE_INSTANCE, GET_SONGS_ID, GET_USER_SONGS, GET_MUSIC_TO_PLAY, SWITCH_CURRENT_MUSIC_STATE } from './actions'
import { combineReducers } from 'redux'

const web3Reducer = (state = null, action) => {
    switch(action.type) {
        case STORE_INSTANCE:
            return action.payload.web3
        default:
            return state
    }
}

const accountsReducer = (state = null, action) => {
    switch(action.type) {
        case STORE_INSTANCE:
            return action.payload.accounts
        default:
            return state
    }
}

const contractReducer = (state = null, action) => {
    switch(action.type) {
        case STORE_INSTANCE:
            return action.payload.contract
        default:
            return state
    }
}

const songsIdReducer = (state = [], action) => {
    switch(action.type) {
        case GET_SONGS_ID:
            let ids = []
            for(let i = 0; i < action.payload; i++) {
                ids.push(i)
            }
            console.log(ids)
            return ids
        default:
            return state
    }
}

const userSongIds = (state = [], action) => {
    switch(action.type) {
        case GET_USER_SONGS:
            return action.payload
        default:
            return state
    }
}

const userSongsById = (state = {}, action) => {
    switch(action.type) {
        case GET_USER_SONGS:
            let byId = {}
            for(let i = 0; i < action.payload.length; i++) {
                byId = {...byId, [action.payload[i]]: true}
            }
            return byId
        default:
            return state
    }
}

const currentMusicReducer = (state = null, action) => {
    switch(action.type) {
        case GET_MUSIC_TO_PLAY:
            return action.payload
        default:
            return state
    }
}

export const playMusicReducer = (state = false, action) => {
    switch(action.type) {
        case SWITCH_CURRENT_MUSIC_STATE:
            return !state
        case GET_MUSIC_TO_PLAY:
            return true
        default:
            return state
    }
}

export default combineReducers({
    web3: web3Reducer,
    accounts: accountsReducer,
    contract: contractReducer,
    songsId: songsIdReducer,
    userSongs: combineReducers({
        allIds: userSongIds,
        byId: userSongsById
    }),
    musicPlayer: combineReducers({
        currentMusic: currentMusicReducer,
        play: playMusicReducer
    })
})