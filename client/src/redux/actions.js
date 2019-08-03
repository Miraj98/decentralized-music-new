// actions
export const STORE_INSTANCE = "STORE_INSTANCE"

//action creators
export const  storeContractInstance = payload => ({
    type: STORE_INSTANCE,
    payload
})