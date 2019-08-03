import { STORE_INSTANCE } from './actions'
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

export default combineReducers({
    web3: web3Reducer,
    accounts: accountsReducer,
    contract: contractReducer
})